import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { createTask, getAllTasks, getTaskById, updateTask, deleteTask, updateTaskStatus } from '../Controllers/tasks.controller.js'


const router = express.Router()

router.post('/note/:noteId', authMiddleware, createTask)
router.get('/note/:noteId', authMiddleware, getAllTasks)
router.get('/:id', authMiddleware, getTaskById)
router.put('/:id', authMiddleware, updateTask)
router.delete('/:id', authMiddleware, deleteTask)
router.put('/:id/update-status', authMiddleware, updateTaskStatus)

export default router
