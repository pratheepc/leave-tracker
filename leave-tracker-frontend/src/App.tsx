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
import CreateEmployee from "./pages/CreateEmployee"
import EditEmployee from "./pages/EditEmployee"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {/* Sidebar and header */}
      <div>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            {/* header */}
            <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4 shadow-sm">
              <SidebarTrigger
                className="md:hidden dark:text-white"
              />
              <div className="flex gap-2 items-center">
                <img
                  src={aLogo}
                  alt="logo"
                  className="w-6 h-6 flex justify-center"
                />
                <p className="text-2xl font-bold dark:text-white">Iris Crew</p>
              </div>
              <ModeToggle />
            </header>

            <DynamicBreadcrumb />

            {/* main content */}
            {/* <div className="w-full"> */}
            <Routes>
              <Route path="/" element={<WorkInProgress />} />
              <Route path="/dashboard" element={<WorkInProgress />} />
              <Route path="/employees" element={<EmployeesPage />} />
              <Route path="/employees/:empId" element={<EmployeeDetailsPage />} />
              <Route path="/create-employee" element={<CreateEmployee />} />
              <Route path="/employees/:empId/edit" element={<EditEmployee />} />
            </Routes>
            {/* </div> */}

          </SidebarInset>
        </SidebarProvider>
      </div>
      <Toaster />
    </ThemeProvider >
  )
}

export default App
