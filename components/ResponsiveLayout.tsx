"use client";

import { Menu } from "lucide-react";
import { useEffect, useState } from "react";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface ResponsiveLayoutProps {
  children: React.ReactNode;
}

export function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  if (isMobile) {
    return (
      <div className="h-screen flex flex-col">
        {/* Mobile Header */}
        <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <Navbar onClose={closeMobileMenu} />
            </SheetContent>
          </Sheet>
          <h1 className="text-lg font-semibold">小红书内容管理分发平台</h1>
          <div className="w-8" /> {/* Spacer for centering */}
        </header>

        {/* Mobile Content */}
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    );
  }

  // Desktop Layout with Resizable Panels
  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        {/* Sidebar Panel */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <Navbar />
        </ResizablePanel>

        {/* Resizable Handle */}
        <ResizableHandle withHandle />

        {/* Main Content Panel */}
        <ResizablePanel defaultSize={80}>
          <div className="h-full flex flex-col">
            {/* Desktop Header (optional) */}

            {/* Main Content */}
            <main className="flex-1 overflow-hidden">{children}</main>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
