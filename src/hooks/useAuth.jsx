import { createContext, useState, useEffect, useContext } from 'react';
import api from '../config/config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/profile');
      console.log('Fetched user:', response.data);  
      setUser(response.data);
    } catch (e) {
        console.error('Fetch user error:', e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

 
return (
  <AuthContext.Provider value={{ user, setUser, loading, fetchUser }}>
    {children}
  </AuthContext.Provider>
);


};

export const useAuth = () => useContext(AuthContext);

