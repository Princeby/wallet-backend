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
// src/scripts/run-migration.ts
const _20250518120000_create_users_and_wallets_1 = require("../migrations/20250518120000-create-users-and-wallets");
const database_1 = __importDefault(require("../config/database"));
function runMigration() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Starting migration...');
            yield (0, _20250518120000_create_users_and_wallets_1.up)(database_1.default.getQueryInterface());
            console.log('Migration completed successfully!');
            process.exit(0);
        }
        catch (error) {
            console.error('Migration failed:', error);
            process.exit(1);
        }
    });
}
runMigration();
