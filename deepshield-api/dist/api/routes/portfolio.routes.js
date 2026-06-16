"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const portfolio_service_1 = require("../../services/portfolio.service");
const router = (0, express_1.Router)();
router.get('/:wallet', async (req, res, next) => {
    try {
        const analysis = await portfolio_service_1.PortfolioService.analyze(req.params.wallet);
        res.json({ success: true, data: analysis });
    }
    catch (error) {
        next(error);
    }
});
router.post('/analyze', async (req, res, next) => {
    try {
        const { walletAddress } = req.body;
        const analysis = await portfolio_service_1.PortfolioService.analyze(walletAddress);
        res.json({ success: true, data: analysis });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
