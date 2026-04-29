import { Youtube, X, Play } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { extractYouTubeId, youTubeThumbnail } from "@/lib/youtube";

interface YouTubeUrlFieldProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

/**
 * Reusable YouTube URL input for admin editors.
 * Shows a thumbnail preview when a valid URL is entered, with a clear button.
 */
const YouTubeUrlField = ({
  value,
  onChange,
  label = "Vidéo YouTube (optionnel)",
}: YouTubeUrlFieldProps) => {
  const id = extractYouTubeId(value);
  const isInvalid = value.trim().length > 0 && !id;
  const thumb = youTubeThumbnail(value);

  return (
    <div>
      <Label>{label}</Label>
      <div className="relative mt-1">
        <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600 pointer-events-none" />
        <Input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Collez le lien YouTube ici (ex: https://www.youtube.com/watch?v=XXXXX)"
          className="pl-10 pr-10"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-muted text-muted-foreground"
            aria-label="Supprimer la vidéo"
            title="Supprimer la vidéo"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      {isInvalid && (
        <p className="text-xs text-destructive mt-1">Lien YouTube invalide</p>
      )}
      {thumb && (
        <div className="mt-3 relative w-full max-w-xs aspect-video rounded-lg overflow-hidden border bg-black">
          <img src={thumb} alt="Aperçu vidéo" className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <span className="flex items-center justify-center w-12 h-12 rounded-full bg-red-600 shadow-lg">
              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubeUrlField;
