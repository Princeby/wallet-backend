// src/scripts/run-migration.ts
import { up } from '../migrations/20250518120000-create-users-and-wallets';
import sequelize from '../config/database';

async function runMigration() {
  try {
    console.log('Starting migration...');
    await up(sequelize.getQueryInterface());
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();