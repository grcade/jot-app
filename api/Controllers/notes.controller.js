import { createNoteService, updateNoteService, getAllNotesService, getNoteByIdService, deleteNoteService } from "../Services/notes.service.js";


const createNote = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    console.log("Creating note for user:", req.user.id);
    const { id: userId } = req.user
    if (!userId) {
        return res.status(400).json({ message: "User ID is missing" })
    }


    const { title, description, color } = req.body

    if (!title) {
        return res.status(400).json({ message: "Title is required" })
    }

    try {
        const note = await createNoteService(userId, title, description, color)
        return res.status(201).json({ message: "Note created successfully", success: true, note })
    } catch (error) {
        console.error("Error creating note:", error);
        return res.status(500).json({ message: "Could not create note", success: false })

    }
}


const getAllNotes = async (req, res) => {
    if (!req.user) {
        res.status(401).json({ message: "Unathorized" })
    }

    try {
        const { id: userId } = req.user
        if (!userId) {
            return res.status(400).json({ message: "User ID is missing", success: false })
        }

        const notes = await getAllNotesService(userId)
        if (!notes) {
            return res.status(404).json({ message: "Notes not found", success: false });
        }
        return res.status(200).json({ message: "Reterived all notes successfully", success: true, notes })



    } catch (error) {
        console.error("Error getting all notes:", error);
        return res.status(500).json({ message: "Error getting All Notes", success: false })
    }
}


const getNoteById = async (req, res) => {
    if (!req.user) {
        res.status(401).json({ message: "Unathorized" })
    }
    const { id } = req.params
    if (!id) {
        return res.status(400).json({ message: "Note ID is required" })
    }
    const { id: userId } = req.user
    try {
        const note = await getNoteByIdService(userId, id)
        if (!note) {
            return res.status(404).json({ message: "Note not found", success: false })
        }
        return res.status(200).json({ message: "Reterived note successfully", success: true, note })

    } catch (error) {
        console.error("Error getting note by id:", error);
        return res.status(500).json({ message: "Error getting Note by id", success: false })
    }
}


const updateNote = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    const { id: userId } = req.user
    const { id } = req.params
    const { title, description, bg } = req.body
    try {
        const note = await updateNoteService(userId, id, title, description, bg)
        if (!note) {
            return res.status(404).json({ message: "Note not found", success: false })
        }
        return res.status(200).json({ message: "Note updated successfully", success: true, note })
    } catch (error) {
        console.error("Error updating note:", error);
        return res.status(500).json({ message: "Error updating Note", success: false })
    }
}

const deleteNote = async (req, res) => {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized", success: false })
    }

    const { id: userId } = req.user

    try {

        const { id } = req.params;
        deleteNoteService(userId, id)

    } catch (error) {
        console.log("Error deleting note:", error);
        return res.status(500).json({ message: "Error deleting note", success: false })
    }

}

export { createNote, getAllNotes, getNoteById, updateNote, deleteNote }
