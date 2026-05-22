import exp from 'express';
import jwt from "jsonwebtoken";

import { userModel } from '../models/usermodel.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { authenticate, register } from '../services/Authservices.js';
import { portfolioSnapshotModel } from '../models/PortfolioSnapshot.js';

export const Userapp = exp.Router();


Userapp.post('/register', async (req, res, next) => {

    try {

        let newuser = req.body;

        let userdoc = await register({
            ...newuser
        });

        res.status(201).json({
            message: "User created",
            payload: userdoc
        });

    } catch (err) {

        next(err);
    }
});



Userapp.post('/login', async (req, res, next) => {

    try {

        const { email, password } = req.body;

        const { token, user } =
            await authenticate({
                email,
                password
            });

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: "Login success",
            payload: user
        });

    } catch (err) {

        next(err);
    }
});


Userapp.get('/verify', async (req, res) => {

    try {

        const token =
            req.cookies.token;

        if (!token) {

            return res.status(401).json({
                message: "No token"
            });
        }

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        const user =
            await userModel
                .findById(decoded.userId)
                .select("-password");

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "Verified",
            payload: user
        });

    } catch (err) {

        res.status(401).json({
            message: "Invalid token"
        });
    }
});



Userapp.get("/users", async (req, res) => {

    try {

        const users =
            await portfolioSnapshotModel.aggregate([

                {
                    $sort: {
                        recordedAt: -1
                    }
                },

                {
                    $group: {
                        _id: "$user",
                        totalPnl: {
                            $first: "$totalPnl"
                        },
                        walletBalance: {
                            $first: "$walletBalance"
                        },
                        totalValue: {
                            $first: "$totalValue"
                        },
                    }
                },

                {
                    $lookup: {
                        from: "users",
                        localField: "_id",
                        foreignField: "_id",
                        as: "userInfo"
                    }
                },

                {
                    $unwind: "$userInfo"
                },

                {
                    $project: {
                        username:
                            "$userInfo.username",
                        walletBalance: 1,
                        totalValue: 1,
                        totalPnl: 1
                    }
                },

                {
                    $sort: {
                        totalPnl: -1
                    }
                }
            ]);

        res.status(200).json({
            payload: users
        });

    } catch (err) {

        res.status(500).json({
            message:
                "Error fetching users"
        });
    }
});



Userapp.get(
    "/watchlist",
    verifyToken,
    async (req, res, next) => {

        try {

            const user =
                await userModel.findOne({
                    email: req.user.email
                });

            res.status(200).json({
                payload:
                    user.watchlist || []
            });

        } catch (err) {

            next(err);
        }
    }
);

Userapp.post(
    "/watchlist",
    verifyToken,
    async (req, res, next) => {

        try {

            const { symbol } =
                req.body;

            if (!symbol) {

                return res.status(400)
                    .json({
                        message:
                            "Symbol required"
                    });
            }

            const user =
                await userModel.findOne({
                    email: req.user.email
                });

            const watchlist =
                user.watchlist || [];

            if (
                watchlist.includes(symbol)
            ) {

                user.watchlist =
                    watchlist.filter(
                        s => s !== symbol
                    );

            } else {

                user.watchlist.push(symbol);
            }

            await user.save();

            res.status(200).json({
                payload:
                    user.watchlist
            });

        } catch (err) {

            next(err);
        }
    }
);



Userapp.get('/logout', (req, res) => {

    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
    });

    res.status(200).json({
        message: "Logged out"
    });
});