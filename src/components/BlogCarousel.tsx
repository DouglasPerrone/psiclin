"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { BlogCard } from '@/components/BlogCard';
import type { BlogPost } from '@/components/BlogCard';

interface BlogCarouselProps {
  posts: BlogPost[];
}

export function BlogCarousel({ posts }: BlogCarouselProps) {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      spaceBetween={32}
      slidesPerView={1}
      loop
      autoplay={{ delay: 3500, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      breakpoints={{
        768: { slidesPerView: 2 },
      }}
      className="w-full"
    >
      {posts.map((post) => (
        <SwiperSlide key={post.id} className="flex justify-center">
          <BlogCard post={post} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
