"use client";

import { useState, useEffect } from 'react';

export default function PoliticaDePrivacidadePage() {
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
          <h1 className="font-headline text-4xl font-bold text-foreground sm:text-5xl">Política de Privacidade</h1>
        </header>
        <div className="prose prose-lg max-w-none dark:prose-invert text-foreground/90 prose-headings:font-headline prose-headings:text-foreground">
          <p>Última atualização: {lastUpdated}</p>

          <h2>1. Coleta de Informações</h2>
          <p>Coletamos informações que você nos fornece diretamente, como quando você cria uma conta, preenche um formulário de contato, solicita agendamento ou se comunica conosco de outra forma.</p>
          <p>As informações que podemos coletar incluem seu nome, endereço de e-mail, número de telefone, informações de pagamento e qualquer outra informação que você decida fornecer.</p>

          <h2>2. Uso das Informações</h2>
          <p>Usamos as informações que coletamos para:</p>
          <ul>
            <li>Fornecer, manter e melhorar nossos serviços;</li>
            <li>Processar transações e enviar informações relacionadas, incluindo confirmações e faturas;</li>
            <li>Enviar avisos técnicos, atualizações, alertas de segurança e mensagens de suporte e administrativas;</li>
            <li>Responder aos seus comentários, perguntas e solicitações e fornecer atendimento ao cliente;</li>
            <li>Comunicar com você sobre produtos, serviços, ofertas, promoções, recompensas e eventos oferecidos pela PsiCllin e outros, e fornecer notícias e informações que achamos que serão de seu interesse;</li>
          </ul>

          <h2>3. Compartilhamento de Informações</h2>
          <p>Não compartilhamos suas informações pessoais com terceiros, exceto conforme descrito nesta Política de Privacidade ou com o seu consentimento.</p>

          <h2>4. Segurança</h2>
          <p>A PsiCllin toma medidas razoáveis para ajudar a proteger informações sobre você contra perda, roubo, uso indevido e acesso não autorizado, divulgação, alteração e destruição.</p>
          
          <h2>5. Seus Direitos</h2>
          <p>Você tem o direito de acessar, corrigir ou excluir suas informações pessoais. Você também pode ter o direito de restringir ou se opor a determinados processamentos.</p>

          <h2>6. Alterações nesta Política</h2>
          <p>Podemos alterar esta Política de Privacidade de tempos em tempos. Se fizermos alterações, notificaremos você revisando a data no topo da política e, em alguns casos, podemos fornecer um aviso adicional.</p>

          <h2>7. Contato</h2>
          <p>Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco em: contato@psicllin.com.</p>
        </div>
      </div>
    </div>
  );
}
