/* eslint-disable */
import dotenv from 'dotenv';
import 'colors';

import app from './app.js';
import connectDB from './config/db.js';

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 🔥 Shutting down...'.red.bold);
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

app.set('port', process.env.PORT || 7777);

const server = app.listen(app.get('port'), async () => {
  await connectDB();
  console.log(`Server running on port → ${server.address().port}`.cyan.bold)
});

process.on('SIGTERM', () => {
  console.log('👏 SIGTERM RECEIVED, Shutting down gracefully');
  server.close(() => {
    console.log('🔥 Process terminated');
  });
});
