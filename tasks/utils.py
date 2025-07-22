def get_user_role(user):
    try:
        return user.groups.first().name if user.groups.exists() else None
    except Exception:
        return None


def can_assign_tasks(assigner, assignee):
    assigner_role = get_user_role(assigner)
    assignee_role = get_user_role(assignee)
    if assigner.role == "lead":
        return assignee.role in ["senior", "junior"]
    elif assigner.role == "senior":
        return assignee.role == "junior"
    return False
