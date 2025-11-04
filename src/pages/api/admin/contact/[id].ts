import { NextApiRequest, NextApiResponse } from 'next';
import { Contact } from '@/lib/sequelize';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (req.method === 'DELETE') {
    try {
      const deleted = await Contact.destroy({ where: { id: Number(id) } });
      if (!deleted) return res.status(404).json({ error: 'Contato não encontrado.' });
      return res.status(204).end();
    } catch (error) {
      return res.status(404).json({ error: 'Contato não encontrado.' });
    }
  }
  if (req.method === 'PATCH') {
    // Atualizar status do contato
    const { status } = req.body;
    try {
      const [updatedRows, [updated]] = await Contact.update(
        { status },
        { where: { id: Number(id) }, returning: true }
      );
      if (!updated) return res.status(404).json({ error: 'Contato não encontrado.' });
      return res.status(200).json(updated);
    } catch (error) {
      return res.status(404).json({ error: 'Contato não encontrado.' });
    }
  }
  return res.status(405).json({ error: 'Método não permitido.' });
}
