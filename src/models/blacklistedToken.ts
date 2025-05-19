import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface BlacklistedTokenAttributes {
  id: string;
  token: string;
  userId: number;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

type BlacklistedTokenCreationAttributes = Optional<BlacklistedTokenAttributes, 'id' | 'createdAt' | 'updatedAt'>;

class BlacklistedToken extends Model<BlacklistedTokenAttributes, BlacklistedTokenCreationAttributes>
  implements BlacklistedTokenAttributes {
  public id!: string;
  public token!: string;
  public userId!: number;
  public expiresAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Static method to check if a token is blacklisted
  public static async isTokenBlacklisted(token: string): Promise<boolean> {
    const found = await BlacklistedToken.findOne({ where: { token } });
    return !!found;
  }
}

BlacklistedToken.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'user_id',
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'expires_at',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at',
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at',
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'BlacklistedToken',
    tableName: 'blacklisted_tokens',
    timestamps: true,
    underscored: true,
  }
);

export default BlacklistedToken;
