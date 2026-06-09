import { createContext, useContext, useEffect, useState } from "react";
import socket from "../services/socket";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user"); 

    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);

      if (!socket.connected) {
        socket.connect();
        socket.emit("join-user", userData._id);
      }
    }
  }, []);

  
  // LOGIN
  const login = (userData, token) => {
    localStorage.setItem("token", token); 

    sessionStorage.setItem("user", JSON.stringify(userData)); 

    setUser(userData);

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join-user", userData._id);
  };


  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");

    sessionStorage.removeItem("user");

    setUser(null);

    if (socket.connected) {
      socket.disconnect();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);