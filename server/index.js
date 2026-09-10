require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const app = express();
// Connect Database
connectDB();
// Init Middleware 
app.use(express.json());
app.use(cors());
// Define Routes 
app.use('/api/auth', require('./routes/auth'));
app.use('/api/subjects', require('./routes/subjects'));
app.use('/api/chapters', require('./routes/chapters'));
app.use('/api/topics', require('./routes/topics'));
app.use('/api/assessment', require('./routes/assessment'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/achievements', require('./routes/achievements'));
app.use('/api/store', require('./routes/store'));
app.use('/api/recommendations', require('./routes/recommendations'));
app.use('/api/study-plan', require('./routes/studyPlan'));
app.use('/api/leaderboard', require('./routes/leaderboard'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/adaptive', require('./routes/adaptive'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));











