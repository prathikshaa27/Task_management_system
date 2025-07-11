import api from "./api";

export const fetchTasks = async(filters={}) =>{
  const query = new URLSearchParams(filters).toString();
  const response = await api.get(`tasks/?${query}`);
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

export const fetchCategories = async() =>{
  const response = await api.get("categories/")
  return response.data.results
};

export const fetchTaskNotifications = async() =>{
  const response = await api.get("tasks/notifications/");
  return response.data
}

export const fetchAnalyticsSummary = async() =>{
  const response = await api.get("analytics/summary/");
  return response.data
}

export const assignTask = async(taskData)=>{
  const response = await api.post("assign-task/", taskData);
  return response.data;
}