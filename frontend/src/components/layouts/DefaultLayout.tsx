/* eslint-disable @typescript-eslint/ban-ts-comment */
import type React from 'react'
import { Outlet } from 'react-router-dom'
import { AppSidebar } from '../AppSidebar'
import { SidebarProvider, SidebarTrigger } from '../ui/sidebar'

const DefaultLayout: React.FC = () => {
  return (
    <SidebarProvider
      style={{
        // @ts-ignore
        '--sidebar-width': '21rem'
      }}
    >
      <AppSidebar />
      <main className="min-h-screen w-full">
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  )
}

export default DefaultLayout
