
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";

// Define user roles as constants
export const ROLES = {
  ADMIN: 'Admin',
  DEPARTMENT_HEAD: 'Department Head',
  SUPERVISOR: 'Supervisor',
  VOLUNTEER: 'Volunteer',
  SUBSCRIBER: 'Subscriber'
};

export type UserRole = 'Admin' | 'Department Head' | 'Supervisor' | 'Volunteer' | 'Subscriber';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  isPremium: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  hasPermission: (allowedRoles: UserRole[] | string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Sample users for our mock authentication
const MOCK_USERS = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password',
    role: ROLES.ADMIN,
    isPremium: true
  },
  {
    id: '2',
    name: 'Department Head',
    email: 'department@example.com',
    password: 'password',
    role: ROLES.DEPARTMENT_HEAD,
    department: 'Worship',
    isPremium: true
  },
  {
    id: '3',
    name: 'Supervisor',
    email: 'supervisor@example.com',
    password: 'password',
    role: ROLES.SUPERVISOR,
    department: 'Cleaning',
    isPremium: false
  },
  {
    id: '4',
    name: 'Volunteer',
    email: 'volunteer@example.com',
    password: 'password',
    role: ROLES.VOLUNTEER,
    department: 'Greeting',
    isPremium: false
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for stored user in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // In a real app, this would be an API call to your backend
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = MOCK_USERS.find(u => 
        u.email === email && u.password === password
      );
      
      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword as User);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        toast({
          title: "Login successful",
          description: `Welcome back, ${foundUser.name}!`,
        });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    // In a real app, this would be an API call to your backend
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      if (MOCK_USERS.some(u => u.email === email)) {
        throw new Error('User already exists with that email');
      }
      
      // Create new user
      const newUser = {
        id: String(MOCK_USERS.length + 1),
        name,
        email,
        role,
        isPremium: false
      };
      
      // In a real app, this would add the user to your database
      // For now, we'll just set the new user as logged in
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      toast({
        title: "Registration successful",
        description: `Welcome, ${name}! You've registered as a ${role}.`,
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };
  
  const hasPermission = (allowedRoles: UserRole[] | string[]): boolean => {
    if (!user) return false;
    
    // Safely handle the comparison with the user's role
    return allowedRoles.includes(user.role as never);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      hasPermission,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
