import { createTaskService, getAllTasksService, taskByIdService, updateTaskService, updateTaskStatusService, deleteTaskService } from "../Services/tasks.service.js"

const createTask = async (req, res) => {
    if (!req.user) {
        console.error("User not found in request");
        return res.status(401).json({ message: "Unauthorized" })
    }


    const { id: userId } = req.user
    if (!userId) {
        return res.status(400).json({ message: "User ID is missing" })
    }

    try {
        const { taskDesc, priority, deadline, status } = req.body
        if (!taskDesc) {
            return res.status(400).json({ message: "Task description is required" })
        }
        const { noteId } = req.params
        if (!noteId) {
            return res.status(400).json({ message: "Note ID is required" })
        }
        const taskData = {

            noteId,
            taskDesc,
            priority: priority || null,
            deadline: new Date(deadline) || null,
            status: status || "pending"
        }
        const task = await createTaskService(taskData)
        return res.status(201).json({ message: "Task created successfully", task })
    } catch (error) {
        console.error("Error creating task:", error);
        return res.status(500).json({ message: "Internal server error" });
    }

}

const getAllTasks = async (req, res) => {
    if (!req.user) {
        console.error("User not found in request");
        return res.status(401).json({ message: "Unauthorized" })
    }

    const { id: userId } = req.user
    if (!userId) {
        return res.status(400).json({ message: "User ID is missing" })
    }
    const { noteId } = req.params
    if (!noteId) {
        return res.status(400).json({ message: "Note ID is required" })
    }
    try {
        const tasks = await getAllTasksService(noteId, userId)
        console.log("Tasks retrieved for noteId", noteId, "and userId", userId, ":", tasks);
        return res.status(200).json({ message: "All tasks retrieved successfully", tasks })
    } catch (error) {
        console.error("Error retrieving all tasks:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const getTaskById = async (req, res) => {
    if (!req.user) {
        console.error("User not found in request");
        return res.status(401).json({ message: "Unauthorized" })
    }

    const { id: userId } = req.user
    if (!userId) {
        return res.status(400).json({ message: "User ID is missing" })
    }
    try {
        const { id } = req.params
        if (!id) {
            return res.status(400).json({ message: "Task ID is required" })
        }
        const task = await taskByIdService(userId, id)
        if (!task) {
            return res.status(404).json({ message: "Task not found" })
        }
        return res.status(200).json({ message: "Task retrieved successfully", task })
    } catch (error) {
        console.error("Error retrieving task by ID:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const updateTask = async (req, res) => {
    if (!req.user) {
        console.error("User not found in request");
        return res.status(401).json({ message: "Unauthorized" })
    }

    const { id: userId } = req.user
    if (!userId) {
        return res.status(400).json({ message: "User ID is missing" })
    }

    const { id } = req.params
    if (!id) {
        return res.status(400).json({ message: "Task ID is required" })
    }
    const { taskDesc, priority, deadline } = req.body


    try {
        const updatedTask = await updateTaskService(userId, id, { taskDesc, priority, deadline: new Date(deadline) || null })
        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found or unauthorized access" })
        }
        return res.status(200).json({ message: "Task updated successfully", task: updatedTask })
    } catch (error) {
        console.error("Error updating task:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const deleteTask = async (req, res) => {
    if (!req.user) {
        console.error("User not found in request");
        return res.status(401).json({ message: "Unauthorized" })
    }

    const { id: userId } = req.user
    if (!userId) {
        return res.status(400).json({ message: "User ID is missing" })
    }

    const { id } = req.params
    if (!id) {
        return res.status(400).json({ message: "Task ID is required" })
    }

    try {
        const deletedTask = await deleteTaskService(userId, id)
        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found or unauthorized access" })
        }
        return res.status(200).json({ message: "Task deleted successfully", task: deletedTask })
    } catch (error) {
        console.error("Error deleting task:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const updateTaskStatus = async (req, res) => {

    if (!req.user) {
        console.error("User not found in request");
        return res.status(401).json({ message: "Unauthorized" })
    }
    const { id } = req.params
    if (!id) {
        return res.status(400).json({ message: "Task ID is required" })
    }
    const { id: userId } = req.user
    if (!userId) {
        return res.status(400).json({ message: "User ID is missing" })
    }
    const { status } = req.body
    if (!status) {
        return res.status(400).json({ message: "Status is required" })
    }
    try {
        const updatedTask = await updateTaskStatusService(userId, id, status)
        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found or unauthorized access" })
        }
        return res.status(200).json({ message: "Task marked as completed", task: updatedTask })
    } catch (error) {
        console.error("Error marking task as completed:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
    updateTaskStatus
}
