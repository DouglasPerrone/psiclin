
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Target, Heart, Eye } from 'lucide-react';

export default function QuemSomosPage() {
  return (
    <div className="bg-background py-12 md:py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12 md:mb-16">
          <h1 className="font-headline text-4xl font-bold text-foreground sm:text-5xl">Sobre a PsiCllin</h1>
          <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
            Conheça nossa história, nossa missão e os valores que guiam nosso trabalho em prol da saúde mental e do bem-estar.
          </p>
        </header>

        <section className="mb-12 md:mb-16">
          <Card className="overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105">
            <div className="md:flex">
              <div className="md:w-1/2">
                <Image
                  src="/imagem/sobrenós.png"
                  alt="Atendimento online PsiClin"
                  width={800}
                  height={600}
                  className="w-full h-64 md:h-full object-cover"
                  data-ai-hint="online therapy session"
                />
              </div>
              <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
                <h2 className="font-headline text-2xl font-semibold text-foreground mb-4">Nossa História</h2>
                <p className="text-foreground/80 mb-4">
                  A PsiCllin nasceu do desejo de tornar a psicanálise acessível e de qualidade para todos. Acreditamos que o cuidado com a saúde mental é essencial para uma vida plena e equilibrada. Desde nossa fundação, temos nos dedicado a conectar pessoas a profissionais qualificados, utilizando a tecnologia para quebrar barreiras geográficas e facilitar o acesso ao suporte psicanalítico.
                </p>
                <p className="text-foreground/80">
                  Nossa plataforma foi cuidadosamente desenvolvida para oferecer um ambiente seguro, confidencial e acolhedor, onde você pode encontrar o apoio necessário para suas jornadas pessoais.
                </p>
              </div>
            </div>
          </Card>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 md:mb-16">
          <Card className="text-center shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Target size={32} />
              </div>
              <CardTitle className="font-headline text-xl text-foreground">Nossa Missão</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80">
                Facilitar o acesso a serviços de psicanálise de qualidade, promovendo o bem-estar emocional e a saúde mental de forma humanizada, ética e acessível.
              </p>
            </CardContent>
          </Card>
          <Card className="text-center shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Eye size={32} />
              </div>
              <CardTitle className="font-headline text-xl text-foreground">Nossa Visão</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80">
                Ser referência em psicanálise online, reconhecida pela excelência no atendimento, inovação tecnológica e impacto positivo na vida das pessoas.
              </p>
            </CardContent>
          </Card>
          <Card className="text-center shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Heart size={32} />
              </div>
              <CardTitle className="font-headline text-xl text-foreground">Nossos Valores</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-none space-y-1 text-foreground/80">
                <li>Empatia e Acolhimento</li>
                <li>Ética e Confidencialidade</li>
                <li>Excelência Profissional</li>
                <li>Inovação e Acessibilidade</li>
                <li>Respeito à Diversidade</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="text-center">
          <h2 className="font-headline text-3xl font-bold text-foreground mb-8">
            Nossa Equipe
          </h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto mb-10">
            Conheça nossos profissionais dedicados ao seu bem-estar.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-center">
            <Card className="shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105">
              <Image src="/imagem/ps2.png" alt="Kelly Cristina" width={400} height={400} className="w-40 h-40 mx-auto mt-6 rounded-full object-cover border-4 border-primary" data-ai-hint="professional portrait" />
              <CardContent className="p-4">
                <h3 className="font-headline text-lg font-semibold text-foreground">Kelly Cristina</h3>
                <p className="text-sm text-primary">Psicanalista</p>
                <p className="text-xs text-foreground/70 mt-1">Linguagem do Corpo e Psicoembriologia</p>
              </CardContent>
            </Card>
            <Card className="shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105">
              <Image src="/imagem/psi1.png" alt="Alisson Jardim" width={400} height={400} className="w-40 h-40 mx-auto mt-6 rounded-full object-cover border-4 border-primary" data-ai-hint="professional portrait" />
              <CardContent className="p-4">
                <h3 className="font-headline text-lg font-semibold text-foreground">Alisson Jardim</h3>
                <p className="text-sm text-primary">Psicanalista Clínico</p>
                <p className="text-xs text-foreground/70 mt-1">Mestrado e Doutorado em Psicanálise Contemporânea</p>
              </CardContent>
            </Card>
            <Card className="shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105">
              <Image src="/imagem/psi3.png" alt="Rosiane Natividade" width={400} height={400} className="w-40 h-40 mx-auto mt-6 rounded-full object-cover border-4 border-primary" data-ai-hint="professional portrait" />
              <CardContent className="p-4">
                <h3 className="font-headline text-lg font-semibold text-foreground">Rosiane Natividade</h3>
                <p className="text-sm text-primary">Farmacêutica CRF: 13169</p>
                <p className="text-xs text-foreground/70 mt-1">Especialização Fitoterapia</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
