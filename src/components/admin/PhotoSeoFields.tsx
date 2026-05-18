import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import KeywordsInput from "./KeywordsInput";

type Props = {
  altText: string;
  keywords: string[];
  caption?: string;
  description?: string;
  showCaption?: boolean;
  showDescription?: boolean;
  suggestions?: string[];
  onAltChange: (v: string) => void;
  onAltBlur?: (v: string) => void;
  onKeywordsChange: (v: string[]) => void;
  onKeywordsCommit?: (v: string[]) => void;
  onCaptionChange?: (v: string) => void;
  onCaptionBlur?: (v: string) => void;
  onDescriptionChange?: (v: string) => void;
  onDescriptionBlur?: (v: string) => void;
};

const DESC_MAX = 500;
const DESC_IDEAL_MIN = 100;
const DESC_IDEAL_MAX = 300;

const PhotoSeoFields = ({
  altText,
  keywords,
  caption = "",
  description = "",
  showCaption = true,
  showDescription = true,
  suggestions,
  onAltChange,
  onAltBlur,
  onKeywordsChange,
  onKeywordsCommit,
  onCaptionChange,
  onCaptionBlur,
  onDescriptionChange,
  onDescriptionBlur,
}: Props) => {
  const altMissing = !altText.trim();
  const descLen = description.length;
  const descColor =
    descLen === 0
      ? "text-muted-foreground"
      : descLen > DESC_MAX
        ? "text-destructive"
        : descLen >= DESC_IDEAL_MIN && descLen <= DESC_IDEAL_MAX
          ? "text-emerald-600"
          : "text-amber-600";

  return (
    <div className="space-y-2 p-2.5 bg-muted/30">
      <div>
        <Label className="text-xs flex items-center gap-1">
          Texte alternatif (SEO) <span className="text-destructive">*</span>
        </Label>
        <Input
          value={altText}
          onChange={(e) => onAltChange(e.target.value)}
          onBlur={(e) => onAltBlur?.(e.target.value)}
          placeholder="Décrivez l'image en une phrase courte"
          className={`mt-1 text-sm ${altMissing ? "border-destructive/60" : ""}`}
        />
        <p className="text-[10px] text-muted-foreground mt-0.5">
          Important pour Google et l'accessibilité
        </p>
      </div>

      {showDescription && onDescriptionChange && (
        <div>
          <Label className="text-xs flex items-center gap-1">
            Description complète (SEO)
            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="À quoi sert ce champ ?"
                  >
                    <HelpCircle className="w-3 h-3" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs text-xs leading-relaxed">
                  La description complète aide Google à comprendre votre image et
                  peut apparaître dans les résultats de recherche Google Images. À
                  la différence du texte alternatif qui est court, la description
                  peut détailler le contexte et l'intérêt de l'image.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <Textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            onBlur={(e) => onDescriptionBlur?.(e.target.value)}
            placeholder="Décrivez l'image en détail : ce qu'elle montre, le contexte, l'intérêt pour le visiteur"
            rows={3}
            maxLength={DESC_MAX + 100}
            className="mt-1 text-sm resize-y min-h-[72px]"
          />
          <div className="flex items-center justify-between mt-0.5">
            <p className="text-[10px] text-muted-foreground">
              Optionnel — idéal entre {DESC_IDEAL_MIN} et {DESC_IDEAL_MAX} caractères
            </p>
            <p className={`text-[10px] font-mono ${descColor}`}>
              {descLen}/{DESC_MAX}
            </p>
          </div>
        </div>
      )}

      <div>
        <Label className="text-xs">Mots-clés</Label>
        <KeywordsInput
          value={keywords}
          onChange={onKeywordsChange}
          onCommit={onKeywordsCommit}
          suggestions={suggestions}
          className="mt-1"
        />
      </div>

      {showCaption && onCaptionChange && (
        <div>
          <Label className="text-xs">Légende affichée (optionnel)</Label>
          <Input
            value={caption}
            onChange={(e) => onCaptionChange(e.target.value)}
            onBlur={(e) => onCaptionBlur?.(e.target.value)}
            placeholder="Sous l'image"
            className="mt-1 text-sm"
          />
        </div>
      )}
    </div>
  );
};

export default PhotoSeoFields;
