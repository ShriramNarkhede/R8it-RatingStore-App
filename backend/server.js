const express = require('express');
const sequelize = require('./config/database');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const storeRoutes = require('./routes/store');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/store', storeRoutes);

// Test DB & Sync Models
sequelize.sync({ alter: true }).then(() => {
  console.log('Database synced');
}).catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
async function startServer() {
  await connectDB();
}
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful error handlers to avoid silent crashes
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});