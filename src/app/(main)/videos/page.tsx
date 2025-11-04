import { type VideoData } from '@/components/VideoCard';
import { prisma } from '@/lib/prisma';
import { extractYoutubeId, buildThumbnailUrlFromId } from '@/lib/youtube';
import VideosGrid from './VideosGrid';

export default async function VideosPage() {
  const videosFromDb = await prisma.video.findMany({ orderBy: { createdAt: 'desc' } });
  const videos: VideoData[] = videosFromDb.map((v) => {
    const id = extractYoutubeId(v.url) || '';
    return {
      id: v.id.toString(),
      title: v.title,
      youtubeId: id,
      thumbnailUrl: buildThumbnailUrlFromId(id),
      description: v.description || '',
    };
  });

  return (
    <div className="bg-background py-12 md:py-20">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12 md:mb-16">
          <h1 className="font-headline text-4xl font-bold text-foreground sm:text-5xl">Videoteca PsiCllin</h1>
          <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
            Explore nossa coleção de vídeos sobre saúde mental, bem-estar e desenvolvimento pessoal.
          </p>
        </header>

        <VideosGrid videos={videos} />
      </div>
    </div>
  );
}
