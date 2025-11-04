"use client";

import { useState, type FormEvent, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Image as ImageIcon, Tag } from 'lucide-react';
import type { BlogPost } from '@/components/BlogCard'; // Reusing type
import dynamic from "next/dynamic";
const LexicalEditorWrapper = dynamic(() => import('./LexicalEditorWrapper'), { ssr: false });

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

// Placeholder for creating/updating posts. In a real app, this would use Server Actions or API calls.
async function savePostAction(postData: Omit<BlogPost, 'id' | 'createdAt' | 'slug'> & { id?: string }): Promise<BlogPost> {
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
  const slug = postData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  const newPost: BlogPost = {
    id: postData.id || Math.random().toString(36).substr(2, 9),
    slug: slug,
    createdAt: new Date(),
    ...postData,
  };
  console.log("Post saved (placeholder):", newPost);
  return newPost;
}


interface BlogFormProps {
  post?: BlogPost; // For editing
  categories?: string[]; // Optional list of categories
}

export function BlogForm({ post, categories = ['Ansiedade', 'Bem-estar', 'Produtividade', 'Mindfulness', 'Outro'] }: BlogFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [title, setTitle] = useState(post?.title || '');
  const [coverImageUrl, setCoverImageUrl] = useState(post?.coverImageUrl || '');
  const [category, setCategory] = useState(post?.category || '');
  const [content, setContent] = useState(post?.content || ''); // Assuming BlogPost has content field
  const [summary, setSummary] = useState(post?.summary || '');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if(post) {
      setTitle(post.title);
      setCoverImageUrl(post.coverImageUrl);
      setCategory(post.category || '');
      setContent((post as any).content || ''); // Cast to any if content is not strictly in BlogPost type
      setSummary(post.summary || '');
    }
  }, [post]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Gerar slug automaticamente se não estiver editando
    const slug = post?.slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    const postData = {
      title,
      slug,
      coverImageUrl,
      category,
      content,
      summary,
      dataAiHint: '', // Adapte se quiser usar
    };

    try {
      const response = await fetch('/api/admin/blog', {
        method: post ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error:', errorText);
        throw new Error('Erro ao salvar post: ' + errorText);
      }
      toast({
        title: post ? "Post Atualizado!" : "Post Criado!",
        description: `O post "${title}" foi salvo com sucesso.`,
      });
      router.push('/admin/blogs');
      router.refresh();
    } catch (error) {
      console.error("Failed to save post:", error);
      toast({
        title: "Erro ao Salvar",
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para lidar com upload local
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setCoverImageUrl(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl md:text-3xl text-foreground">
          {post ? 'Editar Post' : 'Criar Novo Post'}
        </CardTitle>
        <CardDescription className="text-foreground/80">
          Preencha os campos abaixo para {post ? 'atualizar' : 'publicar'} o artigo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title" className="font-semibold">Título do Post</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Um título impactante para seu artigo"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="summary" className="font-semibold">Resumo (Opcional)</Label>
            <Textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Um breve resumo do post para listagens e SEO (max 200 caracteres)"
              rows={3}
              maxLength={200}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="coverImageUpload" className="font-semibold">Imagem de Capa</Label>
            <div className="flex items-center gap-4 mt-1">
              <input
                id="coverImageUpload"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="block"
              />
              {coverImageUrl && (
                <img src={coverImageUrl} alt="Prévia da imagem de capa" className="max-h-32 rounded-md border object-cover" />
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="category" className="font-semibold">Categoria</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category" className="mt-1">
                <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="font-semibold">Conteúdo</Label>
            <div className="min-h-[200px] p-2 bg-background rounded shadow-sm border border-gray-200 focus-within:ring-2 focus-within:ring-primary transition-all">
              <LexicalEditorWrapper value={content} onChange={setContent} />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" className="min-w-[120px]" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {isSubmitting ? (post ? 'Salvando...' : 'Publicando...') : (post ? 'Salvar Alterações' : 'Publicar Post')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
