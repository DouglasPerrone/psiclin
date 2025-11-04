"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { extractYoutubeId, buildWatchUrlFromId } from '@/lib/youtube';

export default function AdminNewVideoPage() {
  const [title, setTitle] = useState('');
  const [youtubeId, setYoutubeId] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const id = extractYoutubeId(youtubeId);
      if (!id) {
        toast({ title: 'ID/URL inválido', description: 'Insira um ID ou URL válido do YouTube (inclui Shorts).'});
        setIsSubmitting(false);
        return;
      }
      const res = await fetch('/api/admin/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          url: buildWatchUrlFromId(id),
          description,
        }),
      });
      if (res.ok) {
        toast({ title: 'Vídeo cadastrado!', description: `O vídeo "${title}" foi adicionado.` });
        router.push('/admin/videos');
      } else {
        const data = await res.json();
        toast({ title: 'Erro ao cadastrar', description: data.error || 'Erro desconhecido.' });
      }
    } catch {
      toast({ title: 'Erro', description: 'Erro ao conectar com a API.' });
    }
    setIsSubmitting(false);
  };

  return (
    <Card className="shadow-xl max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-2xl md:text-3xl text-foreground">
          Adicionar Novo Vídeo
        </CardTitle>
        <CardDescription className="text-foreground/80">
          Preencha os campos abaixo para cadastrar um novo vídeo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Título do Vídeo</Label>
            <Input id="title" value={title} onChange={e => setTitle(e.target.value)} required placeholder="Título do vídeo" />
          </div>
          <div>
            <Label htmlFor="youtubeId">ID ou URL do YouTube (suporta Shorts)</Label>
            <Input id="youtubeId" value={youtubeId} onChange={e => setYoutubeId(e.target.value)} required placeholder="Ex: dQw4w9WgXcQ, https://youtu.be/dQw4w9WgXcQ ou https://youtube.com/shorts/dQw4w9WgXcQ" />
          </div>
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Input id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Breve descrição do vídeo" />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Salvando...' : 'Salvar Vídeo'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
