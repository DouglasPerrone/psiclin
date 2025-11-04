"use client"; // Required for useState, useEffect

import { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BlogCard, type BlogPost } from '@/components/BlogCard';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Buscar posts reais da API
async function fetchPosts(): Promise<BlogPost[]> {
  const res = await fetch('/api/admin/blog');
  if (!res.ok) throw new Error('Erro ao buscar posts');
  const posts = await res.json();
  return posts.map((p: any) => ({ ...p, createdAt: new Date(p.createdAt) }));
}

const categories = ['Todos', 'Ansiedade', 'Bem-estar', 'Produtividade', 'Mindfulness'];

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  useEffect(() => {
    async function loadPosts() {
      setIsLoading(true);
      const fetchedPosts = await fetchPosts();
      setPosts(fetchedPosts);
      setIsLoading(false);
    }
    loadPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearchTerm = post.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Todos' || post.category === selectedCategory;
      return matchesSearchTerm && matchesCategory;
    });
  }, [posts, searchTerm, selectedCategory]);

  return (
    <div className="bg-background py-12 md:py-20">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12 md:mb-16">
          <h1 className="font-headline text-4xl font-bold text-foreground sm:text-5xl">Nosso Blog</h1>
          <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
            Artigos, dicas e reflexões sobre saúde mental, bem-estar e desenvolvimento pessoal.
          </p>
        </header>

        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <label htmlFor="search-blog" className="block text-sm font-medium text-foreground mb-1">Buscar por título</label>
            <div className="relative">
              <Input
                id="search-blog"
                type="text"
                placeholder="Digite o título do artigo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          <div>
            <label htmlFor="category-select" className="block text-sm font-medium text-foreground mb-1">Filtrar por categoria</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger id="category-select">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-xl text-muted-foreground">Nenhum artigo encontrado.</p>
            { (searchTerm || selectedCategory !== 'Todos') && (
                 <Button variant="link" onClick={() => { setSearchTerm(''); setSelectedCategory('Todos');}} className="mt-4">
                    Limpar filtros
                 </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
