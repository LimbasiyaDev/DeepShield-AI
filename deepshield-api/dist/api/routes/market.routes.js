"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const deepbook_service_1 = require("../../services/deepbook.service");
const router = (0, express_1.Router)();
router.get('/tokens', async (req, res, next) => {
    try {
        const markets = await deepbook_service_1.DeepBookService.getMarkets();
        res.json({ success: true, data: markets });
    }
    catch (error) {
        next(error);
    }
});
router.get('/:token', async (req, res, next) => {
    try {
        const liquidity = await deepbook_service_1.DeepBookService.getLiquidity(req.params.token);
        res.json({ success: true, data: liquidity });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
