import { BlogCarousel } from '@/components/BlogCarousel';
import type { BlogPost } from '@/components/BlogCard';

export default function BlogCarouselWrapper({ posts }: { posts: BlogPost[] }) {
  return <BlogCarousel posts={posts} />;
}
