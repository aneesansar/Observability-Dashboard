import { useState, type ReactNode } from 'react'
import MobileSidebar from './sidebar/MobileSidebar'
import DesktopSidebar from './sidebar/DesktopSidebar'
import Header from './header/Header'

type AppLayoutProps = {
  children: ReactNode
  padded?: boolean
  main?: boolean
  mainClassName?: string
}

export default function AppLayout({ children, padded = true, main = true, mainClassName = '' }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(() => localStorage.getItem('sidebarCollapsed') === 'true')

  const handleSidebarCollapse = (collapsed: boolean) => {
    setIsCollapsed(collapsed)
    try {
      localStorage.setItem('sidebarCollapsed', String(collapsed))
    } catch {}
  }

  return (
    <div className="h-screen bg-anti-flash-white flex flex-col overflow-hidden">
      {/* Mobile sidebar */}
      <MobileSidebar open={sidebarOpen} onClose={setSidebarOpen} />

      {/* Static sidebar for desktop */}
      <DesktopSidebar isCollapsed={isCollapsed} onToggleCollapse={handleSidebarCollapse} />

      {/* Top navbar aligned next to desktop sidebar */}
      <div className={isCollapsed ? 'lg:pl-16' : 'lg:pl-56'}>
        <Header setSidebarOpen={setSidebarOpen} />
      </div>

      {/* Page content (scrolls independently) */}
      <main className={"flex-1 pt-4 w-full max-w-full overflow-x-hidden overflow-y-auto " + (isCollapsed ? "lg:pl-16" : "lg:pl-56") }>
        <div
          className={
            mainClassName.trim()
              ? mainClassName.trim()
              : main
                ? `${padded ? 'p-6 ' : ''}`
                : ''
          }
        >
          {children}
        </div>
      </main>
    </div>
  )
}
