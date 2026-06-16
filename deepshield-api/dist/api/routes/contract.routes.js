"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contract_service_1 = require("../../services/contract.service");
const router = (0, express_1.Router)();
router.post('/commit', async (req, res, next) => {
    try {
        const result = await contract_service_1.ContractService.commitOrder(req.body);
        res.json({ success: true, data: result });
    }
    catch (error) {
        next(error);
    }
});
router.post('/record', async (req, res, next) => {
    try {
        const result = await contract_service_1.ContractService.recordProtection(req.body);
        res.json({ success: true, data: result });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
