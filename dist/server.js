"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./app/config"));
const DB_1 = __importDefault(require("./app/DB"));
const AppError_1 = __importDefault(require("./app/errors/AppError"));
const corn_jobs_1 = require("./app/helpers/corn.jobs");
let server;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(config_1.default.db_url);
            yield (0, DB_1.default)();
            (0, corn_jobs_1.startCronJobs)();
            console.log('Database connected successfully.');
            server = app_1.default.listen(config_1.default.port, () => {
                console.log(`server is running on port ${config_1.default.port}`);
            });
        }
        catch (error) {
            console.log(error);
            throw new AppError_1.default(404, 'Server error.');
        }
    });
}
main();
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
});
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
const gracefulShutdown = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Shutting down gracefully...');
    try {
        (0, corn_jobs_1.stopAllCronJobs)();
        yield mongoose_1.default.connection.close();
        process.exit(0);
    }
    catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
    }
});
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
