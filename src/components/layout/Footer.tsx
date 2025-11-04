import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Linkedin } from 'lucide-react';

const footerNavItems = [
	{ href: '/quem-somos', label: 'Quem Somos' },
	{ href: '/blog', label: 'Blog' },
	{ href: '/contato', label: 'Contato' },
	{ href: '/politica-de-privacidade', label: 'Política de Privacidade' },
	{ href: '/termos-de-uso', label: 'Termos de Uso' },
];

export function Footer() {
	return (
		<footer className="bg-sidebar-background text-sidebar-foreground print:hidden">
			<div className="max-w-6xl mx-auto px-4 py-12 md:px-6">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-2 items-start">
					<div>
						<Link href="/" className="mb-2 inline-block">
							<Image
								src="/imagem/logo.png"
								alt="PsiClin Logo"
								width={140}
								height={45}
								className="h-10 w-auto"
							/>
						</Link>
						<p className="text-sm text-sidebar-foreground">
							Sua jornada para o bem-estar começa aqui.
						</p>
					</div>
					<div className="flex flex-col items-center md:items-center md:col-start-2 md:col-end-3">
						<h3 className="mb-2 font-headline text-lg font-semibold text-foreground">
							Navegação
						</h3>
						<ul className="space-y-1">
							{footerNavItems.map((item) => (
								<li key={item.href}>
									<Link
										href={item.href}
										className="text-sm hover:text-primary hover:underline"
									>
										{item.label}
									</Link>
								</li>
							))}
						</ul>
					</div>
					<div className="flex flex-col items-center md:items-start mt-4 md:mt-0">
						<h3 className="mb-2 font-headline text-lg font-semibold text-foreground">
							Siga-nos
						</h3>
						<div className="flex gap-2 mb-1">
							<Link
								href="https://www.instagram.com/psiclin.conteporanea/"
								aria-label="Instagram"
								className="hover:text-primary"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Instagram size={24} />
							</Link>
							<Link
								href="#"
								aria-label="LinkedIn"
								className="hover:text-primary"
							>
								<Linkedin size={24} />
							</Link>
						</div>
						<p className="text-sm text-sidebar-foreground">
							Entre em contato:{' '}
							<a
								href="mailto:contato@psicllin.com"
								className="hover:text-primary hover:underline"
							>
								contato@psicllin.com
							</a>
						</p>
					</div>
				</div>
				<div className="mt-12 border-t border-border pt-8 text-center text-sm">
					<p>
						&copy; {new Date().getFullYear()} PsiCllin. Todos os direitos
						reservados.
					</p>
				</div>
			</div>
		</footer>
	);
}
