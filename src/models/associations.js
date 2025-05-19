"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("./User"));
const Wallet_1 = __importDefault(require("./Wallet"));
// Set up associations after all models are defined
const setupAssociations = () => {
    // User has many wallets
    User_1.default.hasMany(Wallet_1.default, {
        sourceKey: 'id',
        foreignKey: 'userId',
        as: 'wallets'
    });
    // Wallet belongs to a user
    Wallet_1.default.belongsTo(User_1.default, {
        targetKey: 'id',
        foreignKey: 'userId',
        as: 'user'
    });
};
exports.default = setupAssociations;
