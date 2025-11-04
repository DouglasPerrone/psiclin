"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

// Simulação: normalmente você buscaria o vídeo pelo ID
export default function AdminEditVideoPage({ params }: { params: { id: string } }) {
  // Simule buscar dados do vídeo pelo id
  const [title, setTitle] = useState('Exemplo de Vídeo');
  const [youtubeId, setYoutubeId] = useState('abc123');
  const [description, setDescription] = useState('Descrição do vídeo.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simula atualização
    setTimeout(() => {
      toast({ title: 'Vídeo atualizado!', description: `O vídeo "${title}" foi atualizado.` });
      router.push('/admin/videos');
    }, 700);
  };

  return (
    <Card className="shadow-xl max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-2xl md:text-3xl text-foreground">
          Editar Vídeo
        </CardTitle>
        <CardDescription className="text-foreground/80">
          Altere os campos abaixo para atualizar o vídeo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Título do Vídeo</Label>
            <Input id="title" value={title} onChange={e => setTitle(e.target.value)} required placeholder="Título do vídeo" />
          </div>
          <div>
            <Label htmlFor="youtubeId">ID do YouTube</Label>
            <Input id="youtubeId" value={youtubeId} onChange={e => setYoutubeId(e.target.value)} required placeholder="Ex: dQw4w9WgXcQ" />
          </div>
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Input id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Breve descrição do vídeo" />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
