"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sui_service_1 = require("../../services/sui.service");
const router = (0, express_1.Router)();
router.get('/status', async (req, res, next) => {
    try {
        const status = await sui_service_1.SuiService.getNetworkStatus();
        res.json({ success: true, data: status });
    }
    catch (error) {
        next(error);
    }
});
router.get('/balance/:address', async (req, res, next) => {
    try {
        const balance = await sui_service_1.SuiService.getWalletBalance(req.params.address);
        res.json({ success: true, data: balance });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
