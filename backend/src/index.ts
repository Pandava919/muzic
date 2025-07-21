import express, { Express } from 'express';
import { User } from './schema/schema';
import mongoose from 'mongoose';
import { email, string, z } from 'zod';
const app:Express = express();

app.use(express.json());

const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    username: z.string().optional(),
});

app.post('/signup',async (req, res) => {
    const { email, password }: z.infer<typeof signupSchema> = req.body;

    if(!email || !password){
        res.status(400).json({ message: 'Email and password are required' });
        return;
    }
    const userPresent = await User.findOne({ email });
    if(userPresent){
        res.status(400).json({ message: 'User already exists' });
        return;
    }
    await User.create({ email, password });

    res.status(200).json({ message: 'Signup successful' });
})

app.listen(3000, ()=>{
    mongoose.connect('mongodb://localhost:27017/musicapp');
});

const loginSchema = z.object({
    email:string().email(),
    password: string().min(8)
})

app.post('/login', async(req,res)=>{
    const { email, password }: z.infer<typeof signupSchema> = req.body;

    const userPresent = await User.findOne({ email });

    if (userPresent && userPresent.password == password) {
        return res.status(200).json({message: "login successfull"});
    } 

    return res.json({message: "invalid credentials"});
})