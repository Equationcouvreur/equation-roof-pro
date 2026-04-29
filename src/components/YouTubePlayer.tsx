import { useState } from "react";
import { Play } from "lucide-react";
import { extractYouTubeId, youTubeEmbedUrl, youTubeThumbnail } from "@/lib/youtube";

interface YouTubePlayerProps {
  url: string | null | undefined;
  className?: string;
  title?: string;
}

/**
 * Lazy-loaded YouTube player. Shows a clickable thumbnail with a play overlay,
 * then swaps in the embed iframe (with autoplay) on click.
 * Renders nothing if the URL is missing or invalid.
 */
const YouTubePlayer = ({ url, className = "", title = "Vidéo YouTube" }: YouTubePlayerProps) => {
  const [active, setActive] = useState(false);
  const id = extractYouTubeId(url);
  if (!id) return null;

  const thumb = youTubeThumbnail(url)!;
  const embed = youTubeEmbedUrl(url, true)!;

  return (
    <div
      className={`relative w-full max-w-[800px] mx-auto aspect-video rounded-xl overflow-hidden shadow-md bg-black ${className}`}
      style={{ borderRadius: 12 }}
    >
      {active ? (
        <iframe
          src={embed}
          title={title}
          className="absolute inset-0 w-full h-full"
          frameBorder={0}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          className="group absolute inset-0 w-full h-full"
          aria-label="Lire la vidéo"
        >
          <img
            src={thumb}
            alt={title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex items-center justify-center w-16 h-16 rounded-full bg-red-600 group-hover:bg-red-700 transition-transform group-hover:scale-110 shadow-lg">
              <Play className="w-7 h-7 text-white fill-white ml-1" />
            </span>
          </span>
        </button>
      )}
    </div>
  );
};

export default YouTubePlayer;
