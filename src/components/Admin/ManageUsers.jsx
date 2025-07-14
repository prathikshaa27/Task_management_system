import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Spinner,
  Alert,
  Form,
  Button,
} from "react-bootstrap";
import { getUsers, updateUserRole } from "../../services/auth";
import { USER_ROLES,ASSIGNABLE_ROLES } from "../../constants/roles";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRoles, setSelectedRoles] = useState({});
  const [updatingUserId, setUpdatingUserId] = useState(null);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers();
      setUsers(response);
      const roleMap = {};
      response.forEach((user) => {
        roleMap[user.id] = user.role;
      });
      setSelectedRoles(roleMap);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = (userId, role) => {
    setSelectedRoles((prev) => ({
      ...prev,
      [userId]: role,
    }));
  };

  const handleSave = async (userId) => {
    try {
      setUpdatingUserId(userId);
      const newRole = selectedRoles[userId];
      await updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (err) {
      console.error("Role update failed", err);
      alert("Failed to update user role.");
    } finally {
      setUpdatingUserId(null);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <Container className="py-4">
      <h2 className="text-center fw-bold mb-4 text-primary">Manage Users</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Table bordered hover responsive className="shadow-sm">
          <thead className="table-primary">
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Email</th>
              <th>Assign Role</th>
              <th>Action</th>
            </tr>
          </thead>
         <tbody>
  {users
    .filter((user) => user.role !== "admin") 
    .map((user, idx) => (
      <tr key={user.id}>
        <td>{idx + 1}</td>
        <td>{user.username}</td>
        <td>{user.email}</td>
        <td>
          <Form.Select
            value={selectedRoles[user.id] || user.role}
            onChange={(e) =>
              handleRoleSelect(user.id, e.target.value)
            }
          >
            {ASSIGNABLE_ROLES.map((role) => (
              <option key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </Form.Select>
        </td>
        <td>
          <Button
            variant="success"
            size="sm"
            disabled={updatingUserId === user.id}
            onClick={() => handleSave(user.id)}
          >
            {updatingUserId === user.id ? "Saving..." : "Save"}
          </Button>
        </td>
      </tr>
    ))}
</tbody>

        </Table>
      )}
    </Container>
  );
}
