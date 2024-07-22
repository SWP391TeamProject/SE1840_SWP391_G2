import { useAuth } from '@/AuthProvider';
import NavBar from '@/components/NavBar/NavBar';
import { Roles } from '@/constants/enums';
import { Suspense, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

export default function AuthenticationLayout() {
  const auth = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (auth.user) {
      switch (auth.user?.role) {
        case Roles.ADMIN:
          nav('/admin/dashboard');
          break;
        case Roles.MEMBER:
          nav('/dashboard');
          break;
        
        case Roles.STAFF,Roles.STAFF:
          nav('/admin/consignments');
          break;
        default:
          nav('/auth/login');
      }
    }
  }, [auth.user]);

  return (
    <>
      <div className="flex flex-col w-screen max-w-full min-h-screen justify-start align-middle items-center bg-background text-foreground ">
        <NavBar />
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </div>
    </>
  );
}
