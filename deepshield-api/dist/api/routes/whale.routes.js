"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const whale_service_1 = require("../../services/whale.service");
const router = (0, express_1.Router)();
router.get('/:token', async (req, res, next) => {
    try {
        const whales = await whale_service_1.WhaleService.scanWhales(req.params.token);
        res.json({ success: true, data: whales });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
