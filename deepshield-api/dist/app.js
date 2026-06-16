"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.httpServer = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./api/routes/auth.routes"));
const sui_routes_1 = __importDefault(require("./api/routes/sui.routes"));
const market_routes_1 = __importDefault(require("./api/routes/market.routes"));
const ai_routes_1 = __importDefault(require("./api/routes/ai.routes"));
const protection_routes_1 = __importDefault(require("./api/routes/protection.routes"));
const risk_routes_1 = __importDefault(require("./api/routes/risk.routes"));
const whale_routes_1 = __importDefault(require("./api/routes/whale.routes"));
const portfolio_routes_1 = __importDefault(require("./api/routes/portfolio.routes"));
const guardian_routes_1 = __importDefault(require("./api/routes/guardian.routes"));
const replay_routes_1 = __importDefault(require("./api/routes/replay.routes"));
const simulation_routes_1 = __importDefault(require("./api/routes/simulation.routes"));
const analytics_routes_1 = __importDefault(require("./api/routes/analytics.routes"));
const contract_routes_1 = __importDefault(require("./api/routes/contract.routes"));
const error_middleware_1 = require("./api/middleware/error.middleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.httpServer = (0, http_1.createServer)(app);
exports.io = new socket_io_1.Server(exports.httpServer, {
    cors: { origin: '*' }
});
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/auth', auth_routes_1.default);
app.use('/sui', sui_routes_1.default);
app.use('/market', market_routes_1.default);
app.use('/ai', ai_routes_1.default);
app.use('/protection', protection_routes_1.default);
app.use('/risk', risk_routes_1.default);
app.use('/whales', whale_routes_1.default);
app.use('/portfolio', portfolio_routes_1.default);
app.use('/guardian', guardian_routes_1.default);
app.use('/replay', replay_routes_1.default);
app.use('/simulation', simulation_routes_1.default);
app.use('/analytics', analytics_routes_1.default);
app.use('/contract', contract_routes_1.default);
// Socket.io
exports.io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });
});
// Error handling
app.use(error_middleware_1.errorHandler);
exports.default = app;
