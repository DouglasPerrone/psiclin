import { NextApiRequest, NextApiResponse } from 'next';
import { Contact } from '@/lib/sequelize';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Listar contatos
    const contacts = await Contact.findAll({ order: [['createdAt', 'DESC']] });
    return res.status(200).json(contacts);
  }
  if (req.method === 'POST') {
    // Criar contato
    const { name, email, phone, message, status, subject } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Nome, email e mensagem são obrigatórios.' });
    }
    const contact = await Contact.create({ name, email, phone, message, status, subject });
    return res.status(201).json(contact);
  }
  return res.status(405).json({ error: 'Método não permitido.' });
}
