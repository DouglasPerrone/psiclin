import { BlogForm } from '@/components/admin/BlogForm';

export default function NewBlogPostPage() {
  // Potential: Fetch categories from Firestore if they are dynamic
  const categories = ['Ansiedade', 'Bem-estar', 'Produtividade', 'Mindfulness', 'Relacionamentos', 'Outro'];

  return (
    <div>
      <BlogForm categories={categories} />
    </div>
  );
}
