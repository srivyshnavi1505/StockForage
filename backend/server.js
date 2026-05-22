import exp from 'express';
import mongoose from "mongoose";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';

import { Userapp } from './APIS/UserAPI.js';
import { PortfolioApp } from './APIS/PortfolioAPI.js';
import { TradeApp } from './APIS/TradeAPI.js';
import { FetchStockInfo } from './APIS/fetchStockInfoAPI.js';
import { startStockSnapshotCron } from './crons/SnapshotCron.js';

config();

const app = exp();

// ================= CORS =================

app.use(cors({
    origin: function (origin, callback) {

        // allow requests with no origin
        // (mobile apps, postman, curl, etc.)
        if (!origin) {
            return callback(null, true);
        }

        // allow all vercel deployments
        if (
            origin.includes(".vercel.app")
        ) {
            return callback(null, true);
        }

        // allowed production frontend
        const allowedOrigins = [
            "https://stock-forage.vercel.app",
        ];

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(
            new Error("Not allowed by CORS")
        );
    },

    credentials: true,
}));

// ================= MIDDLEWARES =================

app.use(exp.json());

app.use(cookieParser());

// ================= ROUTES =================

app.use('/user-api', Userapp);

app.use('/stock', FetchStockInfo);

app.use('/trade-api', TradeApp);

app.use('/portfolio-api', PortfolioApp);

// ================= ERROR HANDLER =================

function ErrorHandler(err, req, res, next) {

    console.log(err);

    res.status(err.status || 500).json({
        message: "error occured",
        payload: err.message,
    });
}

app.use(ErrorHandler);

// ================= DATABASE CONNECTION =================

async function connectDB() {

    try {

        await mongoose.connect(
            process.env.MONGO_URL
        );

        console.log(
            "connected to database"
        );

        // start cron jobs
        startStockSnapshotCron();

        const PORT =
            process.env.PORT || 3000;

        app.listen(PORT, () => {

            console.log(
                `server listening on port ${PORT}`
            );
        });

    } catch (err) {

        console.log(
            "database connection error:",
            err
        );
    }
}

connectDB();