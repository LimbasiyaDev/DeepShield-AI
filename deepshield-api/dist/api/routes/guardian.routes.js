"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const guardian_service_1 = require("../../services/guardian.service");
const router = (0, express_1.Router)();
router.post('/chat', async (req, res, next) => {
    try {
        const { question, context } = req.body;
        const result = await guardian_service_1.GuardianService.chat(question, context);
        res.json({ success: true, data: result });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
