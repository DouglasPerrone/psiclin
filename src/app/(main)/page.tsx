import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, MessageSquare, Video, CalendarCheck, Users, Brain, HeartHandshake } from 'lucide-react';
import { BlogCard } from '@/components/BlogCard';
import FeaturedVideos from './FeaturedVideos';
import BlogSectionClient from '@/components/BlogSectionClient';
import { getHomeData } from './server/getHomeData';

export default async function HomePage() {
  const { featuredPosts, featuredVideos } = await getHomeData();

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[420px] flex items-center justify-center overflow-hidden">
        <Image src="/imagem/floresta.jpg" alt="Floresta" fill priority className="object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />
        <div className="relative z-20 flex flex-col items-center justify-center w-full h-full px-4 text-center">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-6 text-center">Encontre Equilíbrio e Bem-Estar Emocional</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl text-center mb-8">Na PsiCllin, oferecemos suporte psicanalítico especializado para te ajudar a superar desafios e construir uma vida mais plena e saudável.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="shadow-lg bg-primary hover:bg-primary/80 transition flex items-center gap-2">
              <Link href="/contato"><CalendarCheck className="w-5 h-5" /> Agendar Sessão</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="shadow-lg border-primary text-primary hover:bg-primary/10 transition flex items-center gap-2">
              <Link href="/quem-somos">Saiba Mais <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services/Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl font-bold text-center text-foreground mb-12">Nossos Serviços</h2>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            <Card className="shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-2xl bg-card">
              <CardHeader className="items-center">
                <div className="p-5 rounded-full bg-secondary text-primary mb-6">
                  <Brain size={48} />
                </div>
                <CardTitle className="font-headline text-2xl">Terapia Individual</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 text-center">Apoio personalizado para suas questões emocionais e desenvolvimento pessoal.</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-2xl bg-card">
              <CardHeader className="items-center">
                <div className="p-5 rounded-full bg-secondary text-primary mb-6">
                  <HeartHandshake size={48} />
                </div>
                <CardTitle className="font-headline text-2xl">Terapia de Casal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 text-center">Fortaleça seu relacionamento e melhore a comunicação com seu parceiro(a).</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-2xl bg-card">
              <CardHeader className="items-center">
                <div className="p-5 rounded-full bg-secondary text-primary mb-6">
                  <Users size={48} />
                </div>
                <CardTitle className="font-headline text-2xl">Terapia em Grupo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 text-center">Vivencie a troca e o acolhimento em grupos terapêuticos, com pessoas que compartilham desafios e buscam crescimento emocional junto com você.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Blog Posts Section */}
      <BlogSectionClient posts={featuredPosts} />

      {/* Featured Videos Section */}
      <section className="py-12 md:py-16 bg-card mb-12">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl font-bold text-center text-foreground mb-12">Vídeos em Destaque</h2>
          <FeaturedVideos videos={featuredVideos} />
          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link href="/videos">Ver todos os vídeos</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action (Scheduling) */}
      <section className="py-10 md:py-14 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-headline text-3xl font-bold mb-6">Pronto para Começar?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Dê o primeiro passo em direção a uma vida mais equilibrada e feliz. Agende sua consulta online hoje mesmo.
          </p>
          <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-lg">
            <Link href="/contato">Agendar Sessão <CalendarCheck className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>
      </section>
    </>
  );
}
