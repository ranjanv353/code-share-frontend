import React, { createContext, useContext, useCallback } from "react";

const ApiContext = createContext();


function getEmailFromIdToken() {
  const idToken = localStorage.getItem("idToken");
  if (!idToken) return undefined;
  try {
    const payload = JSON.parse(atob(idToken.split(".")[1]));
    return payload.email;
  } catch {
    return undefined;
  }
}

function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export function ApiProvider({ children }) {
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

  const apiRequest = useCallback(
    async (endpoint, options = {}) => {
      const url = `${API_BASE_URL}${endpoint}`;
      const accessToken = getAccessToken();
      const email = getEmailFromIdToken();

      const headers = {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...(email ? { "x-user-email": email } : {}),
        ...options.headers,
      };
      const res = await fetch(url, { ...options, headers });
      if (!res.ok) {
        let error;
        try {
          error = await res.json();
        } catch {
          error = { message: "API Error" };
        }
        throw new Error(error.message || `API error: ${res.status}`);
      }
      const text = await res.text();
      return text ? JSON.parse(text) : null;

    },
    [API_BASE_URL]
  );

  // 1. Create room (guest or authenticated)
  const createRoom = (data) =>
    apiRequest("/rooms", {
      method: "POST",
      body: JSON.stringify(data),
    });

  // 2. Get room by ID
  const getRoom = (roomId) => apiRequest(`/rooms/${roomId}`);

  // 3. Update room by ID
  const updateRoom = (roomId, data) =>
    apiRequest(`/rooms/${roomId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });

  // 4. Share room (add/update/remove member; authenticated only)
  const shareRoom = (roomId, { userId, email, role }) =>
    apiRequest(`/rooms/${roomId}/share`, {
      method: "PATCH",
      body: JSON.stringify({ userId, email, role }),
    });

  // 5. List rooms
  const listRooms = () => apiRequest("/rooms");

  // 6. Delete room
  const deleteRoom = (roomId) =>
    apiRequest(`/rooms/${roomId}`, {
      method: "DELETE",
    });

  // 7. Health check
  const healthGateway = () => apiRequest("/health");

  const api = {
    createRoom,
    getRoom,
    updateRoom,
    shareRoom,
    listRooms,
    deleteRoom,
    healthGateway,
  };

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
}

export function useApi() {
  return useContext(ApiContext);
}
