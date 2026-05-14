import { useState, useRef, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { normalizeKeyword, foldKeyword, dedupeKeywords } from "@/lib/keywords";

type Props = {
  value: string[];
  onChange: (next: string[]) => void;
  onCommit?: (next: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
  className?: string;
};

const KeywordsInput = ({
  value,
  onChange,
  onCommit,
  suggestions = [],
  placeholder = "Ajouter un mot-clé puis Entrée",
  className,
}: Props) => {
  const [draft, setDraft] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const valueFolds = new Set(value.map(foldKeyword));

  const addAndCommit = (raw: string) => {
    const norm = normalizeKeyword(raw);
    if (!norm) return value;
    const fold = foldKeyword(norm);
    if (valueFolds.has(fold)) {
      setDraft("");
      return value;
    }
    const next = dedupeKeywords([...value, norm]);
    onChange(next);
    onCommit?.(next);
    setDraft("");
    return next;
  };

  const remove = (idx: number) => {
    const next = value.filter((_, i) => i !== idx);
    onChange(next);
    onCommit?.(next);
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addAndCommit(draft);
    } else if (e.key === "Backspace" && !draft && value.length) {
      remove(value.length - 1);
    }
  };

  const draftFold = foldKeyword(draft);
  const filteredSuggestions = suggestions
    .filter((s) => {
      if (!s) return false;
      const f = foldKeyword(s);
      if (valueFolds.has(f)) return false;
      if (!draftFold) return true;
      return f.includes(draftFold);
    })
    .sort((a, b) => a.localeCompare(b, "fr"));

  return (
    <div className={cn("relative", className)}>
      <div
        className="flex flex-wrap items-center gap-1.5 min-h-10 rounded-md border border-input bg-background px-2 py-1.5 text-sm focus-within:ring-2 focus-within:ring-ring"
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((kw, i) => (
          <span
            key={`${kw}-${i}`}
            className="inline-flex items-center gap-1 rounded-full bg-secondary text-secondary-foreground px-2 py-0.5 text-xs font-medium"
          >
            {kw}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                remove(i);
              }}
              className="hover:text-destructive"
              aria-label={`Retirer ${kw}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKey}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setTimeout(() => setFocused(false), 150);
            if (draft) {
              addAndCommit(draft);
            } else {
              onCommit?.(value);
            }
          }}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[8ch] bg-transparent outline-none text-sm"
        />
      </div>
      {focused && filteredSuggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1 z-20 bg-popover border rounded-md shadow-md max-h-64 overflow-y-auto">
          {filteredSuggestions.map((s) => (
            <button
              key={s}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                addAndCommit(s);
              }}
              className="block w-full text-left px-3 py-1.5 text-sm hover:bg-accent"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default KeywordsInput;
