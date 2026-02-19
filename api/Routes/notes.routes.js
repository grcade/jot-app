import express from 'express';
import { createNote, getAllNotes, getNoteById, updateNote, deleteNote } from '../Controllers/notes.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router()


router.post('/create', authMiddleware, createNote)
router.get('/all', authMiddleware, getAllNotes)
router.get('/:id', authMiddleware, getNoteById)
router.put('/:id', authMiddleware, updateNote)
router.delete('/:id', authMiddleware, deleteNote)




export default router
