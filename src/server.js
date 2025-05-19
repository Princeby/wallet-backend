"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const database_1 = __importDefault(require("./config/database"));
const env_1 = require("./config/env");
const PORT = env_1.config.port;
function initDb() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Test database connection
            yield database_1.default.authenticate();
            console.log('Database connection established successfully.');
            // Sync models with database
            yield database_1.default.sync({ alter: true });
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
        }
        catch (error) {
            console.error('Unable to connect to the database:', error);
            process.exit(1);
        }
    });
}
// Initialize database and start server
initDb().then(() => {
    app_1.default.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to start server:', err);
});
