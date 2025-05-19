"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Wallet model (recommended structure)
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const User_1 = __importDefault(require("./User"));
class Wallet extends sequelize_1.Model {
}
Wallet.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
        references: {
            model: 'users',
            key: 'id',
        },
    },
    tag: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    chain: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false, // This is required according to your schema
    },
    address: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    sequelize: database_1.default,
    tableName: 'wallets',
    timestamps: true,
});
// Define relationship
Wallet.belongsTo(User_1.default, { foreignKey: 'userId' });
exports.default = Wallet;
