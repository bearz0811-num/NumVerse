#!/usr/bin/env python3
"""Extract playable questions from AIDA HTML banks -> src/data/questionBank.json"""

from __future__ import annotations

import html as html_lib
import json
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "src" / "data" / "questionBank.json"

FILES = [
    ("七年級-第一部分.html", 7, 1),
    ("七年級-第二部分.html", 7, 2),
    ("八年級-第一部分.html", 8, 1),
    ("八年級-第二部分.html", 8, 2),
    ("九年級-第一部分.html", 9, 1),
    ("九年級-第二部分.html", 9, 2),
]

DIFF_MAP = {
    "★☆☆ 易": "易",
    "★★☆ 中": "中",
    "★★★ 難": "難",
}


def decode_entities(s: str) -> str:
    return html_lib.unescape(s)


def replace_katex(fragment: str) -> str:
    out = []
    i = 0
    while True:
        start = fragment.find('<span class="katex">', i)
        if start < 0:
            out.append(fragment[i:])
            break
        out.append(fragment[i:start])
        pos = start + len('<span class="katex">')
        depth = 1
        while pos < len(fragment) and depth:
            next_open = fragment.find("<span", pos)
            next_close = fragment.find("</span>", pos)
            if next_close < 0:
                break
            if next_open != -1 and next_open < next_close:
                depth += 1
                pos = next_open + 5
            else:
                depth -= 1
                pos = next_close + len("</span>")
        katex_block = fragment[start:pos]
        ann = re.search(
            r'<annotation encoding="application/x-tex">([\s\S]*?)</annotation>',
            katex_block,
        )
        if ann:
            out.append(f" {decode_entities(ann.group(1)).strip()} ")
        else:
            t = re.sub(r"<[^>]+>", "", katex_block)
            out.append(f" {decode_entities(t).strip()} ")
        i = pos
    return "".join(out)


def html_to_text(fragment: str) -> str:
    if not fragment:
        return ""
    s = replace_katex(fragment)
    s = re.sub(r"<br\s*/?>", "\n", s, flags=re.I)
    s = re.sub(r"</p\s*>", "\n", s, flags=re.I)
    s = re.sub(r"<li[^>]*>", "\n- ", s, flags=re.I)
    s = re.sub(r"<[^>]+>", "", s)
    s = decode_entities(s)
    s = s.replace("\u200b", "").replace("−", "-").replace("－", "-")
    s = re.sub(r"[ \t]+", " ", s)
    s = re.sub(r" *\n *", "\n", s)
    s = re.sub(r"\n{3,}", "\n\n", s)
    s = re.sub(r" +", " ", s)
    return s.strip()


def extract_final_answer_raw(block: str) -> str:
    finals = re.findall(r"最終答案:\s*([\s\S]*?)(?:</p>|</div>)", block)
    if not finals:
        return ""
    return html_to_text(finals[-1])


def extract_numeric(ans: str) -> str | None:
    a = ans.strip()
    a = re.sub(r"\$[^$]*\$", "", a)
    a = a.replace("\u200b", "").strip()
    a = re.sub(r"\s+", " ", a)
    a = a.replace("−", "-").replace("－", "-")

    m = re.fullmatch(r"([+-]?\d+(?:\.\d+)?)", a)
    if m:
        return m.group(1)

    m = re.fullmatch(r"([+-]?\d+(?:\.\d+)?)\s*([^\d]*)$", a)
    if m:
        unit = m.group(2).strip()
        if re.search(r"[=:xy√∠]|或|和|,|，", unit, re.I):
            return None
        return m.group(1)

    m = re.fullmatch(r"([+-]?\d+)\s*/\s*(\d+)", a)
    if m:
        return f"{m.group(1)}/{m.group(2)}"

    return None


def extract_choice(block: str):
    m = re.search(
        r'<div class="options">([\s\S]*?)</div>\s*<div class="card-section">',
        block,
    )
    if not m:
        return None, []
    ob = m.group(1)
    chunks = re.split(r'<div class="option( correct)?">', ob)
    options = []
    correct = None
    for j in range(1, len(chunks), 2):
        flag = chunks[j]
        body = chunks[j + 1] if j + 1 < len(chunks) else ""
        text = html_to_text(body).replace("✓", "").strip()
        lm = re.match(r"^([A-D])\.\s*(.*)$", text, re.S)
        if lm:
            letter, content = lm.group(1), lm.group(2).strip()
        else:
            letter = chr(ord("A") + len(options))
            content = text
        options.append({"letter": letter, "text": content})
        if flag:
            correct = letter
    return correct, options


def parse_meta(meta: str):
    parts = [p.strip() for p in meta.split("·")]
    knowledge = parts[0] if parts else meta
    chapter = parts[2] if len(parts) > 2 else ""
    return knowledge, chapter


def main():
    stats = Counter()
    questions = []
    seen_ids = set()

    for fname, grade, half in FILES:
        data = (ROOT / fname).read_text(encoding="utf-8", errors="replace")
        parts = re.split(r'<div class="card" id="q(\d+)">', data)[1:]
        for i in range(0, len(parts), 2):
            qid, block = parts[i], parts[i + 1]
            stats["total"] += 1

            qtype = re.search(r'<span class="qtype">([^<]+)</span>', block).group(1)
            diff_raw = re.search(
                r'<span class="difficulty">([^<]+)</span>', block
            ).group(1)
            difficulty = DIFF_MAP.get(diff_raw, diff_raw)
            meta = re.search(r'<div class="meta">([^<]*)</div>', block).group(1)
            knowledge, chapter = parse_meta(meta)
            content_html = re.search(
                r'<div class="content">([\s\S]*?)</div>', block
            ).group(1)
            question_text = html_to_text(content_html)
            has_options = '<div class="options">' in block

            if has_options:
                letter, options = extract_choice(block)
                if not letter or len(options) < 2:
                    stats["skip_choice_bad"] += 1
                    continue
                answer_type = "choice"
                answer = letter
                stats["kept_choice"] += 1
            else:
                raw = extract_final_answer_raw(block)
                num = extract_numeric(raw)
                if num is None:
                    stats["skip_non_numeric_open"] += 1
                    continue
                answer_type = "number"
                answer = num
                options = None
                stats["kept_number"] += 1

            uid = int(qid)
            if uid in seen_ids:
                stats["dup_id"] += 1
                continue
            seen_ids.add(uid)

            if not knowledge or not question_text or not difficulty or answer == "":
                stats["skip_empty_core"] += 1
                continue

            item = {
                "id": uid,
                "knowledgePoint": knowledge,
                "question": question_text,
                "difficulty": difficulty,
                "answer": answer,
                "answerType": answer_type,
                "questionType": qtype,
                "grade": grade,
                "half": half,
                "chapter": chapter,
                "source": fname,
            }
            if options is not None:
                item["options"] = options
            questions.append(item)

    questions.sort(key=lambda x: x["id"])
    out = {
        "version": 1,
        "rule": (
            "has_options -> choice(A-D from option.correct); "
            "else numeric(strip unit); else discard"
        ),
        "count": len(questions),
        "stats": {
            "totalCards": stats["total"],
            "keptChoice": stats["kept_choice"],
            "keptNumber": stats["kept_number"],
            "skippedNonNumericOpen": stats["skip_non_numeric_open"],
            "skippedChoiceBad": stats["skip_choice_bad"],
            "skippedEmptyCore": stats["skip_empty_core"],
            "duplicateIds": stats["dup_id"],
        },
        "questions": questions,
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUT}")
    print(f"count={out['count']}")
    print(json.dumps(out["stats"], ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
