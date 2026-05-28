# 開發指南

## 📋 項目結構

```
boyo800/
├── 🎮 遊戲文件
│   ├── 800.html                      # 原始版本
│   ├── game-enhanced.html            # 強化版本（推薦玩）
│   ├── game-ultimate.html            # 終極版本（最完整）
│   ├── gemini-code-1779689313661.html # 備用版本
│   ├── multiplayer-battle.html       # 🆕 連線對戰版本
│   └── teacher-dashboard.html        # 🆕 教師後台管理
│
├── 🖥️ 後端服務器
│   ├── server/
│   │   ├── server.js                 # 主服務器文件
│   │   ├── package.json              # 依賴配置
│   │   └── .env.example              # 環境變量示例
│   ├── FIREBASE_SETUP.md             # Firebase 設置指南
│   ├── API_DOCS.md                   # API 文檔
│   └── DEPLOYMENT_GUIDE.md           # 部署指南
│
├── 📚 文檔
│   ├── README.md                     # 項目介紹
│   ├── FEATURES_v2.md                # 功能說明
│   ├── SUMMARY.md                    # 技術總結
│   ├── DEPLOYMENT.md                 # 原始部署指南
│   └── DEVELOPMENT.md                # 本文件
│
└── 🔧 配置文件
    └── .github/workflows/            # CI/CD 工作流
```

## 🚀 快速開始

### 開發環境設置

```bash
# 1. 克隆倉庫
git clone https://github.com/paul890119/boyo800.git
cd boyo800

# 2. 切換到開發分支
git checkout full-system-development

# 3. 後端設置
cd server
npm install
cp .env.example .env
# 編輯 .env 文件，填入 Firebase 認證信息

# 4. 啟動後端
npm run dev
# 伺服器運行於 http://localhost:5000

# 5. 啟動前端（新終端）
cd ..
python -m http.server 8000
# 訪問 http://localhost:8000
```

## 🎮 遊戲文件說明

### game-enhanced.html
- 大小：37.1 KB
- 功能：完整的遊戲體驗
- 適合：日常玩耍
- 特性：難度系統、成就、進度追蹤、主題系統

### game-ultimate.html
- 大小：113.5 KB
- 功能：最完整版本
- 適合：生產環境
- 特性：所有高級功能 + 優化

### multiplayer-battle.html
- 大小：動態加載
- 功能：實時對戰
- 適合：多人遊玩
- 特性：Socket.io 集成、排行榜、房間系統

### teacher-dashboard.html
- 大小：動態加載
- 功能：教師管理
- 適合：教育管理
- 特性：學生管理、進度監控、數據導出

## 🔧 後端架構

### 技術棧

```javascript
// 框架
Express.js 4.18.2      // Web 框架
Socket.io 4.6.0        // 實時通訊

// 數據庫
Firebase Admin 12.0.0  // 實時數據庫

// 認證
JWT (jsonwebtoken)     // 令牌認證
bcryptjs               // 密碼加密

// 工具
CORS                   // 跨域請求
env (dotenv)           // 環境變量
```

### API 結構

```
/api/
├── /auth
│   ├── POST /register      # 教師註冊
│   └── POST /login         # 教師登入
│
├── /teacher/:teacherId
│   ├── GET /dashboard      # 獲取儀表板
│   ├── POST /add-student   # 添加學生
│   └── GET /export-data    # 導出數據
│
└── /student/:studentId
    └── GET /progress       # 獲取進度
```

### Socket.io 事件

```javascript
// 用戶管理
socket.on('user_join')         // 用戶加入
socket.on('disconnect')         // 用戶離線

// 遊戲房間
socket.on('create_game_room')   // 創建房間
socket.on('join_game_room')     // 加入房間

// 遊戲邏輯
socket.on('submit_answer')      // 提交答案
socket.on('end_game')           // 結束遊戲
```

## 📝 編碼規範

### JavaScript

```javascript
// 使用 ES6+ 標準
const API_BASE = 'http://localhost:5000/api';

// 函數命名使用 camelCase
function getUserData() {}

// 常量使用 UPPER_CASE
const MAX_PLAYERS = 2;
const QUESTION_TIME_LIMIT = 30;

// 使用箭頭函數
const handleClick = () => {};

// 使用 async/await
async function fetchData() {
  try {
    const response = await fetch(API_BASE);
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### HTML/CSS

```html
<!-- 使用語義化標籤 -->
<header></header>
<nav></nav>
<main></main>
<footer></footer>

<!-- 使用 Tailwind CSS 類名 -->
<div class="flex items-center justify-between p-4 bg-white rounded-lg shadow">
  <span class="text-lg font-bold">標題</span>
</div>

<!-- 使用 data 屬性存儲數據 -->
<button data-id="123" data-action="delete">刪除</button>
```

## 🧪 測試

### 手動測試檢查清單

#### 遊戲功能
- [ ] 遊戲能正常加載
- [ ] 所有三種模式可運行
- [ ] 難度切換正常
- [ ] 成就系統正常
- [ ] 進度保存正常
- [ ] 主題切換正常

#### 教師後台
- [ ] 教師能登入
- [ ] 可以添加學生
- [ ] 儀表板顯示正確數據
- [ ] 進度追蹤正常
- [ ] 數據導出正常

#### 對戰系統
- [ ] Socket.io 連接正常
- [ ] 房間創建成功
- [ ] 可以加入房間
- [ ] 實時分數更新
- [ ] 遊戲結束正常

### 自動化測試

```bash
# 運行單元測試
npm test

# 運行集成測試
npm run test:integration

# 生成覆蓋率報告
npm run test:coverage
```

## 🐛 調試技巧

### 瀏覽器控制台

```javascript
// 檢查遊戲狀態
console.log(GameState);

// 檢查 Socket 連接
console.log(socket.connected);

// 監聽 Socket 事件
socket.onAny((event, ...args) => {
  console.log(event, args);
});

// 測試 API
fetch('/api/health')
  .then(r => r.json())
  .then(console.log);
```

### 後端日誌

```bash
# 實時查看 Heroku 日誌
heroku logs --tail -a boyo800-backend

# 查看特定時間範圍的日誌
heroku logs -a boyo800-backend --since 1h

# 查看錯誤日誌
heroku logs -a boyo800-backend | grep ERROR
```

### Firebase 調試

```javascript
// 在 Firebase Console 中啟用調試
db.enableLogging(true);

// 監聽數據變化
db.ref('students').on('value', snapshot => {
  console.log('Students updated:', snapshot.val());
});
```

## 📦 依賴更新

### 檢查過時依賴

```bash
cd server
npm outdated
```

### 更新依賴

```bash
# 更新所有依賴
npm update

# 更新特定包
npm install express@latest

# 安全更新
npm audit fix
```

## 🔄 版本控制

### 分支策略

```
main (生產)
  ↑
  ├─ full-system-development (開發)
  │   ├─ feature/multiplayer
  │   ├─ feature/teacher-dashboard
  │   └─ bugfix/socket-connection
  │
  └─ staging (測試)
```

### 提交信息格式

```bash
# 功能
git commit -m "feat: Add multiplayer battle system"

# 修復
git commit -m "fix: Fix Socket.io connection issue"

# 文檔
git commit -m "docs: Update API documentation"

# 性能
git commit -m "perf: Optimize Firebase queries"

# 測試
git commit -m "test: Add unit tests for game logic"
```

## 🚀 部署流程

### 本地到 Heroku

```bash
# 1. 提交更改
git add .
git commit -m "feat: Update features"

# 2. 推送到 GitHub
git push origin full-system-development

# 3. 推送到 Heroku
git push heroku full-system-development:main

# 4. 檢查部署狀態
heroku logs --tail -a boyo800-backend
```

### GitHub Pages 部署

```bash
# HTML 文件會自動通過 GitHub Pages 部署
# 訪問: https://paul890119.github.io/boyo800/
```

## 📊 性能優化

### 前端優化

1. **代碼分割**
   ```html
   <!-- 按需加載模塊 -->
   <script src="module.js" defer></script>
   ```

2. **圖片優化**
   ```html
   <!-- 使用 CDN 載入資源 -->
   <script src="https://cdn.tailwindcss.com"></script>
   ```

3. **緩存策略**
   ```javascript
   // 使用 localStorage 緩存
   localStorage.setItem('gameState', JSON.stringify(state));
   ```

### 後端優化

1. **數據庫查詢優化**
   ```javascript
   // 使用索引
   db.ref('students').orderByChild('teacherId')
   ```

2. **連接池**
   ```javascript
   // Firebase 自動管理連接
   admin.database().goOffline();
   ```

3. **頻率限制**
   ```javascript
   // 實現速率限制
   const rateLimit = require('express-rate-limit');
   ```

## 🔐 安全性檢查

### 代碼安全

- [ ] 沒有硬編碼密鑰
- [ ] 所有敏感信息在 `.env` 中
- [ ] 啟用了 CORS 保護
- [ ] 實現了 JWT 認證
- [ ] 驗證了所有用戶輸入
- [ ] 啟用了 HTTPS

### 數據安全

- [ ] 密碼已加密（bcrypt）
- [ ] 敏感數據已加密
- [ ] 定期備份數據
- [ ] 實現了速率限制
- [ ] 審計日誌已啟用

## 📚 相關資源

- [Firebase 文檔](https://firebase.google.com/docs)
- [Express.js 文檔](https://expressjs.com/)
- [Socket.io 文檔](https://socket.io/docs/)
- [Tailwind CSS 文檔](https://tailwindcss.com/docs)
- [MDN Web 文檔](https://developer.mozilla.org/)

## 💡 常見問題

### Q: 如何本地調試 Socket.io？
**A:** 在瀏覽器控制台中：
```javascript
socket.onAny((event, ...args) => {
  console.log(`Event: ${event}`, args);
});
```

### Q: 如何重置 Firebase 數據？
**A:** 在 Firebase Console 中選擇 Realtime Database → 規則 → 測試模式 → 刪除數據

### Q: 如何查看 Heroku 變量？
**A:** 
```bash
heroku config -a boyo800-backend
```

### Q: 如何回滾到之前的版本？
**A:** 
```bash
git revert <commit-hash>
git push heroku
```

## 🤝 貢獻指南

1. 創建新分支：`git checkout -b feature/your-feature`
2. 提交更改：`git commit -am 'Add feature'`
3. 推送到分支：`git push origin feature/your-feature`
4. 提交 Pull Request

## 📞 聯繫方式

- **GitHub Issues**: 報告 bug 或提出功能請求
- **Email**: paul890119@example.com
- **Discord**: 加入開發社群

---

**最後更新:** 2026-05-28
**維護者:** @paul890119
