"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, Edit2, Trash2, Eye, Loader2 } from 'lucide-react';
import { type BlogPost } from '@/components/BlogCard'; // Reusing type
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';


// Buscar posts reais da API
async function fetchAdminPosts(): Promise<BlogPost[]> {
  const res = await fetch('/api/admin/blog');
  if (!res.ok) throw new Error('Erro ao buscar posts');
  const posts = await res.json();
  // Ajustar datas para objeto Date
  return posts.map((p: any) => ({ ...p, createdAt: new Date(p.createdAt) }));
}

// Deletar post na API
async function deletePostAction(postSlug: string): Promise<void> {
  const response = await fetch(`/api/admin/blog?slug=${postSlug}`, {
    method: 'DELETE',
  });
  if (!response.ok && response.status !== 204) {
    const errorText = await response.text();
    throw new Error('Erro ao deletar post: ' + errorText);
  }
}


export default function AdminBlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function loadPosts() {
      setIsLoading(true);
      const fetchedPosts = await fetchAdminPosts();
      setPosts(fetchedPosts);
      setIsLoading(false);
    }
    loadPosts();
  }, []);

  const handleDeleteClick = (post: BlogPost) => {
    setPostToDelete(post);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;
    setIsDeleting(true);
    try {
      await deletePostAction(postToDelete.slug); // Usar slug para deletar o post
      setPosts(posts.filter(p => p.id !== postToDelete.id));
      toast({ title: "Post excluído", description: `O post "${postToDelete.title}" foi excluído com sucesso.` });
    } catch (error) {
      toast({ title: "Erro ao excluir", description: "Não foi possível excluir o post. Tente novamente.", variant: "destructive" });
      console.error("Failed to delete post:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
      setPostToDelete(null);
    }
  };
  
  function formatDate(date: Date | { seconds: number; nanoseconds: number }): string {
    let d: Date;
    if (date instanceof Date) {
      d = date;
    } else {
      d = new Date(date.seconds * 1000);
    }
    return d.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold text-foreground">Gerenciar Posts do Blog</h1>
          <p className="text-muted-foreground">Crie, edite e exclua os artigos do seu blog.</p>
        </div>
        <Button asChild>
          <Link href="/admin/blogs/new">
            <PlusCircle className="mr-2 h-5 w-5" /> Novo Post
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : posts.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border shadow-sm bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>
                    {post.category ? <Badge variant="outline">{post.category}</Badge> : '-'}
                  </TableCell>
                  <TableCell>{formatDate(post.createdAt)}</TableCell>
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
                          <Link href={`/blog/${post.slug}`} target="_blank">
                            <Eye className="mr-2 h-4 w-4" /> Ver Post
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/blogs/edit/${post.slug}`}>
                            <Edit2 className="mr-2 h-4 w-4" /> Editar
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteClick(post)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                          <Trash2 className="mr-2 h-4 w-4" /> Excluir
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
            <p className="text-xl text-muted-foreground">Nenhum post encontrado.</p>
            <Button asChild className="mt-4">
              <Link href="/admin/blogs/new">
                <PlusCircle className="mr-2 h-5 w-5" /> Criar Primeiro Post
              </Link>
            </Button>
        </div>
      )}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o post
              "{postToDelete?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
