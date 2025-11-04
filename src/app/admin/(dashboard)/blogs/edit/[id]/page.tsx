import EditBlogPostClient from '../EditBlogPostClient';

const categories = ['Ansiedade', 'Bem-estar', 'Produtividade', 'Mindfulness', 'Relacionamentos', 'Outro'];

export default function EditBlogPostPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <EditBlogPostClient slug={params.id} categories={categories} />
    </div>
  );
}
