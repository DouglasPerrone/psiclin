import { BlogPost, Video as VideoModel } from '@/lib/sequelize';
import { extractYoutubeId, buildThumbnailUrlFromId } from '@/lib/youtube';

export async function getHomeData() {
  // Buscar os 2 últimos posts
  const postsDb = await BlogPost.findAll({ order: [['createdAt', 'DESC']], limit: 2 });
  const featuredPosts = postsDb.map((post: any) => ({
    id: post.id.toString(),
    title: post.title,
    slug: post.slug,
    summary: post.summary,
    coverImageUrl: post.coverImageUrl || 'https://placehold.co/600x400.png',
    dataAiHint: post.dataAiHint,
    category: post.category,
    createdAt: post.createdAt,
    content: post.content,
  }));
  // Buscar até 3 vídeos em destaque
  const videosDb = await VideoModel.findAll({ where: { featured: true }, order: [['createdAt', 'DESC']], limit: 3 });
  const featuredVideos = videosDb.map((v: any) => {
    const id = extractYoutubeId(v.url) || '';
    return {
      id: v.id.toString(),
      title: v.title,
      youtubeId: id,
      thumbnailUrl: buildThumbnailUrlFromId(id),
      dataAiHint: '',
      description: v.description || '',
    };
  });
  return { featuredPosts, featuredVideos };
}
