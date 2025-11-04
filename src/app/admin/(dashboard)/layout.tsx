"use client"; // Needed for usePathname, useState, and client-side auth checks potentially

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Sidebar, SidebarProvider, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter, SidebarTrigger, SidebarInset, SidebarContent } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { PsiCllinLogo } from '@/components/PsiConnectLogo';
import { LayoutDashboard, Newspaper, Settings, LogOut, Menu as MenuIcon, UserCircle, CalendarDays, Mail, PlayCircle } from 'lucide-react';
// import { auth } from '@/lib/firebase';
// import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const adminNavItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/blogs', label: 'Gerenciar Blog', icon: Newspaper },
  { href: '/admin/videos', label: 'Gerenciar Vídeos', icon: PlayCircle },
  { href: '/admin/agendamentos', label: 'Agendamentos', icon: CalendarDays },
  { href: '/admin/contatos', label: 'Mensagens', icon: Mail },
  { href: '/admin/perfil', label: 'Meu Perfil', icon: UserCircle },
  // Add more admin links here
  // { href: '/admin/settings', label: 'Configurações', icon: Settings },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any | null>(null); // Replace 'any' with Firebase User type
  const [loading, setLoading] = useState(true);

  // Placeholder for auth state listener
  useEffect(() => {
    // Verifica se está logado via localStorage
    if (typeof window !== 'undefined') {
      const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
      if (!isLoggedIn) {
        router.push('/admin/login');
        return;
      }
      // Aqui você pode buscar dados do usuário se quiser
      setUser({ email: "admin@psiclin.com", displayName: "Admin User" });
      setLoading(false);
    }
  }, [router]);


  const handleLogout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isAdminLoggedIn');
    }
    router.push('/admin/login');
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg></div>;
  }
  
  // If no user, children might attempt to render before redirect, so can return null or loading.
  // However, redirect should happen quickly.
  if (!user && !loading) {
     return null; // Or a loading spinner, or specific "Access Denied" page
  }


  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon">
        <SidebarHeader className="p-4">
          <Link href="/admin/dashboard" className="block group-data-[collapsible=icon]:hidden">
            <PsiCllinLogo />
          </Link>
           <Link href="/admin/dashboard" className="hidden group-data-[collapsible=icon]:block mx-auto">
            <LayoutDashboard className="h-6 w-6 text-primary" />
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {adminNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href))}
                  tooltip={{ children: item.label }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2">
           <SidebarMenuButton onClick={handleLogout} tooltip={{children: "Sair"}}>
            <LogOut />
            <span>Sair</span>
          </SidebarMenuButton>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/80 px-4 shadow-sm backdrop-blur-md md:justify-end">
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.photoURL || `https://placehold.co/40x40.png?text=${user?.email?.[0]?.toUpperCase() || 'A'}`} alt={user?.displayName || user?.email || "Admin"} data-ai-hint="user avatar" />
                    <AvatarFallback>{user?.email?.[0]?.toUpperCase() || "A"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.displayName || "Administrador"}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-muted/30">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
