"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const protection_service_1 = require("../../services/protection.service");
const router = (0, express_1.Router)();
router.post('/analyze', async (req, res, next) => {
    try {
        const { pair, amount, slippage, wallet } = req.body;
        const result = await protection_service_1.ProtectionService.analyze(pair, amount, slippage, wallet);
        res.json({ success: true, data: result });
    }
    catch (error) {
        next(error);
    }
});
router.post('/execute', async (req, res, next) => {
    try {
        const result = await protection_service_1.ProtectionService.execute(req.body);
        res.json({ success: true, data: result });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
