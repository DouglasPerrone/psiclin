"use client";
import { BlogCarousel } from '@/components/BlogCarousel';
import type { BlogPost } from '@/components/BlogCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function BlogSectionClient({ posts }: { posts: BlogPost[] }) {
  return (
    <section className="py-12 md:py-16 bg-background mb-12">
      <div className="container mx-auto px-4">
        <h2 className="font-headline text-3xl font-bold text-center text-foreground mb-12">Últimos Artigos</h2>
        <div className="flex justify-center">
          <div className="w-full max-w-5xl">
            <BlogCarousel posts={posts} />
          </div>
        </div>
        <div className="mt-8 text-center">
          <Button asChild variant="outline">
            <Link href="/blog">Ver todos os artigos</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
