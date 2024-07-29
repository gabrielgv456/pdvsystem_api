"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const index_1 = __importDefault(require("./middlewares/auth/index"));
const routes_1 = __importDefault(require("./routes/routes"));
const corsOptions = {
    //PRODUCTION:
    origin: ['https://safyra.com.br', 'https://www.safya.com.br', 'https://*.safyra.com.br'],
    //DEVELOPMENT:
    //origin: "*",
    optionsSuccessStatus: 200
};
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, cors_1.default)(corsOptions));
app.use('/files', express_1.default.static('files'));
app.use((0, index_1.default)()); // all routes below have authorization validation
app.use(routes_1.default);
app.listen(2211, () => console.log('Server Up on 2211 port'));
