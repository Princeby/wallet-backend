"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const walletController_1 = require("../controllers/walletController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
// Apply auth middleware to all wallet routes
router.use(auth_1.authMiddleware);
// Wallet routes
router.get('/', walletController_1.getAllWallets);
router.post('/', validation_1.validateWalletInput, walletController_1.createWallet);
router.get('/:id', walletController_1.getWalletById);
router.put('/:id', validation_1.validateWalletInput, walletController_1.updateWallet);
router.delete('/:id', walletController_1.deleteWallet);
exports.default = router;
