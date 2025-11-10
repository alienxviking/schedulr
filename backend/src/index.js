// 1. Import Dependencies
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const jobRoutes = require('./routes/job.routes'); 
const {loadAllJobs} = require('./services/scheduler.service');

// 2. Load Environment Variables
dotenv.config();

// 3. Connect to Database
(async () => {
  await connectDB();
  await loadAllJobs(); 
})();

// 4. Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;

// 5. Mount Middleware
app.use(cors());
app.use(express.json());

// 6. Basic "Hello World" Route
app.get('/', (req, res) => {
  res.send('Schedulr API is running!');
});

// 7. Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes); // <-- NEW: Tell Express to use job routes

// 8. Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});