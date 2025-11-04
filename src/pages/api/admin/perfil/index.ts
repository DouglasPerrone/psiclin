import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { promises as fs } from 'fs';
import path from 'path';
import { User } from '@/lib/sequelize';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Simulação: usuário autenticado é o primeiro usuário do banco
  const userId = 1;

  if (req.method === 'GET') {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      return res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching profile:", error);
      return res.status(500).json({ error: 'Erro ao buscar perfil.' });
    }
  }

  if (req.method === 'POST') {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    try {
      await fs.mkdir(uploadDir, { recursive: true });

      const form = formidable({});
      const [fields, files] = await form.parse(req);

      const name = (Array.isArray(fields.name) ? fields.name[0] : fields.name) || '';
      const email = (Array.isArray(fields.email) ? fields.email[0] : fields.email) || '';
      
      const currentUser = await User.findByPk(userId);
      let avatarUrl: string | undefined = currentUser?.avatarUrl || undefined;

      const avatarFile = Array.isArray(files.avatar) ? files.avatar[0] : files.avatar;

      if (avatarFile && avatarFile.size > 0) {
        const safeOriginalFilename = avatarFile.originalFilename?.replace(/[^a-zA-Z0-9._-]/g, '_') || 'avatar.png';
        const newFileName = `${userId}_${Date.now()}_${safeOriginalFilename}`;
        const newPath = path.join(uploadDir, newFileName);
        
        await fs.rename(avatarFile.filepath, newPath);
        avatarUrl = `/uploads/${newFileName}`;
      }

      const updatedUser = await User.update({
        name,
        email,
        avatarUrl
      }, {
        where: { id: userId }
      });

      return res.status(200).json(updatedUser);

    } catch (error: any) {
      console.error("Error processing profile update:", error);
      return res.status(500).json({ error: 'Erro ao processar a atualização do perfil.', details: error.message });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

export default handler;
