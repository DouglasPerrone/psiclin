"use client";

import { useState } from 'react';
import { VideoCard, type VideoData } from '@/components/VideoCard';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface VideosGridProps {
  videos: VideoData[];
}

export default function VideosGrid({ videos }: VideosGridProps) {
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  // Basic function to extract video ID from various YouTube URL formats
  const getYouTubeEmbedId = (youtubeIdOrUrl: string) => {
    if (youtubeIdOrUrl.includes('watch?v=')) {
      return youtubeIdOrUrl.split('watch?v=')[1].split('&')[0];
    }
    if (youtubeIdOrUrl.includes('youtu.be/')) {
      return youtubeIdOrUrl.split('youtu.be/')[1].split('?')[0];
    }
    return youtubeIdOrUrl; // Assume it's already an ID
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} onVideoSelect={() => setSelectedVideoId(video.youtubeId)} />
        ))}
      </div>
      {selectedVideoId && (
        <Dialog open={!!selectedVideoId} onOpenChange={() => setSelectedVideoId(null)}>
          <DialogContent className="max-w-3xl p-0 border-0">
            <AspectRatio ratio={16 / 9}>
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${getYouTubeEmbedId(selectedVideoId)}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="rounded-lg"
              ></iframe>
            </AspectRatio>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
