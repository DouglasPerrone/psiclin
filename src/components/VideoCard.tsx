import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlayCircle } from 'lucide-react';

export interface VideoData {
  id: string;
  title: string;
  youtubeId: string;
  description?: string;
  thumbnailUrl: string;
  dataAiHint?: string;
}

interface VideoCardProps {
  video: VideoData;
  onVideoSelect: (youtubeId: string) => void;
}

export function VideoCard({ video, onVideoSelect }: VideoCardProps) {
  return (
    <Card 
      className="overflow-hidden border border-border shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer h-full flex flex-col max-w-[390px] bg-card"
      onClick={() => onVideoSelect(video.youtubeId)}
      onKeyDown={(e) => e.key === 'Enter' && onVideoSelect(video.youtubeId)}
      tabIndex={0}
      aria-label={`Assistir vídeo: ${video.title}`}
    >
      <div className="relative aspect-video min-h-[170px] max-h-[240px]">
        <Image
          src={video.thumbnailUrl}
          alt={video.title}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 group-hover:scale-105 rounded"
          data-ai-hint={video.dataAiHint || "video content"}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <PlayCircle className="h-14 w-14 text-foreground/80" />
        </div>
      </div>
      <CardHeader className="flex-grow">
        <CardTitle className="font-headline text-lg md:text-xl line-clamp-2">{video.title}</CardTitle>
      </CardHeader>
      {video.description && (
        <CardContent className="flex-grow">
          <CardDescription className="text-base line-clamp-3">{video.description}</CardDescription>
        </CardContent>
      )}
    </Card>
  );
}
