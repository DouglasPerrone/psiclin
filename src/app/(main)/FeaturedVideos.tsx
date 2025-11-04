"use client";
import { VideoCard, type VideoData } from "@/components/VideoCard";

export default function FeaturedVideos({ videos }: { videos: VideoData[] }) {
  if (!videos || videos.length === 0) return null;

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} onVideoSelect={() => {}} />
        ))}
      </div>
    </div>
  );
}
