"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlacklistedToken = exports.Wallet = exports.User = void 0;
const User_1 = __importDefault(require("./User"));
exports.User = User_1.default;
const Wallet_1 = __importDefault(require("./Wallet"));
exports.Wallet = Wallet_1.default;
const blacklistedToken_1 = __importDefault(require("./blacklistedToken"));
exports.BlacklistedToken = blacklistedToken_1.default;
const associations_1 = __importDefault(require("./associations"));
(0, associations_1.default)();
