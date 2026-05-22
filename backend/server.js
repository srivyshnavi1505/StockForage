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



const ALLOWED_ORIGINS = [
    // local dev
    "http://localhost:5173",
    "http://localhost:3000",
];

app.use(cors({
    origin: function (origin, callback) {

        // allow requests with no origin (e.g. server-to-server, curl)
        if (!origin) {
            return callback(null, true);
        }

        // allow all *.vercel.app deployments (covers preview & production)
        if (origin.endsWith(".vercel.app")) {
            return callback(null, true);
        }

        // allow explicit list (localhost dev)
        if (ALLOWED_ORIGINS.includes(origin)) {
            return callback(null, true);
        }

        callback(new Error("Not allowed by CORS"));
    },

    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
}));



app.use(exp.json());

app.use(cookieParser());


app.use('/user-api', Userapp);

app.use('/stock', FetchStockInfo);

app.use('/trade-api', TradeApp);

app.use('/portfolio-api', PortfolioApp);



app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});


app.use((err, req, res, next) => {

    console.log(err);

    res.status(err.status || 500).json({
        message: err.message || "Server error",
    });
});


async function connectDB() {

    try {

        await mongoose.connect(
            process.env.MONGO_URL
        );

        console.log(
            "Connected to database"
        );

        startStockSnapshotCron();

        const PORT =
            process.env.PORT || 3000;

        app.listen(PORT, () => {

            console.log(
                `Server running on port ${PORT}`
            );
        });

    } catch (err) {

        console.log(
            "Database connection error:",
            err
        );
    }
}

connectDB();