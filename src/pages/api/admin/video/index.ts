import { NextApiRequest, NextApiResponse } from 'next';
import { Video } from '@/lib/sequelize';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Listar vídeos
    const videos = await Video.findAll({ order: [['createdAt', 'DESC']] });
    return res.status(200).json(videos);
  }
  if (req.method === 'POST') {
    // Adicionar vídeo
    const { title, url, description } = req.body;
    if (!title || !url) {
      return res.status(400).json({ error: 'Título e URL são obrigatórios.' });
    }
    const video = await Video.create({ title, url, description });
    return res.status(201).json(video);
  }
  return res.status(405).json({ error: 'Método não permitido.' });
}
