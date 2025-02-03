import { ThemeProvider } from "@/components/theme-provider"
import './App.css'
import { ModeToggle } from '@/components/mode-toggle'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar"
import { SidebarInset } from "./components/ui/sidebar"
import aLogo from './assets/a-logo.png'
import { Routes, Route } from "react-router-dom"
import { DynamicBreadcrumb } from "./components/DynamicBreadcrumb"
import { Toaster } from "./components/ui/toaster"

import EmployeesPage from "./pages/employees"
import WorkInProgress from "./pages/dashboard"
import EmployeeDetailsPage from "./pages/EmployeeDetails"
function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {/* Sidebar and header */}
      <div>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            {/* header */}
            <header className="flex h-16 shrink-0 items-center gap-2 px-4 shadow-sm">
              <SidebarTrigger
                className="md:hidden dark:text-white"
              />
              <img
                src={aLogo}
                alt="logo"
                className="w-6 flex justify-center"
              />
              <p className="text-2xl font-bold dark:text-white">Iris Crew</p>
              <ModeToggle />
            </header>

            <DynamicBreadcrumb />
            
            {/* main content */}
            <Routes>
              <Route path="/" element={<WorkInProgress />} />
              <Route path="/dashboard" element={<WorkInProgress />} />
              <Route path="/employees" element={<EmployeesPage />} />
              <Route path="/employees/:empId" element={<EmployeeDetailsPage />} />
            </Routes>

          </SidebarInset>
        </SidebarProvider>
      </div>
      <Toaster />
    </ThemeProvider>
  )
}


export default App
