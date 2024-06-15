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
  const location = useLocation();

  return (
    <>
      <div className="container min-h-screen m-3 flex flex-row bg-background text-foreground">
        {/* Vertical Sidebar */}
        <div className="w-64 lg:w-80 min-h-screen border-gray-200 bg-background text-foreground ">
          <aside className="w-64 lg:w-80   border-gray-200 p-4 hidden lg:block fixed bg-background text-foreground">
            <h2 className="text-lg font-semibold mb-4">Profile</h2>
            <Separator />
            <nav className="mt-4 bg-inherit text-inherit">
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
          </aside>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 lg:pl-8 xl:pl-16 bg-background text-foreground">
          <Breadcrumb
            className="py-4"
            links={[
              {
                href: "/profile",
                label: "Profile",
              },
              {
                href: location.pathname,
                label: profileNavItems.find((item) => item.href === location.pathname)
                  ?.title || "",
              },
            ] as LinkProps[]}
          />

          <div className="h-full">
            <Outlet />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
