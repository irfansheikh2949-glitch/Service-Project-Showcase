


import React, { useState, createContext, useContext, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { ShieldCheck, LogOut, UserCog, Home, BarChartHorizontal, FileText, UserCircle, Key, Eye, EyeOff } from 'lucide-react';
import AuditPortal from './components/projects/AuditPortal';
import WinbackRenewals from './components/projects/WinbackRenewals';
import ServicePerformanceDashboard from './components/projects/ServicePerformanceDashboard';
import CustomerBook360 from './components/projects/CustomerBook360';
import PartnerPayoutDashboard from './components/projects/PartnerPayoutDashboard';
// Fix: Module '"file:///components/projects/Partner360"' has no default export.
import Partner360 from './components/projects/Partner360';
import InboundServiceAgent from './components/projects/InboundServiceAgent';
import ResolutionOwner from './components/projects/ResolutionOwner';
import AdminPage from './pages/AdminPage';

// --- TYPES ---
export type Role = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  role: Role;
  hasAccess: boolean;
  accessRequested: boolean;
}

export interface Project {
    id: string;
    name: string;
    component: React.ComponentType;
}

// --- CONSTANTS ---
const MOCK_USERS_DATA: Omit<User, 'id'>[] = [
  { email: 'admin@example.com', role: 'admin', hasAccess: true, accessRequested: false },
  { email: 'user@example.com', role: 'user', hasAccess: true, accessRequested: false },
  { email: 'new@example.com', role: 'user', hasAccess: false, accessRequested: false },
];

export const PROJECTS: Project[] = [
  { id: 'audit-portal', name: 'Audit Portal', component: AuditPortal },
  { id: 'winback-renewals', name: 'WinBack Renewals', component: WinbackRenewals },
  { id: 'service-performance-dashboard', name: 'Service Perf. Dashboard', component: ServicePerformanceDashboard },
  { id: 'customer-book-360', name: 'Customer Book 360', component: CustomerBook360 },
  { id: 'partner-payout-dashboard', name: 'Partner Payout Dashboard', component: PartnerPayoutDashboard },
  { id: 'partner-360', name: 'Partner 360', component: Partner360 },
  { id: 'inbound-service-agent', name: 'Inbound Service Agent', component: InboundServiceAgent },
  { id: 'resolution-owner', name: 'Resolution Owner', component: ResolutionOwner },
];

export const ADMIN_PROJECT: Project = {
    id: 'admin-page', name: 'Admin Panel', component: AdminPage
};

// --- AUTH CONTEXT ---
interface AuthContextType {
  currentUser: User | null;
  users: User[];
  login: (email: string) => boolean;
  logout: () => void;
  requestAccess: (userId: string) => void;
  grantAccess: (userId: string) => void;
  revokeAccess: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      return JSON.parse(storedUsers);
    }
    const initialUsers = MOCK_USERS_DATA.map((u, i) => ({ ...u, id: `user-${i + 1}` }));
    localStorage.setItem('users', JSON.stringify(initialUsers));
    return initialUsers;
  });
  
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const storedUserEmail = localStorage.getItem('currentUserEmail');
    if (storedUserEmail) {
      return users.find(u => u.email === storedUserEmail) || null;
    }
    return null;
  });

  const login = (email: string) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUserEmail', user.email);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUserEmail');
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    const newUsers = users.map(u => u.id === userId ? { ...u, ...updates } : u);
    setUsers(newUsers);
    localStorage.setItem('users', JSON.stringify(newUsers));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const requestAccess = (userId: string) => updateUser(userId, { accessRequested: true });
  const grantAccess = (userId: string) => updateUser(userId, { hasAccess: true, accessRequested: false });
  const revokeAccess = (userId: string) => updateUser(userId, { hasAccess: false, accessRequested: false });

  const value = { currentUser, users, login, logout, requestAccess, grantAccess, revokeAccess };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// --- PROTECTED ROUTE ---
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};


// --- LOGIN PAGE ---
const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  // Fix: Renamed 'navigate' to 'navigateNoOp' to avoid potential naming conflicts with the 'Navigate' component.
  const navigateNoOp = () => { /* no-op for HashRouter */ };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email)) {
      setError('');
      navigateNoOp(); // This will trigger re-render and ProtectedRoute logic
    } else {
      setError('User not found. Try admin@example.com, user@example.com, or new@example.com.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <ShieldCheck className="mx-auto h-12 w-12 text-indigo-600" />
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">to access the Project Showcase</p>
        </div>
        <form className="space-y-6" onSubmit={handleLogin}>
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
          <div className="relative">
            <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (any password works)"
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div>
            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- HOME PAGE (NO ACCESS) ---
const HomePage: React.FC = () => {
  const { currentUser, requestAccess, logout } = useAuth();

  const handleRequestAccess = () => {
    if (currentUser) {
      requestAccess(currentUser.id);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="px-8 py-4 flex justify-between items-center border-b">
        <div className="flex items-center space-x-3">
          <ShieldCheck className="h-8 w-8 text-indigo-600" />
          <h1 className="text-2xl font-bold">Project Showcase</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">{currentUser?.email}</span>
          <button onClick={logout} className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </header>
      <main className="flex-grow flex items-center justify-center text-center p-8">
        <div className="max-w-3xl">
          <h2 className="text-4xl font-extrabold text-gray-900">Innovating the Insurance Landscape</h2>
          <p className="mt-4 text-lg text-gray-600">
            Welcome to our prototype showcase. This platform demonstrates cutting-edge solutions for the Insurance and BFSI industries, focusing on operational efficiency, customer engagement, and data-driven decision-making. Explore new innovations and see how we're addressing key business requirements from operations and services.
          </p>
          <div className="mt-8">
            {currentUser?.accessRequested ? (
              <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg inline-block">
                <p className="font-semibold">Access Request Pending</p>
                <p>Your request to view the project showcase is pending administrator approval.</p>
              </div>
            ) : (
              <button onClick={handleRequestAccess} className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-indigo-700 transition shadow-lg">
                Request Full Access
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};


// --- DASHBOARD LAYOUT ---
const DashboardLayout: React.FC = () => {
  const [activeProject, setActiveProject] = useState<Project>(PROJECTS[0]);
  const { currentUser, logout } = useAuth();
  
  const handleSelectProject = (project: Project) => {
    setActiveProject(project);
  };
  
  const Sidebar: React.FC<{
    activeProject: Project;
    onSelectProject: (project: Project) => void;
  }> = ({ activeProject, onSelectProject }) => {
    return (
      <aside className="w-64 bg-gray-800 text-gray-300 flex flex-col flex-shrink-0">
        <div className="h-16 flex items-center justify-center text-white text-xl font-bold border-b border-gray-700">
          <ShieldCheck className="mr-3"/> Showcase
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {PROJECTS.map((project) => (
            <button
              key={project.id}
              onClick={() => onSelectProject(project)}
              className={`w-full flex items-center px-4 py-2 rounded-lg text-left transition-colors ${
                activeProject.id === project.id ? 'bg-indigo-600 text-white' : 'hover:bg-gray-700'
              }`}
            >
              <FileText size={18} className="mr-3" />
              <span>{project.name}</span>
            </button>
          ))}
          {currentUser?.role === 'admin' && (
            <>
              <div className="pt-4 mt-4 border-t border-gray-700"></div>
              <button
                onClick={() => onSelectProject(ADMIN_PROJECT)}
                className={`w-full flex items-center px-4 py-2 rounded-lg text-left transition-colors ${
                  activeProject.id === ADMIN_PROJECT.id ? 'bg-indigo-600 text-white' : 'hover:bg-gray-700'
                }`}
              >
                <UserCog size={18} className="mr-3" />
                <span>{ADMIN_PROJECT.name}</span>
              </button>
            </>
          )}
        </nav>
        <div className="p-4 border-t border-gray-700">
            <div className="flex items-center">
                <UserCircle size={24} className="mr-3" />
                <div>
                    <p className="text-sm font-semibold text-white">{currentUser?.email}</p>
                    <p className="text-xs text-gray-400 capitalize">{currentUser?.role}</p>
                </div>
            </div>
            <button onClick={logout} className="w-full mt-4 flex items-center justify-center space-x-2 py-2 bg-gray-700 hover:bg-red-600 rounded-lg transition-colors">
                <LogOut size={16} />
                <span>Logout</span>
            </button>
        </div>
      </aside>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeProject={activeProject} onSelectProject={handleSelectProject} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm p-4 z-10">
            <h1 className="text-2xl font-bold text-gray-800">{activeProject.name}</h1>
        </header>
        <div className="flex-1 overflow-y-auto">
          {React.createElement(activeProject.component)}
        </div>
      </main>
    </div>
  );
};


// --- MAIN APP ROUTER ---
const AppContent: React.FC = () => {
  const { currentUser } = useAuth();
  
  if (currentUser === undefined) {
      return <div>Loading...</div>; // Or a proper loading spinner
  }
  
  return (
    <Routes>
      <Route path="/login" element={!currentUser ? <LoginPage /> : <Navigate to="/" />} />
      <Route 
        path="/*"
        element={
          <ProtectedRoute>
            {currentUser?.hasAccess ? <DashboardLayout /> : <HomePage />}
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AuthProvider>
  );
}
