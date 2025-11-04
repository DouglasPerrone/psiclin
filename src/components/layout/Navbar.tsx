"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, LogIn, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

const navItems = [
	{ href: '/', label: 'Home' },
	{ href: '/quem-somos', label: 'Quem Somos' },
	{ href: '/blog', label: 'Blog' },
	{ href: '/videos', label: 'Vídeos' },
	{ href: '/contato', label: 'Contato' },
];

export function Navbar() {
	const pathname = usePathname();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	// Initialize theme to null to prevent hydration mismatch on the client
	const [theme, setTheme] = useState<'light' | 'dark' | null>(null);
	const { toast } = useToast();

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	// This effect runs only on the client, after hydration
	useEffect(() => {
		// Determine the theme from localStorage or system preference
		const savedTheme = localStorage.getItem('theme');
		const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		const initialTheme = savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : (systemPrefersDark ? 'dark' : 'light');
		setTheme(initialTheme);
        
        // Show notification toast
		toast({
			title: 'Personalize sua experiência!',
			description: 'Você pode alternar entre modo claro e escuro usando o botão no topo.',
		});
	}, [toast]); // Dependency array ensures this runs only once on mount

	// This effect applies the theme to the document whenever it changes
	useEffect(() => {
		if (theme) {
			document.documentElement.classList.toggle('dark', theme === 'dark');
			localStorage.setItem('theme', theme);
		}
	}, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
    }

	return (
		<header
			className={cn(
				"sticky top-0 z-50 w-full transition-all duration-300",
				isScrolled ? "bg-background/80 shadow-md backdrop-blur-md" : "bg-transparent"
			)}
		>
			<div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
				<Link href="/" className="flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
					<Image src="/imagem/logo.png" alt="PsiClin Logo" width={120} height={40} className="h-8 w-auto md:h-10" />
				</Link>

				<nav className="hidden items-center space-x-6 md:flex">
					{navItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								"text-sm font-medium transition-colors hover:text-primary",
								pathname === item.href ? "text-primary font-semibold" : "text-foreground/80"
							)}
						>
							{item.label}
						</Link>
					))}
					{theme && (
						<Button
							onClick={toggleTheme}
							variant="ghost"
							size="icon"
							aria-label="Alternar modo escuro/claro"
						>
							{theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
						</Button>
					)}
					<Button asChild variant="ghost" size="sm">
						<Link href="/admin/login">
							<LogIn className="mr-2 h-4 w-4" /> Login
						</Link>
					</Button>
				</nav>

				<Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
					<SheetTrigger asChild className="md:hidden">
						<Button variant="ghost" size="icon">
							<Menu className="h-6 w-6" />
							<span className="sr-only">Abrir menu</span>
						</Button>
					</SheetTrigger>
					<SheetContent side="right" className="w-full max-w-xs bg-background p-6">
						<div className="mb-6 flex justify-between items-center">
							<Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
								<Image src="/imagem/logo.png" alt="PsiClin Logo" width={120} height={40} className="h-8 w-auto" />
							</Link>
							<Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
								<X className="h-6 w-6" />
								<span className="sr-only">Fechar menu</span>
							</Button>
						</div>
						<nav className="flex flex-col space-y-4">
							{navItems.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									className={cn(
										"text-lg font-medium transition-colors hover:text-primary",
										pathname === item.href ? "text-primary font-semibold" : "text-foreground/80"
									)}
									onClick={() => setIsMobileMenuOpen(false)}
								>
									{item.label}
								</Link>
							))}
							<Button asChild variant="outline" className="mt-4">
								<Link href="/admin/login" onClick={() => setIsMobileMenuOpen(false)}>
									<LogIn className="mr-2 h-4 w-4" /> Login
								</Link>
							</Button>
						</nav>
					</SheetContent>
				</Sheet>
			</div>
		</header>
	);
}
