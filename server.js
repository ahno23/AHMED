import express from 'express';
import cors from 'cors';
import next from 'next';
import mongoose from 'mongoose';
import save_message from "./controllers/controllers.js";
import dotenv from "dotenv";
import fs from 'fs';
import {body,validationResult} from "express-validator"
import path from "path";
import { fileURLToPath } from "url";

// Recreate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const server = express();
server.use(cors())
server.use(express.json())
app.prepare().then(() => {
    // Define your custom API routes here
    server.post('/api/send',[
        body("msg")
        .notEmpty()
        .withMessage("title not provided")
    ], (req, res) => {
        const er = validationResult(req);
        if (!er.isEmpty()) {
            return res.status(400).json({status:"FAIL",data:er.array()});
        }
        save_message(req.body.msg);
        res.json({ message: 'Hi!' });
    });
    server.get('/images/my_photo.jpg',(req,res)=>{
        fs.readFile(__dirname+"/images/my_photo.jpg",(err,data)=>{
            if (err) {
                console.error('Error reading the file:', err);
                return;
            }
            res.send(data);
        })
    })
    // Default handler for Next.js pages
    server.get('*', (req, res) => {
        return handle(req, res);
    });
    mongoose.connect(process.env.MONGO_URL).then(()=>{
        console.log("MongoDB connected")
        server.listen(3000, () => {
            console.log('> Ready on http://localhost:3000');
        });
    })
});
