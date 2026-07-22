# 數感宇宙：理性的神殿

**NumVerse: Temple of Reason**

CRT 終端機風文字 RPG。玩家與 NumNum、Numi、姐弟穿越到歷史數學家的人生片段，用數學解謎推進劇情，在關鍵節點做哲學抉擇，蒐集 Eureka 幣與結局成就。

- 線上：https://numverse.vercel.app
- Repo：https://github.com/bearz0811-num/NumVerse

## 啟動

```bash
npm install
npm run dev
```

開 Local URL（通常 `http://localhost:5173`）。

```bash
npm run build
npm run preview
```

## 產品現況（MVP）

| 項目 | 說明 |
| --- | --- |
| 內容矩陣 | 5 位數學家 × 3 人生段（青年／壯年／暮年）＝ 15 章槽位 |
| 可玩章節 | 阿基米德・青年（`ARCHIMEDES_YOUTH`） |
| 介面 | CRT 敘事殼、打字機、KaTeX |
| 解謎節奏 | `problem → branch → quiz → narrative` |
| 結局 | 哲學抉擇 → 雙結局（冷酷神殿／溫暖之光） |
| Eureka | 只在真正領悟／通關結局發放；一般答對不發 |
| 資源條 | Sanity 5、Insight 6；歸零回檢查點 |
| 存檔 | 本機 `localStorage`（`NUMVERSE_SAVE_DATA`），無登入 |
| 練習 | 通關後可抽題庫練習（依年段帶） |

### 阿基米德・青年主線

終端連線 → 澡堂浮力 Eureka → 帳本差額 → 工坊熔爐 → 密度 → 浮力秤（`x = 7`）→ 審判前夜哲學抉擇 → 雙結局。

## 目錄

```
src/
  App.jsx                 # 畫面狀態機與章節 runtime
  components/             # 打字機、KaTeX
  data/
    chapters/             # 章節主線資料（現行唯一內容來源）
    questionBank.json     # 練習模式題庫
  lib/numverse/           # 存檔、常數、練習抽題
public/question-images/   # 題庫配圖
```

## 章節資料契約（摘要）

每章為資料物件：`id`、`title`、`nodes[]`、`endings[]`、`eurekaMax`、`nextChapterId`…

節點型態：

- `narrative` — 台詞推進；可掛 checkpoint／Eureka pending
- `problem` — 劇情化題面
- `branch` — 姐弟等選項（可耗 Insight）
- `quiz` — 驗算；答錯扣 Sanity
- `philosophy` — 重大抉擇，寫入 flags 並跳單一結局
- `ending` — 結局結算、成就解鎖

## 技術

- React + Vite + Tailwind
- 部署：Vercel 專案 `numverse` → https://numverse.vercel.app

## 下一步（內容）

以阿基米德・青年為樣板，依同一節點契約填其餘 14 章（同數學家先壯年／暮年，再開其他數學家青年篇）。
