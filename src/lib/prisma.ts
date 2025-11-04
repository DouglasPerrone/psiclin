// Removido: import { prisma } from '@/lib/prisma';

// Adiciona o prisma ao escopo global do NodeJS para evitar múltiplas instâncias em desenvolvimento.
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    // log: ['query'], // Descomente para logar as queries do Prisma no console
  });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
