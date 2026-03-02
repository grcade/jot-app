import { addTask, getAllTasks, getTaskById, deleteTask, updateTask, updateTaskStatus } from "../repository/tasks.repository.js"


const createTaskService = (data) => {
    return addTask(data);

}

const getAllTasksService = (noteId, userId) => {
    return getAllTasks(noteId, userId);
}

const taskByIdService = (userId, id) => {

    return getTaskById(userId, id);
}

const updateTaskService = (userId, id, data) => {
    return updateTask(userId, id, data);
}

const deleteTaskService = (userId, id) => {
    return deleteTask(userId, id);
}

const updateTaskStatusService = (userId, id, status) => {
    return updateTaskStatus(userId, id, status);
}

export { createTaskService, getAllTasksService, taskByIdService, updateTaskService, deleteTaskService, updateTaskStatusService }
