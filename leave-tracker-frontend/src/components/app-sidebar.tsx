import * as React from "react"
import {
    PieChart,
    User,
} from "lucide-react"


import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"




import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarTrigger,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
    user: {
        name: "Pratheep",
        email: "pratheep@steam-a.com",
        avatar: "/avatars/shadcn.jpg",
    },

    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: PieChart,
        },
        {
            title: "Employees",
            url: "/employees",
            icon: User,
        },

    ],
}



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar variant="sidebar" collapsible="icon"  {...props}>
            <SidebarHeader className="pt-4">
                <SidebarTrigger className="flex justify-left p-5 dark:text-white" />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar >
    )
}
