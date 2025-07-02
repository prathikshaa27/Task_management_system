import api from "./api";

export const fetchTasks = async() =>{
  const response = await api.get("tasks/");
  console.log("Making GET /tasks/ request");
  return response.data
};

export const createTask = async(taskData) =>{
  const response = await api.post("tasks/",taskData);
  return response.data
};

export const updateTask = async(taskId,updatedData)=>{
  const response = await api.put(`tasks/${taskId}/`, updatedData)
  return response.data
};

export const deleteTasks = async(taskId) =>{
  const response = await api.delete(`tasks/${taskId}/`)
  return response.data
};