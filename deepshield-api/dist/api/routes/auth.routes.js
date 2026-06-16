"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verify_1 = require("@mysten/sui/verify");
const prisma_1 = require("../../database/prisma");
const router = (0, express_1.Router)();
const nonces = new Map(); // In-memory nonce store for hackathon
router.post('/nonce', (req, res) => {
    const { walletAddress } = req.body;
    const nonce = 'DeepShield-Nonce-' + Math.random().toString(36).substring(2) + Date.now();
    nonces.set(walletAddress, nonce);
    res.json({ success: true, data: { nonce } });
});
router.post('/verify', async (req, res, next) => {
    try {
        const { walletAddress, signature, messageBytes } = req.body;
        // For Hackathon, if signature is bypassed (demo mode):
        if (signature === 'demo-mode') {
            let user = await prisma_1.prisma.user.findUnique({ where: { walletAddress } });
            if (!user)
                user = await prisma_1.prisma.user.create({ data: { walletAddress } });
            const token = jsonwebtoken_1.default.sign({ id: user.id, wallet: walletAddress }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
            return res.json({ success: true, data: { token, user } });
        }
        // Actual verification using @mysten/sui
        const publicKey = await (0, verify_1.verifyPersonalMessageSignature)(new Uint8Array(Buffer.from(messageBytes, 'base64')), signature);
        if (publicKey.toSuiAddress() !== walletAddress) {
            return res.status(401).json({ success: false, message: 'Invalid signature' });
        }
        let user = await prisma_1.prisma.user.findUnique({ where: { walletAddress } });
        if (!user) {
            user = await prisma_1.prisma.user.create({ data: { walletAddress } });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, wallet: walletAddress }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
        res.json({ success: true, data: { token, user } });
    }
    catch (error) {
        next(error);
    }
});
router.get('/profile', async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret');
        const user = await prisma_1.prisma.user.findUnique({ where: { id: decoded.id } });
        res.json({ success: true, data: user });
    }
    catch (error) {
        next(error);
    }
});
router.post('/logout', (req, res) => {
    res.json({ success: true, message: 'Logged out successfully' });
});
exports.default = router;
