import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
dotenv.config();
import { userRoutes, tasksRoutes, notesRoutes } from './Routes/index.js';
import { prisma } from './utils/prisma.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger.js';
import process from 'node:process';





const app = express();
const PORT = process.env.PORT

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));




app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["POST", "GET", "PUT", "DELETE"],
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



app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`)

    // Ping the DB every 4 minutes to prevent Neon from suspending
    // (Neon suspends after 5 min of inactivity)
    setInterval(async () => {
        // try {
        //     await prisma.$queryRaw`SELECT 1`;
        //     console.log("Pinged DB to keep connection alive");
        // } catch (e) {
        //     // silently ignore, will reconnect on next real query
        //
    }, 4 * 60 * 1000);
})
