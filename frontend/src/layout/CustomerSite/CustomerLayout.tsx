import NavBar from '@/components/NavBar/NavBar';
import { useTheme } from '@/components/component/ThemeProvider';
import Footer from '@/components/footer/Footer';
import { getCookie } from '@/utils/cookies';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

export default function CustomerLayout() {
  const theme = getCookie('themeMode');
  const { setTheme } = useTheme();
  // const nav = useNavigate();
  // useEffect(() => {
  //   document.title = "Consignment | Biddify";

  //   // fetchConsignmentsService();
  // }, [nav]);
  useEffect(() => {
    if (theme) {
      setTheme(JSON.parse(theme));
    }
  }, []);

  return (
    <div className="bg-background text-foreground ">
      <div className="sticky top-0 z-20 w-full ">
        <NavBar />
      </div>
      <div className="min-h-svh">
        <Outlet></Outlet>
      </div>

      <Footer />
    </div>
  );
}
