import { NextApiRequest, NextApiResponse } from 'next';
import { Video } from '@/lib/sequelize';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  if (req.method === 'DELETE') {
    try {
      const deleted = await Video.destroy({ where: { id: Number(id) } });
      if (!deleted) return res.status(404).json({ error: 'Vídeo não encontrado.' });
      return res.status(204).end();
    } catch (error) {
      return res.status(404).json({ error: 'Vídeo não encontrado.' });
    }
  } else if (req.method === 'PATCH') {
    try {
      const { featured } = req.body;
      const [updatedRows, [updated]] = await Video.update(
        { featured: Boolean(featured) },
        { where: { id: Number(id) }, returning: true }
      );
      if (!updated) return res.status(404).json({ error: 'Vídeo não encontrado.' });
      return res.status(200).json(updated);
    } catch (error) {
      return res.status(404).json({ error: 'Vídeo não encontrado.' });
    }
  }
  return res.status(405).json({ error: 'Método não permitido.' });
}

export default handler;
