import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import RoleSelector from './components/RoleSelector';

export type UserRole = 'citizen' | 'healthcare' | 'government' | null;

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster position="top-right" richColors />
    </>
  )
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage
});

function DashboardRouteComponent() {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);

  const handleLogout = () => {
    setSelectedRole(null);
  };

  if (!selectedRole) {
    return <RoleSelector onRoleSelect={setSelectedRole} />;
  }

  return <DashboardPage userRole={selectedRole} onLogout={handleLogout} />;
}

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardRouteComponent
});

const routeTree = rootRoute.addChildren([indexRoute, dashboardRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
