# 🚀 部署指南 - 博幼 800 單

## 快速開始

### 本地測試
1. 下載 `game-enhanced.html`
2. 用瀏覽器直接打開文件
3. 享受遊戲！

### 推薦瀏覽器
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

---

## 部署到 GitHub Pages

### 方法 1：直接上傳到主分支

```bash
# 1. 切換到 main 分支
git checkout main

# 2. 合併增強版本
git merge game-enhancement-v2

# 3. 推送到遠程
git push origin main

# 4. 在 Settings → Pages 中啟用 GitHub Pages
# 選擇 main 分支作為發布源
```

### 方法 2：使用 Actions 自動部署

GitHub 會自動偵測 HTML 文件並部署。

---

## 文件結構說明

```
boyo800/
├── game-enhanced.html          ← ⭐ 最新升級版本
├── 800.html                    ← 原始版本（備份）
├── gemini-code-*.html          ← 舊版本
├── FEATURES_v2.md              ← 功能文檔
├── DEPLOYMENT.md               ← 此文件
└── README.md                   ← 項目介紹
```

---

## 實時訪問方式

部署後可通過以下方式訪問：

```
https://paul890119.github.io/boyo800/game-enhanced.html
```

---

## 功能驗證清單

### 遊戲流程
- [ ] 首頁正常載入
- [ ] 課程選擇滾動流暢
- [ ] 難度選擇界面顯示正確
- [ ] 三種模式都能開始遊戲
- [ ] 計時器正常運作
- [ ] 答題邏輯正確

### 統計與進度
- [ ] 遊戲結束後保存分數
- [ ] 進度統計頁面顯示正確
- [ ] 星級計算無誤
- [ ] 課程進度可視化正常

### 成就系統
- [ ] 成就頁面能顯示所有徽章
- [ ] 完成遊戲後檢查成就解鎖

### UI/UX
- [ ] 深色模式運作正常
- [ ] 淺色模式運作正常
- [ ] 主題切換流暢
- [ ] 響應式設計在手機上正常

---

## 常見問題排查

### 問題 1：音效不播放
**解決方案：**
- 檢查瀏覽器是否允許音效
- 確認系統音量已打開
- 嘗試在遊戲設置中啟用/禁用

### 問題 2：進度無法保存
**解決方案：**
- 檢查瀏覽器 LocalStorage 是否被禁用
- 清除瀏覽器快取後重試
- 嘗試使用隱私模式

### 問題 3：語音發音不工作
**解決方案：**
- 確認瀏覽器支持 Web Speech API
- 檢查系統語言設置
- 確認已安裝文本語音系統

### 問題 4：遊戲加載緩慢
**解決方案：**
- 檢查網路連接
- 清除瀏覽器快取
- 使用無痕模式重試

---

## 性能優化建議

### 已實現的優化
✅ 單一 HTML 文件（無需多次請求）
✅ CDN 引入框架
✅ 效率的狀態管理
✅ 可視區域動畫優化

### 進階優化選項
```html
<!-- 啟用 DNS 預解析 -->
<link rel="dns-prefetch" href="https://cdn.tailwindcss.com">

<!-- 預連接 CDN -->
<link rel="preconnect" href="https://esm.sh">

<!-- 預加載關鍵資源 -->
<link rel="preload" as="script" href="...">
```

---

## 擴展與自訂

### 修改遊戲時間限制
在 `DIFFICULTY_SETTINGS` 中編輯：
```javascript
const DIFFICULTY_SETTINGS = {
  easy: { 
    name: '簡單', 
    timePerQuestion: 150,  // ← 修改此值（毫秒）
    healthBonus: 2, 
    scoreMultiplier: 1 
  },
  // ...
};
```

### 添加新課程
```javascript
const vocabularyData = {
  // ...
  41: [
    { en: "word", zh: "單字" },
    // ... 更多單字
  ]
};
```

### 修改成就條件
```javascript
const ACHIEVEMENTS = {
  custom_achievement: { 
    id: 'custom_achievement', 
    name: '自訂成就', 
    desc: '描述文字', 
    icon: '🎯' 
  },
  // ...
};
```

---

## 備份與恢復

### 導出用戶進度
用戶可手動導出進度（建議添加此功能）：
```javascript
// 導出進度為 JSON
const progress = localStorage.getItem('boyoGameProgress_v2');
console.log(JSON.parse(progress));

// 複製到安全位置進行備份
```

### 恢復進度
```javascript
// 粘貼備份的進度
localStorage.setItem('boyoGameProgress_v2', JSON.stringify(backupData));
```

---

## 安全性建議

### 已實現的安全措施
✅ 本地存儲（無伺服器需求）
✅ 輸入驗證
✅ 無敏感信息洩露

### 進階安全選項
- [ ] 添加用戶認證系統
- [ ] 實現伺服器端數據驗證
- [ ] 加密敏感數據
- [ ] 定期安全審計

---

## 監測與分析

### 推薦集成工具
- **Google Analytics** - 用戶行為追蹤
- **Sentry** - 錯誤監測
- **Hotjar** - 用戶熱力圖

### 追蹤代碼示例
```javascript
// 添加到遊戲初始化
window.dataLayer = window.dataLayer || [];
gtag('event', 'game_start', {
  lesson: selectedLesson,
  mode: selectedMode,
  difficulty: selectedDifficulty
});
```

---

## 更新日誌

### v2.0.0 (2026-05-25)
✨ 完全重構
- ✅ 新增難度系統
- ✅ 成就系統
- ✅ 進度統計儀表板
- ✅ 主題切換
- ✅ 本地持久化
- ✅ 增強 UI/UX

### v1.0.0 (2026-05-25)
🎮 原始版本
- 基礎三種遊戲模式
- 40 課程系統
- 本地進度保存

---

## 支持與反饋

### 報告問題
1. 訪問 GitHub Issues
2. 提供以下信息：
   - 瀏覽器版本
   - 操作系統
   - 錯誤描述
   - 複現步驟

### 功能建議
歡迎提交功能建議！請詳細說明：
- 功能用途
- 預期行為
- 使用場景

---

## 許可證與使用條款

MIT License - 自由使用、修改和分發

---

## 致謝

感謝所有測試者和貢獻者！

