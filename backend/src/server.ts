import express, { Express,Request, Response, NextFunction } from 'express';
import { Streams, User } from './schema/schema';
import mongoose from 'mongoose';
import cors from 'cors'
import { string, z } from 'zod';
import { OAuth2Client } from 'google-auth-library'
import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser';
import { authMiddleWare } from './utils/middleware';
dotenv.config();

const PORT = 8080
const app:Express = express();
const client = new OAuth2Client();

const JWT_SCRETE = process.env.JWT_PASSWORD || '1424';

app.use(express.json());
app.use(cookieParser());
app.use(cors(
    {
        origin: "http://localhost:5173",
        methods: ['GET', 'POST', 'DELETE', 'PUT'],
        credentials: true,
        // allowedHeaders: ['Content-Type', 'Authorization'],

    }
));


const loginSchema = z.object({
    credential: string(),
    client_id: string(),
    select_by: string().optional()

})

app.post('/login', async(req: Request, res: Response, next: NextFunction)=>{
    const { credential, client_id }: z.infer<typeof loginSchema> = req.body;
     try {
     const ticket = await client.verifyIdToken({
     idToken: credential,
     audience: client_id,
   });
   const payload = ticket.getPayload();

   const userExist = await User.findOne({email:payload?.email});
   if(!userExist){
       const user = await User.create({email:payload?.email, name:payload?.name, image:payload?.picture});

       const token = jwt.sign({userId: user._id, email:payload?.email}, JWT_SCRETE)
       res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
       })
       

       return res.status(200).json({message: 'Log In successful'});
   }
   return res.status(403).json({message:'User already present'});
   
   } catch (err) {
    next(err);
   }
})

app.post('/streams', authMiddleWare, async(req: Request, res: Response, next: NextFunction) => {
    try {
        const url = req.body.url || '';
        //https://www.youtube.com/watch?v=U8QhB8_0t2g
        //@ts-ignore
        const userId = req.userId;
        const extractedId = url.split('?v=')[1];
        const type = url.includes('youtube') ? 'youtube' : 'spotify';
        const stream = await Streams.create({ user: userId, extractedId, type, upvotes: 0, url })
        const user = await User.findByIdAndUpdate(userId,{
            $push: {streams: stream._id}
        })
        res.status(200).json({ message: 'added successfully' })
        
    } catch (error) {
        next(error);
        
    }
    
    
})

app.get('/streams',  authMiddleWare, async(req: Request, res: Response, next: NextFunction) => {
    //@ts-ignore
    const userId = req.userId;
    const streams = await Streams.find({user: userId}).sort({ upvotes: 1 })
    res.status(200).json({ streams })
})

app.use(/(.*)/, (req: Request, res: Response, next: NextFunction) => {      //wild card route
    res.status(404).json("File not found");
})

app.use((err:Error, req:Request, res:Response, next:NextFunction): void => {
    res.status(500).send(err || "Internal Server Error");
})

app.listen(PORT, ()=>{
    mongoose.connect(`${process.env.MOGODB_URL}musicapp`);
});