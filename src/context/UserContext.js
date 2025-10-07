import React, { createContext, useContext, useState } from 'react';
const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;

const UserContext = createContext();

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiEndpoint}/users`);
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const getUser = async (id) => {
    try {
      const response = await fetch(`https://api.escuelajs.co/api/v1/users/${id}`);
      if (!response.ok) throw new Error('Failed to fetch user');
      return await response.json();
    } catch (err) {
      setError(err.message);
      console.error('Error fetching user:', err);
      return null;
    }
  };

  const createUser = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://api.escuelajs.co/api/v1/users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userData, avatar: 'https://picsum.photos/800' })
      });
      if (!response.ok) throw new Error('Failed to create user');
      const newUser = await response.json();
      setUsers([...users, newUser]);
      return { success: true, data: newUser };
    } catch (err) {
      setError(err.message);
      console.error('Error creating user:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id, userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://api.escuelajs.co/api/v1/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userData, avatar: 'https://picsum.photos/800' })
      });
      if (!response.ok) throw new Error('Failed to update user');
      const updatedUser = await response.json();
      setUsers(users.map(u => u.id === id ? updatedUser : u));
      return { success: true, data: updatedUser };
    } catch (err) {
      setError(err.message);
      console.error('Error updating user:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://api.escuelajs.co/api/v1/users/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete user');
      setUsers(users.filter(u => u.id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message);
      console.error('Error deleting user:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value = {
    users,
    loading,
    error,
    fetchUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    clearError
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
};