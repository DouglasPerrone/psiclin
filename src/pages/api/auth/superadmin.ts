import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { User } from '@/lib/sequelize';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Proteção simples por token de seed via header
  const headerToken = req.headers['x-seed-token'];
  const expectedToken = process.env.ADMIN_SEED_TOKEN || 'dev-seed-token';
  if (!headerToken || headerToken !== expectedToken) {
    return res.status(401).json({ message: 'Unauthorized: invalid seed token' });
  }

  const { email: bodyEmail, password: bodyPassword, name: bodyName } = req.body || {};
  const email = bodyEmail || process.env.SUPERADMIN_EMAIL || 'admin@psiclin.com';
  const password = bodyPassword || process.env.SUPERADMIN_PASSWORD || 'Admin@123';
  const name = bodyName || process.env.SUPERADMIN_NAME || 'Super Admin';

  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(200).json({ message: 'Superadmin já existe', user: { id: existing.id, email: existing.email, name: existing.name } });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed, name });
    return res.status(201).json({ message: 'Superadmin criado', user: { id: user.id, email: user.email, name: user.name } });
  } catch (err: any) {
    console.error('Seed superadmin error:', err);
    return res.status(500).json({ message: 'Internal server error', error: err?.message || 'Unknown error' });
  }
}