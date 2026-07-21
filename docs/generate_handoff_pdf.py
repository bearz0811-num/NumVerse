"""Render the Numip RPG handoff HTML as a portable PDF.

Usage:
  PYTHONPATH=/path/to/reportlab:/path/to/beautifulsoup4 \
    python3 docs/generate_handoff_pdf.py
"""

from html import escape
from pathlib import Path

from bs4 import BeautifulSoup, NavigableString, Tag
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    KeepTogether,
    PageBreak,
    Paragraph,
    Preformatted,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "numip-rpg-ai-handoff.html"
OUTPUT = ROOT / "numip-rpg-ai-handoff.pdf"
FONT_PATH = "/System/Library/Fonts/STHeiti Medium.ttc"

pdfmetrics.registerFont(TTFont("NumipCJK", FONT_PATH, subfontIndex=0))
pdfmetrics.registerFont(TTFont("NumipMono", "/System/Library/Fonts/Monaco.ttf"))

base = getSampleStyleSheet()
styles = {
    "body": ParagraphStyle(
        "Body",
        parent=base["BodyText"],
        fontName="NumipCJK",
        fontSize=9.4,
        leading=15,
        textColor=colors.HexColor("#182036"),
        spaceAfter=5,
    ),
    "h1": ParagraphStyle(
        "H1",
        parent=base["Title"],
        fontName="NumipCJK",
        fontSize=25,
        leading=33,
        textColor=colors.HexColor("#253A73"),
        spaceAfter=15,
    ),
    "h2": ParagraphStyle(
        "H2",
        parent=base["Heading2"],
        fontName="NumipCJK",
        fontSize=16,
        leading=22,
        textColor=colors.HexColor("#253A73"),
        spaceBefore=11,
        spaceAfter=7,
        keepWithNext=True,
    ),
    "h3": ParagraphStyle(
        "H3",
        parent=base["Heading3"],
        fontName="NumipCJK",
        fontSize=11.5,
        leading=17,
        textColor=colors.HexColor("#30477D"),
        spaceBefore=7,
        spaceAfter=4,
        keepWithNext=True,
    ),
    "small": ParagraphStyle(
        "Small",
        parent=base["BodyText"],
        fontName="NumipCJK",
        fontSize=7.8,
        leading=12,
        textColor=colors.HexColor("#667089"),
        spaceAfter=5,
    ),
    "bullet": ParagraphStyle(
        "Bullet",
        parent=base["BodyText"],
        fontName="NumipCJK",
        fontSize=9.2,
        leading=14.5,
        leftIndent=12,
        firstLineIndent=-8,
        bulletIndent=2,
        textColor=colors.HexColor("#182036"),
        spaceAfter=3,
    ),
    "table": ParagraphStyle(
        "Table",
        parent=base["BodyText"],
        fontName="NumipCJK",
        fontSize=7.8,
        leading=11.5,
        textColor=colors.HexColor("#182036"),
    ),
    "cover_subtitle": ParagraphStyle(
        "CoverSubtitle",
        parent=base["BodyText"],
        fontName="NumipCJK",
        fontSize=13,
        leading=21,
        textColor=colors.HexColor("#556078"),
        spaceAfter=12,
    ),
    "footer": ParagraphStyle(
        "Footer",
        parent=base["BodyText"],
        fontName="NumipCJK",
        fontSize=7,
        leading=9,
        alignment=TA_CENTER,
        textColor=colors.HexColor("#77809A"),
    ),
}


def inline_html(node):
    if isinstance(node, NavigableString):
        return escape(str(node))
    if not isinstance(node, Tag):
        return ""
    content = "".join(inline_html(child) for child in node.children)
    if node.name in {"strong", "b"}:
        return f"<b>{content}</b>"
    if node.name == "code":
        return f'<font name="NumipMono" color="#283C72">{content}</font>'
    if node.name == "br":
        return "<br/>"
    return content


def paragraph(tag, style="body"):
    return Paragraph("".join(inline_html(child) for child in tag.children), styles[style])


def list_flowables(tag):
    ordered = tag.name == "ol"
    result = []
    for index, item in enumerate(tag.find_all("li", recursive=False), start=1):
        marker = f"{index}." if ordered else "•"
        result.append(
            Paragraph(
                f"{marker} {''.join(inline_html(child) for child in item.children)}",
                styles["bullet"],
            )
        )
    result.append(Spacer(1, 3))
    return result


def table_flowable(tag):
    rows = []
    for row in tag.find_all("tr"):
        cells = row.find_all(["th", "td"], recursive=False)
        if cells:
            rows.append([paragraph(cell, "table") for cell in cells])
    if not rows:
        return Spacer(1, 0)
    columns = len(rows[0])
    widths = [170 * mm / columns] * columns
    if columns == 4:
        widths = [11 * mm, 35 * mm, 30 * mm, 94 * mm]
    elif columns == 3:
        widths = [22 * mm, 18 * mm, 130 * mm]
    table = Table(rows, colWidths=widths, repeatRows=1, hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#E8ECF5")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#253A73")),
                ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#CCD3E3")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )
    return table


def convert_children(parent, story, cover=False):
    for child in parent.children:
        if not isinstance(child, Tag):
            continue
        if child.name == "h1":
            story.append(paragraph(child, "h1"))
        elif child.name == "h2":
            story.append(paragraph(child, "h2"))
        elif child.name == "h3":
            story.append(paragraph(child, "h3"))
        elif child.name == "p":
            classes = child.get("class", [])
            style = "cover_subtitle" if cover and "subtitle" in classes else "body"
            if "small" in classes or "meta" in classes:
                style = "small"
            story.append(paragraph(child, style))
        elif child.name in {"ul", "ol"}:
            story.extend(list_flowables(child))
        elif child.name == "table":
            story.append(table_flowable(child))
            story.append(Spacer(1, 8))
        elif child.name == "pre":
            story.append(
                Preformatted(
                    child.get_text(),
                    ParagraphStyle(
                        "Pre",
                        fontName="NumipMono",
                        fontSize=7.3,
                        leading=10.5,
                        leftIndent=8,
                        rightIndent=8,
                        borderColor=colors.HexColor("#586EAE"),
                        borderWidth=0.5,
                        borderPadding=7,
                        backColor=colors.HexColor("#F3F5FA"),
                        spaceBefore=4,
                        spaceAfter=8,
                    ),
                    maxLineLength=95,
                )
            )
        elif child.name == "div":
            classes = child.get("class", [])
            if "flow" in classes:
                story.append(
                    Preformatted(
                        child.get_text(),
                        ParagraphStyle(
                            "Flow",
                            fontName="NumipMono",
                            fontSize=7.7,
                            leading=11,
                            borderColor=colors.HexColor("#CCD3E3"),
                            borderWidth=0.5,
                            borderPadding=7,
                            backColor=colors.HexColor("#F8F9FC"),
                            spaceBefore=4,
                            spaceAfter=8,
                        ),
                    )
                )
            else:
                convert_children(child, story, cover=cover)
                story.append(Spacer(1, 5))


def add_page_number(canvas, doc):
    canvas.saveState()
    canvas.setFont("NumipCJK", 7)
    canvas.setFillColor(colors.HexColor("#77809A"))
    canvas.drawCentredString(A4[0] / 2, 8 * mm, str(doc.page))
    canvas.restoreState()


def build():
    soup = BeautifulSoup(SOURCE.read_text(encoding="utf-8"), "html.parser")
    story = []
    sections = soup.body.find_all("section", recursive=False)
    for index, section in enumerate(sections):
        is_cover = "cover" in section.get("class", [])
        if index and "page-break" in section.get("class", []):
            story.append(PageBreak())
        if is_cover:
            story.append(Spacer(1, 55 * mm))
        convert_children(section, story, cover=is_cover)
        if is_cover:
            story.append(PageBreak())

    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        leftMargin=17 * mm,
        rightMargin=17 * mm,
        topMargin=16 * mm,
        bottomMargin=16 * mm,
        title="Numip RPG 產品與技術交接文件",
        author="Numip RPG project",
        subject="AI conversation, product, architecture, features and design handoff",
    )
    doc.build(story, onFirstPage=add_page_number, onLaterPages=add_page_number)


if __name__ == "__main__":
    build()
    print(OUTPUT)
