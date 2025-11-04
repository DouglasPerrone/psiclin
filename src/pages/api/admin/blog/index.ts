import type { NextApiRequest, NextApiResponse } from 'next';
import { BlogPost } from '@/lib/sequelize';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { slug } = req.query;
    if (slug) {
      // Buscar post único pelo slug
      const post = await BlogPost.findOne({ where: { slug: String(slug) } });
      return res.status(200).json(post);
    }
    // Buscar todos os posts
    const posts = await BlogPost.findAll({ order: [['createdAt', 'DESC']] });
    return res.status(200).json(posts);
  }

  if (req.method === 'POST') {
    const { title, slug, summary, coverImageUrl, dataAiHint, category, content } = req.body;
    if (!title || !slug) {
      return res.status(400).json({ message: 'Título e slug são obrigatórios.' });
    }
    try {
      const post = await BlogPost.create({
        title,
        slug,
        summary,
        coverImageUrl,
        dataAiHint,
        category,
        content,
      });
      return res.status(201).json(post);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao criar post.', error });
    }
  }

  if (req.method === 'PUT') {
    const { slug, ...data } = req.body;
    if (!slug) {
      return res.status(400).json({ message: 'Slug é obrigatório para atualizar.' });
    }
    try {
      const post = await BlogPost.update(data, { where: { slug: String(slug) } });
      return res.status(200).json(post);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao atualizar post.', error });
    }
  }

  if (req.method === 'DELETE') {
    const { slug } = req.query;
    if (!slug) {
      return res.status(400).json({ message: 'Slug é obrigatório para deletar.' });
    }
    try {
      await BlogPost.destroy({ where: { slug: String(slug) } });
      return res.status(204).end();
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao deletar post.', error });
    }
  }

  res.status(405).json({ message: 'Method not allowed' });
}
