import DashBoardNavBar from '@/components/NavBar/DashBoardNavBar';
import Footer from '@/components/footer/Footer';
import { Outlet } from 'react-router-dom';
import { checkScrollPositionAndReset } from '../layoutUtils/layout-utils';
import { useEffect } from 'react';

export default function CustomerDashBoard() {
  useEffect(() => {
    // Call the function on component mount and path change
    checkScrollPositionAndReset();

    // Optional: If you want to check the scroll position continuously or on a specific event, you can add more logic here
  }, [location.pathname]);
  return (
    <div className="min-h-screen flex flex-col dark:bg-black text-foreground">
      <div className="sticky top-0 z-10 w-full h-fit">
        <DashBoardNavBar />
      </div>
      <div className="w-full grow">
        <Outlet></Outlet>
      </div>
      <div className="min z-10 w-full text-foreground h-fit">
        <Footer />
      </div>
    </div>
  );
}
