import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_PASSWORD || '1424';


export function authMiddleWare (req:Request, res:Response, next:NextFunction) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({message: 'Unauthorised user'});
    }
    try {
        const decode = jwt.verify(token, JWT_SECRET);
        //@ts-ignore
        req.userId = decode?.userId;
        next()
    } catch (error) {
        next(error)
    }
}