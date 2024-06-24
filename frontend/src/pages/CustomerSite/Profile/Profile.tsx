import { Separator } from "@radix-ui/react-separator";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Footer from "@/components/footer/Footer";
import { cn } from "@/lib/utils";
import { NavLink, Outlet, useLocation } from "react-router-dom";

// Define a Link interface to match the Breadcrumb component's expectation
interface LinkProps {
  href: string;
  label: string;
}

const profileNavItems = [
  { title: "Overview", href: "/profile/overview" },
  { title: "Notification", href: "/profile/notification" },
  { title: "Settings", href: "/profile/settings" },
  { title: "Balance", href: "/profile/balance" },
];

export default function Profile() {
  return (
    <>
      <div className="container min-h-screen flex flex-col md:flex-row gap-8 md:gap-16 bg-background text-foreground py-8">
        {/* Vertical Sidebar */}
        <nav className="w-64 md:min-h-screen border-gray-200 flex flex-row md:flex-col">
          {profileNavItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "block px-4 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                  isActive ? "bg-accent text-accent-foreground " : ""
                )
              }
            >
              {item.title}
            </NavLink>
          ))}
        </nav>

        {/* Main Content Area */}
        <div className="grow">
          <div className="max-w-2xl m-auto">
            <Outlet />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
