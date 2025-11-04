
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, Trash2, Edit2, Eye } from 'lucide-react';
import { VideoCard, type VideoData } from '@/components/VideoCard';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { extractYoutubeId } from '@/lib/youtube';

// Placeholder: vídeos mockados
const initialVideos: VideoData[] = [
  { id: '1', title: 'Como Meditar', youtubeId: 'abc123', thumbnailUrl: 'https://img.youtube.com/vi/abc123/hqdefault.jpg', description: 'Aprenda técnicas básicas de meditação.' },
  { id: '2', title: 'Respiração para Ansiedade', youtubeId: 'def456', thumbnailUrl: 'https://img.youtube.com/vi/def456/hqdefault.jpg', description: 'Exercícios de respiração guiada.' },
];

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<VideoData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchVideos() {
      const res = await fetch('/api/admin/video');
      if (res.ok) {
        const data = await res.json();
        setVideos(
          data.map((v: any) => {
            const youtubeId = extractYoutubeId(v.url);
            return {
              id: v.id.toString(),
              title: v.title,
              youtubeId: youtubeId,
              thumbnailUrl: youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : '',
              description: v.description || '',
              featured: v.featured || false,
            }
          })
        );
      }
    }
    fetchVideos();
  }, []);

  const handleDeleteClick = (video: VideoData) => {
    setVideoToDelete(video);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!videoToDelete) return;
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/admin/video/${videoToDelete.id}`, { method: 'DELETE' });
      if (res.ok) {
        setVideos(videos.filter(v => v.id !== videoToDelete.id));
        toast({ title: 'Vídeo removido', description: `O vídeo "${videoToDelete.title}" foi removido.` });
      } else {
        toast({ title: 'Erro', description: 'Não foi possível remover o vídeo.' });
      }
    } catch {
      toast({ title: 'Erro', description: 'Erro ao conectar com a API.' });
    }
    setIsProcessing(false);
    setShowDeleteDialog(false);
    setVideoToDelete(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold text-foreground">Gerenciar Vídeos</h1>
          <p className="text-muted-foreground">Adicione, edite ou remova vídeos exibidos no site.</p>
        </div>
        <Button asChild>
          <Link href="/admin/videos/new">
            <PlusCircle className="mr-2 h-5 w-5" /> Novo Vídeo
          </Link>
        </Button>
      </div>
      {videos.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border shadow-sm bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Preview</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Destaque</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {videos.map((video) => (
                <TableRow key={video.id}>
                  <TableCell className="font-medium">{video.title}</TableCell>
                  <TableCell>
                    <img src={video.thumbnailUrl} alt={video.title} className="w-24 rounded" />
                  </TableCell>
                  <TableCell>{video.description}</TableCell>
                  <TableCell>
                    <Switch
                      checked={!!video.featured}
                      onCheckedChange={async (checked) => {
                        const res = await fetch(`/api/admin/video/${video.id}`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ featured: checked }),
                        });
                        if (res.ok) {
                          setVideos((prev) => prev.map((v) => v.id === video.id ? { ...v, featured: checked } : v));
                          toast({ title: checked ? 'Vídeo em destaque' : 'Destaque removido', description: `O vídeo "${video.title}" foi ${checked ? 'destacado' : 'removido do destaque'}.` });
                        } else {
                          toast({ title: 'Erro', description: 'Não foi possível atualizar o destaque.' });
                        }
                      }}
                      disabled={isProcessing}
                      aria-label={video.featured ? 'Remover destaque' : 'Destacar vídeo'}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <a href={`https://youtube.com/watch?v=${video.youtubeId}`} target="_blank" rel="noopener noreferrer">
                            <Eye className="mr-2 h-4 w-4" /> Ver no YouTube
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/videos/edit/${video.id}`}>
                            <Edit2 className="mr-2 h-4 w-4" /> Editar
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteClick(video)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                          <Trash2 className="mr-2 h-4 w-4" /> Remover
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-10 border rounded-lg bg-card">
          <p className="text-xl text-muted-foreground">Nenhum vídeo cadastrado.</p>
          <Button asChild className="mt-4">
            <Link href="/admin/videos/new">
              <PlusCircle className="mr-2 h-5 w-5" /> Adicionar Primeiro Vídeo
            </Link>
          </Button>
        </div>
      )}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Remoção</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover o vídeo "{videoToDelete?.title}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isProcessing} className="bg-destructive hover:bg-destructive/90">
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
