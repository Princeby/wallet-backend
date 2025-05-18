import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ChainAttributes {
  id: number;
  name: string;
  symbol: string;
  rpcUrl?: string;
}

type ChainCreationAttributes = Optional<ChainAttributes, 'id'>;

export class Chain extends Model<ChainAttributes, ChainCreationAttributes>
  implements ChainAttributes {
  public id!: number;
  public name!: string;
  public symbol!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Chain.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    symbol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Chain',
    tableName: 'chains',
    timestamps: true,
  }
);
