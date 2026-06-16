"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractService = void 0;
class ContractService {
    static async commitOrder(orderDetails) {
        console.log('Mocking OrderVault.move commit_order():', orderDetails);
        return { success: true, digest: '0x' + Math.random().toString(16).substring(2) };
    }
    static async revealOrder(commitDigest) {
        console.log('Mocking OrderVault.move reveal_order():', commitDigest);
        return { success: true, executedAt: Date.now() };
    }
    static async saveRiskReport(report) {
        console.log('Mocking RiskRegistry.move save_risk_report():', report);
        return { success: true, objectId: '0x' + Math.random().toString(16).substring(2) };
    }
    static async recordProtection(tradeData) {
        console.log('Mocking ProtectionRegistry.move record_protected_trade():', tradeData);
        return { success: true, objectId: '0x' + Math.random().toString(16).substring(2) };
    }
}
exports.ContractService = ContractService;
