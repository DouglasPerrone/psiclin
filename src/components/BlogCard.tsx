import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  coverImageUrl: string;
  dataAiHint?: string;
  category?: string;
  createdAt: Date | { seconds: number; nanoseconds: number }; // Firestore timestamp or Date
  content?: string;
}

interface BlogCardProps {
  post: BlogPost;
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


export function BlogCard({ post }: BlogCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full max-w-[390px]">
      <Link href={`/blog/${post.slug}`} className="block">
        <Image
          src={post.coverImageUrl || "https://placehold.co/600x400.png"}
          alt={post.title}
          width={390}
          height={220}
          className="w-full h-56 object-cover transition-transform duration-300 hover:scale-105"
          data-ai-hint={post.dataAiHint || "article topic"}
        />
      </Link>
      <CardHeader className="flex-grow">
        {post.category && (
          <Badge variant="secondary" className="mb-2 w-fit">{post.category}</Badge>
        )}
        <CardTitle className="font-headline text-xl md:text-2xl">
          <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
            {post.title}
          </Link>
        </CardTitle>
        <div className="flex items-center text-sm md:text-base text-muted-foreground mt-1">
          <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
          <span>{formatDate(post.createdAt)}</span>
        </div>
      </CardHeader>
      {post.summary && (
        <CardContent className="flex-grow">
          <p className="text-base text-foreground/80 line-clamp-3">{post.summary}</p>
        </CardContent>
      )}
      <CardFooter>
        <Button asChild variant="link" className="p-0 h-auto text-primary text-base">
          <Link href={`/blog/${post.slug}`}>
            Ler mais <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
