// Wallet model (recommended structure)
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

class Wallet extends Model {
  public id!: number;
  public userId!: number;
  public tag!: string | null;
  public chain!: string; // Required field according to requirements
  public address!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Wallet.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    chain: {
      type: DataTypes.STRING,
      allowNull: false, // This is required according to your schema
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: 'wallets',
    timestamps: true,
  }
);

// Define relationship
Wallet.belongsTo(User, { foreignKey: 'userId' });

export default Wallet;