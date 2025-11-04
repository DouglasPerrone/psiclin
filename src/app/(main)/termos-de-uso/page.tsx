"use client";

import { useState, useEffect } from 'react';

export default function TermosDeUsoPage() {
    const [lastUpdated, setLastUpdated] = useState('');

    useEffect(() => {
        // We only want to run this on the client after hydration
        // to avoid a mismatch between server and client rendered content.
        setLastUpdated(new Date().toLocaleDateString('pt-BR'));
    }, []);

  return (
    <div className="bg-background py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <header className="text-center mb-12">
          <h1 className="font-headline text-4xl font-bold text-foreground sm:text-5xl">Termos de Uso</h1>
        </header>
        <div className="prose prose-lg max-w-none dark:prose-invert text-foreground/90 prose-headings:font-headline prose-headings:text-foreground">
          <p>Última atualização: {lastUpdated}</p>

          <h2>1. Aceitação dos Termos</h2>
          <p>Ao acessar e usar os serviços da PsiCllin ("Serviços"), você concorda em cumprir e estar vinculado a estes Termos de Uso ("Termos"). Se você não concorda com estes Termos, não use os Serviços.</p>

          <h2>2. Descrição dos Serviços</h2>
          <p>A PsiCllin fornece uma plataforma online para conectar usuários a profissionais de psicanálise para consultas e informações relacionadas à saúde mental.</p>
          <p>Os Serviços não se destinam a substituir o aconselhamento médico profissional, diagnóstico ou tratamento. Sempre procure o conselho do seu médico ou outro profissional de saúde qualificado com quaisquer perguntas que você possa ter sobre uma condição médica.</p>

          <h2>3. Contas de Usuário</h2>
          <p>Para acessar alguns recursos dos Serviços, você pode ser obrigado a criar uma conta. Você é responsável por manter a confidencialidade de suas informações de conta e por todas as atividades que ocorrem sob sua conta.</p>

          <h2>4. Conduta do Usuário</h2>
          <p>Você concorda em não usar os Serviços para qualquer finalidade ilegal ou proibida por estes Termos. Você não pode usar os Serviços de qualquer maneira que possa danificar, desabilitar, sobrecarregar ou prejudicar qualquer servidor da PsiCllin, ou as redes conectadas a qualquer servidor da PsiCllin.</p>

          <h2>5. Propriedade Intelectual</h2>
          <p>Todo o conteúdo incluído ou disponibilizado através dos Serviços, como texto, gráficos, logotipos, ícones de botão, imagens, clipes de áudio, downloads digitais e compilações de dados é propriedade da PsiCllin ou de seus fornecedores de conteúdo e protegido pelas leis de direitos autorais internacionais.</p>
          
          <h2>6. Limitação de Responsabilidade</h2>
          <p>Na máxima extensão permitida pela lei aplicável, em nenhum caso a PsiCllin será responsável por quaisquer danos indiretos, incidentais, especiais, consequenciais ou punitivos, ou qualquer perda de lucros ou receitas, seja incorrida direta ou indiretamente, ou qualquer perda de dados, uso, ágio ou outras perdas intangíveis, resultantes de (a) seu acesso ou uso ou incapacidade de acessar ou usar os serviços; (b) qualquer conduta ou conteúdo de terceiros nos serviços.</p>

          <h2>7. Alterações nos Termos</h2>
          <p>Reservamo-nos o direito de modificar estes Termos a qualquer momento. Se fizermos alterações materiais a estes Termos, forneceremos a você um aviso conforme apropriado sob as circunstâncias.</p>

          <h2>8. Contato</h2>
          <p>Se você tiver alguma dúvida sobre estes Termos, entre em contato conosco em: contato@psicllin.com.</p>
        </div>
      </div>
    </div>
  );
}
