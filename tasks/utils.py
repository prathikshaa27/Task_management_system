def can_assign_tasks(assigner,assignee):
    try:
        if assigner.role == "lead":
            return assignee.role in ['senior','junior']
        elif assigner.role == "senior":
            return assignee.role == "junior"
        return False
    except Exception as e:
        return False
        
