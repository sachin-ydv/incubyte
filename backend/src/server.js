require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const seedVehicles = require('./data/seedVehicles');
const seedUsers = require('./data/seedUsers');

const DEFAULT_PORT = Number(process.env.PORT) || 5000;

/**
 * Start server with retry when port is in use.
 * If the requested port is taken (EADDRINUSE), try the next one up to a limit.
 */
const startServer = async () => {
  await connectDB();

  if (process.env.NODE_ENV !== 'test') {
    await seedVehicles();
    await seedUsers();
  }

  let port = DEFAULT_PORT;
  const maxAttempts = 5;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      await new Promise((resolve, reject) => {
        const server = app
          .listen(port)
          .on('listening', () => {
            console.log(`Server running on port ${port}`);
            resolve();
          })
          .on('error', (err) => {
            reject(err);
          });
      });

      // started successfully
      return;
    } catch (err) {
      if (err && err.code === 'EADDRINUSE') {
        console.warn(`Port ${port} in use — trying port ${port + 1}`);
        port = Number(port) + 1;
        // small delay before retrying
        await new Promise((r) => setTimeout(r, 250));
        continue;
      }

      console.error('Server failed to start', err);
      process.exit(1);
    }
  }

  console.error(`Unable to bind after ${maxAttempts} attempts starting at port ${DEFAULT_PORT}`);
  process.exit(1);
};

startServer().catch((error) => {
  console.error('Server failed to start', error);
  process.exit(1);
});
