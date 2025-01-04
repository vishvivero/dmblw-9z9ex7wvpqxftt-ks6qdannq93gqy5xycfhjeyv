import { Settings, Moon, Sun, UserCircle, CreditCard, HelpCircle } from "lucide-react";
import { useTheme } from "next-themes";
import { Link, useLocation } from "react-router-dom";
import {
  SidebarFooter as Footer,
  SidebarSeparator,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";

export function SidebarFooter() {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!theme) {
      setTheme('light');
    }
    console.log("Theme mounted:", theme);
  }, [theme, setTheme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    console.log("Toggling theme from", theme, "to", newTheme);
    setTheme(newTheme);
  };

  if (!mounted) {
    return null;
  }

  return (
    <Footer>
      <SidebarSeparator className="opacity-50" />
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton 
            tooltip="Settings"
            className="px-4 py-2 hover:bg-primary/10"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </SidebarMenuButton>
          <SidebarMenuSub>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton
                asChild
                isActive={location.pathname === "/profile"}
              >
                <Link to="/profile" className="flex items-center gap-2">
                  <UserCircle className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton
                asChild
                isActive={location.pathname === "/my-plan"}
              >
                <Link to="/my-plan" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span>My Plan</span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton
                asChild
                isActive={location.pathname === "/help"}
              >
                <Link to="/help" className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  <span>Help</span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton onClick={toggleTheme}>
                {theme === 'dark' ? (
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    <span>Light Mode</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    <span>Dark Mode</span>
                  </div>
                )}
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          </SidebarMenuSub>
        </SidebarMenuItem>
      </SidebarMenu>
      <div className="mt-auto px-4 py-2 text-sm text-muted-foreground">
        rv.rajvishnu@gmail.com
      </div>
    </Footer>
  );
}