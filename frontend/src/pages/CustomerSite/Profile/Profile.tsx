import { useState } from "react";
import { Separator } from "@radix-ui/react-separator";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import NavBar from "@/components/NavBar/NavBar";
import Footer from "@/components/footer/Footer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NavLink, Outlet, useLocation } from "react-router-dom";

// Define a Link interface to match the Breadcrumb component's expectation
interface LinkProps {
  href: string;
  label: string;
}

const profileNavItems = [
  { title: "Overview", href: "/profile" },
  { title: "Settings", href: "/profile/settings" },
  // Add more profile navigation items as needed
];

export default function Profile() {
  const location = useLocation();

  return (
    <>
      <div className="container min-h-screen m-3 flex flex-row">
        {/* Vertical Sidebar */}
        <div className="w-64 lg:w-80 min-h-screen border-gray-200 bg-gray-50">
          <aside className="w-64 lg:w-80 bg-gray-50 border-r border-gray-200 p-4 hidden lg:block fixed">
            <h2 className="text-lg font-semibold mb-4">Profile</h2>
            <Separator />
            <nav className="mt-4">
              {profileNavItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "block px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100",
                      isActive ? "bg-accent text-accent-foreground" : ""
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
        <div className="flex-1 lg:pl-8 xl:pl-16">
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
