# API 文檔

## 🔑 認證 API

### 教師註冊

**端點:** `POST /api/auth/register`

**請求:**
```json
{
  "name": "李老師",
  "email": "teacher@example.com",
  "password": "securePassword123"
}
```

**響應:**
```json
{
  "success": true,
  "userId": "teacher123",
  "message": "Teacher registered successfully"
}
```

### 教師登入

**端點:** `POST /api/auth/login`

**請求:**
```json
{
  "email": "teacher@example.com",
  "password": "securePassword123"
}
```

**響應:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "teacher123",
  "email": "teacher@example.com"
}
```

## 📊 教師儀表板 API

### 獲取儀表板數據

**端點:** `GET /api/teacher/:teacherId/dashboard`

**響應:**
```json
{
  "success": true,
  "teacher": {
    "name": "李老師",
    "email": "teacher@example.com",
    "createdAt": "2026-05-26"
  },
  "students": [
    {
      "id": "student1",
      "name": "王小明",
      "email": "wang@example.com",
      "totalScore": 850,
      "gamesPlayed": 12,
      "winRate": 85,
      "totalStars": 35
    }
  ],
  "stats": {
    "totalStudents": 25,
    "totalScore": 18500,
    "totalGames": 320,
    "averageScore": 740,
    "averageGames": 12
  }
}
```

### 新增學生

**端點:** `POST /api/teacher/:teacherId/add-student`

**請求:**
```json
{
  "studentName": "陳美芬",
  "studentEmail": "chen@example.com"
}
```

**響應:**
```json
{
  "success": true,
  "studentId": "student_new123",
  "message": "Student added successfully"
}
```

### 獲取學生進度

**端點:** `GET /api/student/:studentId/progress`

**響應:**
```json
{
  "success": true,
  "student": {
    "id": "student1",
    "name": "王小明",
    "email": "wang@example.com",
    "totalScore": 850,
    "gamesPlayed": 12,
    "winRate": 85,
    "totalStars": 35
  },
  "gameHistory": [
    {
      "id": "game1",
      "score": 920,
      "stars": 3,
      "mode": "recognition",
      "difficulty": "normal",
      "courseId": 5,
      "timestamp": "2026-05-28T07:30:00Z",
      "opponent": "player456"
    }
  ]
}
```

### 導出學生數據

**端點:** `GET /api/teacher/:teacherId/export-data`

**響應:** CSV 格式
```
Student Name,Email,Total Score,Games Played,Win Rate,Created At
王小明,wang@example.com,850,12,85%,2026-05-25T10:00:00Z
陳美芬,chen@example.com,920,15,90%,2026-05-26T12:00:00Z
```

## 🎮 Socket.io 事件

### 用戶加入

**事件:** `user_join`

**發送數據:**
```javascript
socket.emit('user_join', {
  userId: 'user123',
  userName: '王小明'
});
```

**接收事件:** `user_online`
```javascript
socket.on('user_online', (data) => {
  console.log(`${data.userName} 已上線`);
});
```

### 建立遊戲房間

**事件:** `create_game_room`

**發送數據:**
```javascript
socket.emit('create_game_room', {
  difficulty: 'normal',
  mode: 'recognition',
  courseId: 5
});
```

**接收事件:** `room_created`
```javascript
socket.on('room_created', (data) => {
  console.log(`房間已建立: ${data.roomId}`);
});
```

### 加入遊戲房間

**事件:** `join_game_room`

**發送數據:**
```javascript
socket.emit('join_game_room', {
  roomId: 'room_123456'
});
```

**接收事件:**
- `player_joined` - 玩家已加入
- `game_start` - 遊戲開始
- `join_error` - 加入失敗

### 提交答案

**事件:** `submit_answer`

**發送數據:**
```javascript
socket.emit('submit_answer', {
  roomId: 'room_123456',
  answer: 'study',
  correct: true,
  timeRemaining: 15000  // 毫秒
});
```

**接收事件:** `answer_submitted`
```javascript
socket.on('answer_submitted', (data) => {
  console.log(`${data.playerId} 得分: ${data.score}`);
  console.log(`總分: ${data.totalScore}`);
});
```

### 結束遊戲

**事件:** `end_game`

**發送數據:**
```javascript
socket.emit('end_game', {
  roomId: 'room_123456'
});
```

**接收事件:** `game_end`
```javascript
socket.on('game_end', (data) => {
  console.log('遊戲結果:', data.results);
  console.log('勝者:', data.winner);
});
```

## 📈 數據格式

### 學生對象

```javascript
{
  id: 'student_xyz',
  name: '王小明',
  email: 'wang@example.com',
  teacherId: 'teacher_abc',
  totalScore: 850,
  gamesPlayed: 12,
  winRate: 85,
  totalStars: 35,
  createdAt: '2026-05-25T10:00:00Z',
  progress: {
    'L1_recognition': 3,
    'L1_scramble': 2,
    'L1_spelling': 3
  }
}
```

### 遊戲歷史對象

```javascript
{
  id: 'game_123',
  roomId: 'room_456',
  opponent: 'socketId_789',
  score: 920,
  timestamp: '2026-05-28T07:30:00Z',
  difficulty: 'normal',
  mode: 'recognition',
  courseId: 5
}
```

## ❌ 錯誤響應

### 400 Bad Request
```json
{
  "error": "Invalid input parameters"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid credentials"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## 🧪 測試 cURL 命令

### 教師登入
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@example.com",
    "password": "password123"
  }'
```

### 獲取儀表板
```bash
curl http://localhost:5000/api/teacher/teacher_123/dashboard
```

### 新增學生
```bash
curl -X POST http://localhost:5000/api/teacher/teacher_123/add-student \
  -H "Content-Type: application/json" \
  -d '{
    "studentName": "王小明",
    "studentEmail": "wang@example.com"
  }'
```

## 📝 API 版本

當前 API 版本: **v1.0**

所有端點都使用 `/api/` 前綴。

