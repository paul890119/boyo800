# 系統部署指南

## 📋 部署架構

```
┌─────────────────────────────────────┐
│     前端應用 (GitHub Pages)         │
│  - game-enhanced.html               │
│  - game-ultimate.html               │
│  - teacher-dashboard.html           │
│  - multiplayer-battle.html          │
└──────────────┬──────────────────────┘
               │ HTTPS
               ↓
┌─────────────────────────────────────┐
│     後端伺服器 (Node.js)            │
│  - Express API                      │
│  - Socket.io 實時通信              │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│     Firebase 實時資料庫             │
│  - 教師數據                         │
│  - 學生進度                         │
│  - 遊戲歷史                         │
└─────────────────────────────────────┘
```

## 🚀 本地開發部署

### 1. 環境準備

```bash
# 安裝 Node.js (v16 或更高)
node --version  # 檢查版本

# 克隆倉庫
git clone https://github.com/paul890119/boyo800.git
cd boyo800
```

### 2. 後端設置

```bash
# 進入伺服器目錄
cd server

# 安裝依賴
npm install

# 建立 .env 檔案（參見 FIREBASE_SETUP.md）
cp .env.example .env
# 編輯 .env 並填入 Firebase 認證信息

# 啟動開發伺服器
npm run dev
# 伺服器在 http://localhost:5000 運行
```

### 3. 前端本地測試

直接在瀏覽器中打開 HTML 文件：

```bash
# 選項 A: 直接打開
open game-enhanced.html

# 選項 B: 使用 Python 簡易伺服器
python -m http.server 8000
# 訪問 http://localhost:8000
```

### 4. 完整本地測試

```bash
# 終端 1 - 啟動後端
cd server && npm run dev

# 終端 2 - 啟動前端伺服器
python -m http.server 8000

# 訪問
# - 遊戲: http://localhost:8000/game-enhanced.html
# - 教師後台: http://localhost:8000/teacher-dashboard.html
# - 對戰: http://localhost:8000/multiplayer-battle.html
```

## ☁️ Heroku 部署（後端）

### 1. 安裝 Heroku CLI

```bash
# macOS
brew tap heroku/brew && brew install heroku

# Windows
choco install heroku-cli

# Linux
curl https://cli-assets.heroku.com/install.sh | sh
```

### 2. 建立 Heroku 應用

```bash
# 登入 Heroku
heroku login

# 建立新應用
heroku create boyo800-backend

# 檢查應用
heroku apps:info boyo800-backend
```

### 3. 設置環境變數

```bash
heroku config:set -a boyo800-backend \
  FIREBASE_PROJECT_ID=your-project-id \
  FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..." \
  FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com \
  FIREBASE_DATABASE_URL=https://your-project.firebaseio.com \
  JWT_SECRET=your-super-secret-key \
  CLIENT_URL=https://paul890119.github.io/boyo800 \
  NODE_ENV=production
```

### 4. 部署到 Heroku

```bash
# 初始化 Git 倉庫（如果還沒有）
git init
git add .
git commit -m "Initial commit"

# 添加 Heroku 遠程
heroku git:remote -a boyo800-backend

# 推送到 Heroku
git push heroku full-system-development:main

# 查看日誌
heroku logs --tail -a boyo800-backend

# 查看應用 URL
heroku open -a boyo800-backend
```

### 5. 驗證部署

```bash
# 測試健康檢查
curl https://boyo800-backend.herokuapp.com/api/health

# 應該返回:
# {"status":"OK","timestamp":"2026-05-28T...","uptime":123}
```

## 🌐 GitHub Pages 部署（前端）

### 1. 啟用 GitHub Pages

1. 進入 GitHub 倉庫設置
2. 選擇「Settings」→ "Pages"
3. 選擇分支：`full-system-development`
4. 選擇目錄：`/ (root)`
5. 點擊「Save"

### 2. 驗證部署

訪問以下 URL：
```
https://paul890119.github.io/boyo800/game-enhanced.html
https://paul890119.github.io/boyo800/teacher-dashboard.html
https://paul890119.github.io/boyo800/multiplayer-battle.html
```

## 🔧 配置更新

### 更新後端 URL

編輯以下文件中的 `API_BASE` 和 `SOCKET_URL`：

**teacher-dashboard.html:**
```javascript
const API_BASE = 'https://boyo800-backend.herokuapp.com/api';
```

**multiplayer-battle.html:**
```javascript
const SOCKET_URL = 'https://boyo800-backend.herokuapp.com';
```

## 📊 監控和日誌

### Heroku 日誌

```bash
# 查看實時日誌
heroku logs --tail -a boyo800-backend

# 查看過去日誌
heroku logs -a boyo800-backend
```

### Firebase 監控

1. 進入 Firebase Console
2. 選擇「Realtime Database」
3. 查看「使用量」和「規則」

## 🆘 故障排查

### 問題 1: 無法連接到後端

**解決方案：**
```bash
# 檢查 Heroku 應用狀態
heroku ps -a boyo800-backend

# 重啟應用
heroku ps:restart -a boyo800-backend

# 檢查日誌
heroku logs --tail -a boyo800-backend
```

### 問題 2: Firebase 連接失敗

**解決方案：**
- 檢查 Firebase 認證信息是否正確
- 驗證 `.env` 檔案中的 `FIREBASE_DATABASE_URL`
- 確認 Firebase 資料庫規則允許讀寫操作

### 問題 3: Socket.io 連接失敗

**解決方案：**
- 檢查瀏覽器主控台的 CORS 錯誤
- 驗證後端 CORS 配置
- 確保前端的 `SOCKET_URL` 正確

## 📈 性能優化

### 1. 壓縮前端文件

```bash
# 使用 gzip 壓縮
gzip -k game-enhanced.html
gzip -k teacher-dashboard.html
gzip -k multiplayer-battle.html
```

### 2. 使用 CDN

所有 HTML 文件已配置使用以下 CDN：
- TailwindCSS: `cdn.tailwindcss.com`
- Chart.js: `cdn.jsdelivr.net`
- Lucide Icons: `unpkg.com/lucide`
- Socket.io: `cdn.socket.io`

### 3. 啟用 Heroku 的 Redis 快取

```bash
heroku addons:create heroku-redis:premium-0 -a boyo800-backend
```

## 🔐 安全檢查清單

- [ ] 所有敏感信息已從 Git 中移除（使用 `.env`）
- [ ] Firebase 安全規則已正確配置
- [ ] JWT 密鑰已更改為強密鑰
- [ ] 啟用了 HTTPS
- [ ] CORS 已正確限制
- [ ] 環境變數已保密設置

## 📚 相關文檔

- [Firebase 設置指南](./FIREBASE_SETUP.md)
- [API 文檔](./API_DOCS.md)
- [開發指南](./DEVELOPMENT.md)

## 🎯 下一步

1. ✅ 完成本地開發設置
2. ✅ 測試所有功能
3. ✅ 部署到 Heroku
4. ✅ 配置 GitHub Pages
5. ✅ 進行完整測試
6. ✅ 宣傳應用

