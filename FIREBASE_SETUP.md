# Firebase 配置指南

## 📋 Firebase 設置步驟

### 1. 建立 Firebase 項目

1. 訪問 [Firebase Console](https://console.firebase.google.com/)
2. 點擊「建立項目」
3. 輸入項目名稱：`boyo800-backend`
4. 選擇計費方案（可選免費方案）
5. 完成建立

### 2. 建立實時資料庫

1. 在左側選單選擇「建立資料庫」
2. 選擇地區：`亞太地區 (台灣)`
3. 安全規則選擇「以測試模式啟動」
4. 完成建立

### 3. 建立服務帳戶金鑰

1. 點擊右上方的齒輪圖標 → 「專案設定」
2. 進入「服務帳戶」選項卡
3. 點擊「產生新的私密金鑰」
4. 會下載一個 JSON 檔案，保存好此檔案

### 4. 配置環境變數

在 `server` 目錄中建立 `.env` 檔案：

```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com

PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-12345678
CLIENT_URL=http://localhost:3000
```

### 5. Firebase 資料庫結構

```
boyo800/
├── teachers/
│   └── {teacherId}
│       ├── name: "李老師"
│       ├── email: "teacher@example.com"
│       ├── createdAt: "2026-05-28"
│       ├── classes: []
│       └── students: []
│
├── students/
│   └── {studentId}
│       ├── name: "王小明"
│       ├── email: "student@example.com"
│       ├── teacherId: "teacher123"
│       ├── totalScore: 850
│       ├── gamesPlayed: 12
│       ├── winRate: 85
│       ├── totalStars: 35
│       ├── createdAt: "2026-05-25"
│       └── progress: {}
│
└── gameHistory/
    └── {studentId}
        └── {gameId}
            ├── roomId: "room_xxx"
            ├── opponent: "socketId"
            ├── score: 920
            ├── timestamp: "2026-05-28T07:30:00Z"
            ├── difficulty: "normal"
            ├── mode: "recognition"
            └── courseId: 5
```

## 🔐 Firebase 安全規則

進入「Realtime Database」→ 「規則」，設置以下規則：

```json
{
  "rules": {
    "teachers": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "students": {
      ".read": "auth !== null",
      "$studentId": {
        ".write": "auth !== null"
      }
    },
    "gameHistory": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

## 📦 依賴安裝

```bash
cd server
npm install
```

## 🚀 啟動伺服器

開發模式（會自動重新啟動）：
```bash
npm run dev
```

生產模式：
```bash
npm start
```

## ✅ 測試連接

伺服器啟動後，訪問：
```
http://localhost:5000/api/health
```

如果回傳 `{"status":"OK","timestamp":"..."}` 表示成功。

## 🌐 環境變數範例

### 開發環境
```
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### 生產環境
```
PORT=5000
NODE_ENV=production
CLIENT_URL=https://paul890119.github.io/boyo800
```

## 🔗 API 端點列表

### 認證
- `POST /api/auth/register` - 教師註冊
- `POST /api/auth/login` - 教師登入

### 教師儀表板
- `GET /api/teacher/:teacherId/dashboard` - 獲取儀表板數據
- `POST /api/teacher/:teacherId/add-student` - 新增學生
- `GET /api/student/:studentId/progress` - 獲取學生進度
- `GET /api/teacher/:teacherId/export-data` - 導出學生數據

### Socket.io 事件
- `user_join` - 用戶加入
- `create_game_room` - 建立遊戲房間
- `join_game_room` - 加入遊戲房間
- `submit_answer` - 提交答案
- `end_game` - 結束遊戲
- `disconnect` - 用戶斷開連接

## 📚 參考資源

- [Firebase 官方文檔](https://firebase.google.com/docs)
- [Socket.io 文檔](https://socket.io/docs/)
- [Express.js 文檔](https://expressjs.com/)

## ❓ 常見問題

### Q: 如何重置 Firebase 資料庫？
**A:** 在 Firebase Console 中選擇「Realtime Database」→ 點擊三點選單 → 「刪除資料庫」

### Q: 如何測試 Socket.io 連接？
**A:** 在瀏覽器中打開 `multiplayer-battle.html` 並檢查瀏覽器主控台

### Q: 如何部署到雲端？
**A:** 參見下一節部署指南

