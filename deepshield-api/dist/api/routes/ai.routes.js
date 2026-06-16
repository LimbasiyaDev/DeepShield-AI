"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ai_market_service_1 = require("../../services/ai-market.service");
const router = (0, express_1.Router)();
router.post('/analyze-token', async (req, res, next) => {
    try {
        const result = await ai_market_service_1.AIMarketService.analyzeToken(req.body);
        res.json({ success: true, data: result });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
