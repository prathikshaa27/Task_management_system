export function shouldShowAssignedBy(task, user, role){
    if(!user || !role) return false;

    if(role === "junior"){
        return task.assigned_by_name && task.assigned_by_name != user.username;
    }
    if(role === "senior"){
        return task.assigned_by_role === "lead";
    }
    return false;
}

export function isOverdue(dueDate){
    return new Date(dueDate) < new Date();
}

export function canEditorDelete(task,user,role){
    if(!user || !role) return false;

    const isCreator = task.user === user.username;
    const osAssigner = task.assigned_by_name === user.username;

    if(role === "admin" || role === "lead"){
         return true;
    }
    if(role === "senior"){
      if(!isCreator) return false;
      return task.assigned_by_role !== "lead";
    }     
    if(role === "junior"){
      return isCreator && (!task.assigned_by_name || task.assigned_by_name === user.username);
    }
    return false;
  }

