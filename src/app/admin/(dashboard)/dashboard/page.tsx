"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, Users, MessageCircle, CalendarCheck, Mail, Video } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    posts: 0,
    postsLastMonth: 0,
    contatos: 0,
    contatosNaoRespondidos: 0,
    videosDestaque: 0,
    atividades: [] as string[],
  });
  useEffect(() => {
    async function fetchStats() {
      // Posts
      const postsRes = await fetch("/api/admin/blog");
      const posts = postsRes.ok ? await postsRes.json() : [];
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      const postsLastMonth = posts.filter((p: any) => new Date(p.createdAt) > lastMonth).length;
      // Contatos
      const contatosRes = await fetch("/api/admin/contact");
      const contatos = contatosRes.ok ? await contatosRes.json() : [];
      const contatosNaoRespondidos = contatos.filter((c: any) => c.status !== "respondido").length;
      // Vídeos em destaque
      const videosRes = await fetch("/api/admin/video");
      const videos = videosRes.ok ? await videosRes.json() : [];
      const videosDestaque = videos.filter((v: any) => v.featured).length;
      // Atividades recentes (últimos 5 de cada)
      const atividades: string[] = [];
      posts.slice(0, 2).forEach((p: any) => atividades.push(`Novo post "${p.title}" publicado.`));
      contatos.slice(0, 2).forEach((c: any) => atividades.push(`Nova mensagem de ${c.name}.`));
      videos.slice(0, 1).forEach((v: any) => atividades.push(`Vídeo "${v.title}" adicionado.`));
      setStats({
        posts: posts.length,
        postsLastMonth,
        contatos: contatos.length,
        contatosNaoRespondidos,
        videosDestaque,
        atividades,
      });
    }
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-headline text-3xl font-bold text-foreground">Dashboard Administrativo</h1>
        <p className="text-muted-foreground">Visão geral e atalhos para gerenciamento do site.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg hover:shadow-primary/20 transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Posts</CardTitle>
            <Newspaper className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.posts}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.postsLastMonth} no último mês
            </p>
            <Link href="/admin/blogs" className="text-sm text-primary hover:underline mt-2 block">
              Gerenciar Posts &rarr;
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-primary/20 transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Solicitações de Agendamento</CardTitle>
            <CalendarCheck className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Em breve
            </p>
             <Link href="/admin/agendamentos" className="text-sm text-primary hover:underline mt-2 block">
              Ver Agendamentos &rarr;
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-primary/20 transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mensagens de Contato</CardTitle>
            <Mail className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.contatos}</div>
            <p className="text-xs text-muted-foreground">
              {stats.contatosNaoRespondidos} não respondidas
            </p>
            <Link href="/admin/contatos" className="text-sm text-primary hover:underline mt-2 block">
              Ver Mensagens &rarr;
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-primary/20 transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vídeos em Destaque</CardTitle>
            <Video className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.videosDestaque}</div>
            <p className="text-xs text-muted-foreground">
              Gerencie quais vídeos aparecem em destaque na home
            </p>
            <Link href="/admin/videos" className="text-sm text-primary hover:underline mt-2 block">
              Gerenciar Vídeos &rarr;
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Atividades Recentes</CardTitle>
          <CardDescription>Um log das últimas ações no painel.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {stats.atividades.length === 0 && <li>Nenhuma atividade recente.</li>}
            {stats.atividades.map((a, i) => <li key={i}>{a}</li>)}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
