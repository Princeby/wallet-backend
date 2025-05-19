"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
// Authentication routes
router.post('/signin', validation_1.validateEmail, validation_1.validatePassword, authController_1.signin);
router.post('/signout', authController_1.signout);
router.post('/register', validation_1.validateEmail, validation_1.validatePassword, authController_1.register);
exports.default = router;
