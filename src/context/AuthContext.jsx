import { createContext, useContext, useMemo, useState } from "react";
import { loginUser, signupUser } from "../services/auth";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";

//creates the context
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("access");
    return token ? jwtDecode(token) : null;
  });

  const login = async (credentials) => {
    const { access, refresh } = await loginUser(credentials);
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);

    const decoded = jwtDecode(access);
    setUser(decoded);

    if (decoded.role) {
      localStorage.setItem("role", decoded.role);
    }
    return decoded;
  };

  const signup = async (data) => {
    await signupUser(data);
    return true;
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
  };
  const authContextValue = useMemo(
    () => ({
      user,
      login,
      signup,
      logout,
      role: user?.role || null,
    }),
    [user],
  );
  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
