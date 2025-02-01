"use client"

import { type LucideIcon } from "lucide-react"


import {

  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  return (

    <SidebarMenu className="mt-6 p-3">
      {items.map((item) => (
        <SidebarMenuItem >
          <a href={item.url}>
            <SidebarMenuButton tooltip={item.title}>
              {item.icon && <item.icon />}
              <span>{item.title}</span>
            </SidebarMenuButton>
          </a>
        </SidebarMenuItem>

      ))}
    </SidebarMenu>

  )
}
