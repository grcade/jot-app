import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
dotenv.config();
import { userRoutes, tasksRoutes, notesRoutes } from './Routes/index.js';
import { prisma } from './utils/prisma.js';




const app = express();
const PORT = process.env.PORT

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())



app.use(cors({
    origin: "http://127.0.0.1:3000",
    methods: ["POST", "GET"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}))

app.get('/health', async (req, res) => {
    try {

        await prisma.$queryRaw`SELECT 1`;
        res.status(200).json({
            status: "success",
            message: "API is healthy and running"
        })

    } catch (error) {
        console.error("Health check failed:", error);
        res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        })
    }

})


app.use('/api/v1/user', userRoutes)
app.use('/api/v1/notes', notesRoutes)
app.use('/api/v1/tasks', tasksRoutes)


app.listen(PORT, (req, res) => {
    console.log(`Server listening on PORT ${PORT}`)
})
