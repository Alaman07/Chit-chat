import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './Routes/authRoutes.js';
import messageRoutes from './Routes/messageRoutes.js'
import cors from 'cors';
import { connectDB } from './lib/db.js';
import { app, server } from './lib/socket.js' 
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,

}))

app.use('/api/auth',authRoutes);
app.use('/api/message',messageRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 3000;

if(process.env.NODE_ENV === "production") {
    const frontendBuild = path.join(__dirname, '../../frontend/dist');
    app.use(express.static(frontendBuild));

    app.get("*", (req, res) => {
        res.sendFile(path.join(frontendBuild, 'index.html'));
    });
}

server.listen(PORT, () => {
    console.log('server started on port ' + PORT);
    connectDB();
})