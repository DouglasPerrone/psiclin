import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { type BlogPost } from '@/components/BlogCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, UserCircle } from 'lucide-react';

// Buscar post real da API pelo slug
async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  const res = await fetch(`/api/admin/blog?slug=${slug}`);
  if (!res.ok) return null;
  const post = await res.json();
  if (!post) return null;
  return { ...post, createdAt: new Date(post.createdAt) };
}

function formatDate(date: Date | { seconds: number; nanoseconds: number }): string {
  let d: Date;
  if (date instanceof Date) {
    d = date;
  } else {
    d = new Date(date.seconds * 1000);
  }
  return d.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

interface PostPageParams {
  slug: string;
}

export default async function BlogPostPage({ params }: { params: Promise<PostPageParams> }) {
  const { slug } = await params;
  const headersList = headers();
  const host = headersList.get('host');
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const baseUrl = `${protocol}://${host}`;
  const res = await fetch(`${baseUrl}/api/admin/blog?slug=${slug}`);
  if (!res.ok) notFound();
  const post = await res.json();
  if (!post) notFound();

  return (
    <article className="bg-background py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <header className="mb-8">
          {post.category && (
            <Link href={`/blog?category=${post.category}`} className="block mb-2">
              <Badge variant="secondary">{post.category}</Badge>
            </Link>
          )}
          <h1 className="font-headline text-3xl md:text-4xl font-bold text-foreground mb-4">{post.title}</h1>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src="https://placehold.co/40x40.png" alt="Autor" data-ai-hint="professional avatar" />
                <AvatarFallback><UserCircle size={16}/></AvatarFallback>
              </Avatar>
              <span>PsiCllin Admin</span> {/* Placeholder author */}
            </div>
            <div className="flex items-center">
              <CalendarDays className="mr-1.5 h-4 w-4" />
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>
        </header>

        {post.coverImageUrl && (
          <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={post.coverImageUrl}
              alt={`Imagem de capa para ${post.title}`}
              width={1200}
              height={600}
              className="w-full h-auto object-cover"
              priority // Prioritize loading cover image for LCP
              data-ai-hint={post.dataAiHint || "article illustration"}
            />
          </div>
        )}

        {/* Ensure content is sanitized if it comes from a WYSIWYG editor */}
        {post.content && (
           <div
            className="prose prose-lg max-w-none dark:prose-invert text-foreground/90 prose-headings:font-headline prose-headings:text-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-foreground"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        )}
       

        <div className="mt-12 border-t pt-8">
          <Link href="/blog" className="text-primary hover:underline">
            &larr; Voltar para o Blog
          </Link>
        </div>
      </div>
    </article>
  );
}

// Optional: Generate static paths if you have a known set of slugs
// export async function generateStaticParams() {
//   // Fetch all post slugs, e.g., from Firebase
//   const posts = await fetchPosts(); // Assuming fetchPosts gets all posts
//   return posts.map((post) => ({
//     slug: post.slug,
//   }));
// }
