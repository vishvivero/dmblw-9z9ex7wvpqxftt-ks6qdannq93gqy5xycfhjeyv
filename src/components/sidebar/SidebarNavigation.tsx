import { Home, PiggyBank, BarChart2, List, LineChart, Clock, ChartBar } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Overview",
    url: "/overview",
    icon: Home,
  },
  {
    title: "Debts",
    url: "/overview/debts",
    icon: PiggyBank,
  },
  {
    title: "Strategy",
    url: "/strategy",
    icon: BarChart2,
  },
  {
    title: "Plan",
    url: "/plan",
    icon: List,
  },
  {
    title: "Track",
    url: "/track",
    icon: LineChart,
  },
  {
    title: "Payment History",
    url: "/overview/history",
    icon: Clock,
  },
  {
    title: "Reports",
    url: "/overview/reports",
    icon: ChartBar,
  },
];

export function SidebarNavigation() {
  const location = useLocation();

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === item.url}
                  tooltip={item.title}
                  className="transition-colors hover:bg-primary/10 data-[active=true]:bg-primary/15 data-[active=true]:text-primary"
                >
                  <Link to={item.url} className="flex items-center gap-3 px-4 py-2">
                    <item.icon className="h-4 w-4" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}