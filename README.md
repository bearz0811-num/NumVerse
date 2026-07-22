# Numip RPG

數感宇宙文字冒險：選年段 × 數學家劇本，與 NumNum、Numi 一起解題推進劇情。  
Stack：React (Vite) + Tailwind CSS + KaTeX。

線上：[numip-rpg.vercel.app](https://numip-rpg.vercel.app)  
Repo：[github.com/bearz0811-num/numip-rpg](https://github.com/bearz0811-num/numip-rpg)

## 啟動

```bash
npm install
npm run dev
```

瀏覽器開 Local URL（通常是 `http://localhost:5173`）。

## 其他指令

```bash
npm run build              # 產出 dist/
npm run preview            # 預覽 production build
npm run generate:scripts   # 依 catalog 重產 29 本劇本 JSON
npm run validate:scripts   # 驗證 30 本劇本結構與題面規則
```

## 玩法摘要

1. 輸入名字 → 選年段（七上～九下）→ 選數學家（阿基米德／伽利略／牛頓／高斯／圖靈）
2. 進入該「年段 × 數學家」劇本（共 30 本；七上×阿基米德為手調樣板）
3. 打字機敘事推進；答題嵌在同一套互動（選 A–D 或填數字）
4. 答對續推主線；答錯繞路再抽類似題（同錨點最多再繞 2 次）
5. Eureka 只在共同領悟節點觸發；結局固定為該數學家史實收束
6. 進度與正確率存本機 `localStorage`（每劇本一檔，可中斷續玩）

題目來自 `questionBank`，依年段抽題；題面會改寫成當下劇本場景（數字／答案不變）。
