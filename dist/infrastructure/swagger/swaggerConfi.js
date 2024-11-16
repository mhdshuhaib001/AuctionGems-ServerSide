"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerDocs = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const port = process.env.PORT;
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'My API',
        version: '1.0.0',
        description: 'API documentation for my application',
    },
    servers: [
        {
            url: `http://localhost:${port}`,
            description: 'Development server',
        },
    ],
};
const options = {
    swaggerDefinition,
    apis: ['./src/adaptors/AuthController/authController*.ts'],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
exports.swaggerDocs = {
    serve: swagger_ui_express_1.default.serve,
    setup: swagger_ui_express_1.default.setup(swaggerSpec),
};
