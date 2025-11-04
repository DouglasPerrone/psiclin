"use client";

import { useEffect, useState } from 'react';
import { BlogForm } from '@/components/admin/BlogForm';
import { type BlogPost } from '@/components/BlogCard';

interface EditBlogPostClientProps {
  slug: string;
  categories: string[];
}

export default function EditBlogPostClient({ slug, categories }: EditBlogPostClientProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`/api/admin/blog?slug=${slug}`);
        if (res.ok) {
          const data = await res.json();
          setPost(data);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [slug]);

  if (loading) return <div>Carregando...</div>;
  if (!post) return <div>Post não encontrado.</div>;

  return <BlogForm post={post} categories={categories} />;
}
