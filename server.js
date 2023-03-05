/* eslint-disable */
import dotenv from 'dotenv';
import 'colors';

const connectDB = require('./config/db');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 🔥 Shutting down...'.red.bold);
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

connectDB();

app.set('port', process.env.PORT || 7777);

const server = app.listen(app.get('port'), () =>
  console.log(`Server running on port → ${server.address().port}`.cyan.bold)
);

process.on('SIGTERM', () => {
  console.log('👏 SIGTERM RECEIVED, Shutting down gracefully');
  server.close(() => {
    console.log('🔥 Process terminated');
  });
});
