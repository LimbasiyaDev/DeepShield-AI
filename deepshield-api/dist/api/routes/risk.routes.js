"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const risk_service_1 = require("../../services/risk.service");
const router = (0, express_1.Router)();
router.post('/calculate', async (req, res, next) => {
    try {
        const risk = await risk_service_1.RiskService.calculateRisk(req.body);
        res.json({ success: true, data: risk });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
