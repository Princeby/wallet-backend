import app from './app';
import sequelize from './config/database';
import { config } from './config/env';
import { User, Wallet } from './models';

const PORT = config.port;

async function initDb() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync models with database
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized.');
    
    // Create default chains if they don't exist
    // const defaultChains = [
    //   { name: 'Ethereum', symbol: 'ETH' },
    //   { name: 'Bitcoin', symbol: 'BTC' },
    //   { name: 'Binance Smart Chain', symbol: 'BSC' }
    // ];
    
    // for (const chain of defaultChains) {
    //   await Chain.findOrCreate({
    //     where: { name: chain.name },
    //     defaults: chain
    //   });
    // }
    
    console.log('Default chains created.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

// Initialize database and start server
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to start server:', err);
});