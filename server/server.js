const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const dotenv = require('dotenv');
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Firebase
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL
};

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
} catch (error) {
  console.warn('Firebase initialization warning:', error.message);
}

const db = admin.database();

// In-memory storage for active games and rooms
const gameRooms = new Map();
const userSessions = new Map();
const onlineUsers = new Map();

// ============ REST API Routes ============

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Teacher Authentication
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name
    });
    
    await db.ref(`teachers/${userRecord.uid}`).set({
      name,
      email,
      createdAt: new Date().toISOString(),
      classes: [],
      students: []
    });
    
    res.status(201).json({
      success: true,
      userId: userRecord.uid,
      message: 'Teacher registered successfully'
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await admin.auth().getUserByEmail(email);
    const token = await admin.auth().createCustomToken(user.uid);
    
    res.json({
      success: true,
      token,
      userId: user.uid,
      email: user.email
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Teacher Dashboard API
app.get('/api/teacher/:teacherId/dashboard', async (req, res) => {
  try {
    const { teacherId } = req.params;
    
    const teacherData = await db.ref(`teachers/${teacherId}`).once('value');
    const studentsData = await db.ref(`students`).orderByChild('teacherId').equalTo(teacherId).once('value');
    
    const students = [];
    studentsData.forEach(snapshot => {
      students.push({
        id: snapshot.key,
        ...snapshot.val()
      });
    });
    
    let totalScore = 0;
    let totalGames = 0;
    
    students.forEach(student => {
      totalScore += student.totalScore || 0;
      totalGames += student.gamesPlayed || 0;
    });
    
    const stats = {
      totalStudents: students.length,
      totalScore,
      totalGames,
      averageScore: students.length > 0 ? Math.round(totalScore / students.length) : 0,
      averageGames: students.length > 0 ? Math.round(totalGames / students.length) : 0
    };
    
    res.json({
      success: true,
      teacher: teacherData.val(),
      students,
      stats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add student
app.post('/api/teacher/:teacherId/add-student', async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { studentName, studentEmail } = req.body;
    
    const studentId = db.ref('students').push().key;
    
    await db.ref(`students/${studentId}`).set({
      name: studentName,
      email: studentEmail,
      teacherId,
      totalScore: 0,
      gamesPlayed: 0,
      winRate: 0,
      createdAt: new Date().toISOString(),
      progress: {}
    });
    
    res.status(201).json({
      success: true,
      studentId,
      message: 'Student added successfully'
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get student progress
app.get('/api/student/:studentId/progress', async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const studentData = await db.ref(`students/${studentId}`).once('value');
    const gameHistory = await db.ref(`gameHistory/${studentId}`).once('value');
    
    const games = [];
    gameHistory.forEach(snapshot => {
      games.push({
        id: snapshot.key,
        ...snapshot.val()
      });
    });
    
    res.json({
      success: true,
      student: studentData.val(),
      gameHistory: games
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export student data
app.get('/api/teacher/:teacherId/export-data', async (req, res) => {
  try {
    const { teacherId } = req.params;
    
    const studentsData = await db.ref('students').orderByChild('teacherId').equalTo(teacherId).once('value');
    
    const students = [];
    studentsData.forEach(snapshot => {
      students.push({
        id: snapshot.key,
        ...snapshot.val()
      });
    });
    
    const csv = [
      ['Student Name', 'Email', 'Total Score', 'Games Played', 'Win Rate', 'Created At'],
      ...students.map(s => [
        s.name,
        s.email,
        s.totalScore || 0,
        s.gamesPlayed || 0,
        `${s.winRate || 0}%`,
        s.createdAt
      ])
    ];
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="student-data.csv"');
    res.send(csv.map(row => row.join(',')).join('\n'));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ Socket.io Events ============

io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);
  
  socket.on('user_join', (data) => {
    const { userId, userName } = data;
    
    userSessions.set(socket.id, {
      userId,
      userName,
      socketId: socket.id
    });
    
    onlineUsers.set(userId, {
      socketId: socket.id,
      userName,
      status: 'online'
    });
    
    io.emit('user_online', { userId, userName });
  });
  
  socket.on('create_game_room', (data) => {
    const { difficulty, mode, courseId } = data;
    const roomId = `room_${Date.now()}`;
    
    gameRooms.set(roomId, {
      id: roomId,
      host: socket.id,
      players: [socket.id],
      status: 'waiting',
      difficulty,
      mode,
      courseId,
      createdAt: new Date(),
      scores: {}
    });
    
    socket.join(roomId);
    socket.emit('room_created', { roomId });
    io.emit('room_available', { roomId, difficulty, mode, players: 1 });
  });
  
  socket.on('join_game_room', (data) => {
    const { roomId } = data;
    const room = gameRooms.get(roomId);
    
    if (room && room.players.length < 2) {
      room.players.push(socket.id);
      room.status = 'ready';
      
      socket.join(roomId);
      io.to(roomId).emit('player_joined', {
        players: room.players,
        status: 'ready'
      });
      
      setTimeout(() => {
        io.to(roomId).emit('game_start', {
          roomId,
          difficulty: room.difficulty,
          mode: room.mode
        });
      }, 1000);
    } else {
      socket.emit('join_error', { message: 'Room full or not found' });
    }
  });
  
  socket.on('submit_answer', (data) => {
    const { roomId, answer, correct, timeRemaining } = data;
    const room = gameRooms.get(roomId);
    
    if (room) {
      const score = correct ? 10 + Math.floor(timeRemaining / 10) : 0;
      
      if (!room.scores[socket.id]) {
        room.scores[socket.id] = 0;
      }
      room.scores[socket.id] += score;
      
      io.to(roomId).emit('answer_submitted', {
        playerId: socket.id,
        correct,
        score,
        totalScore: room.scores[socket.id]
      });
    }
  });
  
  socket.on('end_game', (data) => {
    const { roomId } = data;
    const room = gameRooms.get(roomId);
    
    if (room) {
      const results = Object.entries(room.scores).map(([playerId, score]) => ({
        playerId,
        score
      })).sort((a, b) => b.score - a.score);
      
      io.to(roomId).emit('game_end', {
        results,
        winner: results[0]?.playerId
      });
      
      results.forEach(result => {
        const userSession = userSessions.get(result.playerId);
        if (userSession) {
          db.ref(`gameHistory/${userSession.userId}`).push({
            roomId,
            opponent: results.find(r => r.playerId !== result.playerId)?.playerId,
            score: result.score,
            timestamp: new Date().toISOString(),
            difficulty: room.difficulty,
            mode: room.mode,
            courseId: room.courseId
          });
        }
      });
      
      setTimeout(() => {
        gameRooms.delete(roomId);
        io.emit('room_closed', { roomId });
      }, 5000);
    }
  });
  
  socket.on('disconnect', () => {
    const userSession = userSessions.get(socket.id);
    
    if (userSession) {
      onlineUsers.delete(userSession.userId);
      io.emit('user_offline', { userId: userSession.userId });
      userSessions.delete(socket.id);
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔥 Socket.io ready for multiplayer games`);
});

module.exports = { app, io, db };
