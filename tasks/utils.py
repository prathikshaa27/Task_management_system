def get_user_role(user):
    try:
        return user.groups.first().name if user.groups.exists() else None
    except Exception:
        return None


def can_assign_tasks(assigner, assignee):
    assigner_role = get_user_role(assigner)
    assignee_role = get_user_role(assignee)
    print("Assigner Role:", assigner_role)
    print("Assignee Role:", assignee_role)
    if not assignee_role or not assignee_role:
        return False
   
    if assigner_role == "lead":
        return assignee_role in ["senior", "junior"]
    elif assigner_role == "senior":
        return assignee_role == "junior"
    return False
