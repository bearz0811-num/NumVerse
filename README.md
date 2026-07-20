# MATH WAGER — 下注解題

中學數學練習小遊戲：選策略 → 答題 → 結算。  
Stack：React (Vite) + Tailwind CSS + Lucide + canvas-confetti。

## 啟動

```bash
npm install
npm run dev
```

瀏覽器開終端機顯示的 Local URL（通常是 `http://localhost:5173`）。

## 其他指令

```bash
npm run build    # 產出 dist/
npm run preview  # 預覽 production build
```

## 玩法摘要

1. **穩健作答**：答對 +底金×連勝倍率，答錯不扣錢  
2. **自信爆擊**：答對 +底金×3×連勝倍率，答錯 −底金  
3. **戰術換題**：花 $20 跳題  

資產 `< $20` 會觸發破產救濟（+$500）。錢包存在 `localStorage`。
