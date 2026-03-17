import express from 'express';
import { createNote, getAllNotes, getNoteById, updateNote, deleteNote, addTagToNote, removeTagFromNote, getNoteTags, getNotesByTag, getAllTags } from '../Controllers/notes.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router()


router.post('/create', authMiddleware, createNote)
router.get('/all', authMiddleware, getAllNotes)
router.get('/:id', authMiddleware, getNoteById)
router.put('/:id', authMiddleware, updateNote)
router.delete('/:id', authMiddleware, deleteNote)

router.post('/:id/tags', authMiddleware, addTagToNote)
router.delete('/:id/tags', authMiddleware, removeTagFromNote)
router.get('/:id/tags', authMiddleware, getNoteTags)
router.get('/tag/:tagId', authMiddleware, getNotesByTag)
router.get('/tags/all', authMiddleware, getAllTags)





export default router
