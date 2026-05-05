import { useState, useEffect, useRef } from "react";
import { MessageCircle, Phone, Mail, Linkedin, X } from "lucide-react";

const WhatsAppButton = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const items = [
    {
      label: "WhatsApp",
      href: "https://wa.me/33473875350",
      icon: MessageCircle,
      bg: "bg-green-whatsapp",
      external: true,
    },
    {
      label: "04 73 87 53 50",
      href: "tel:0473875350",
      icon: Phone,
      bg: "bg-primary",
      external: false,
    },
    {
      label: "info@etanche.com",
      href: "mailto:info@etanche.com",
      icon: Mail,
      bg: "bg-noir",
      external: false,
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/thierry-meylan-39799111b/",
      icon: Linkedin,
      bg: "bg-[#0A66C2]",
      external: true,
    },
  ];

  return (
    <div ref={ref} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="flex flex-col items-end gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {items.map((it) => (
            <a
              key={it.label}
              href={it.href}
              target={it.external ? "_blank" : undefined}
              rel={it.external ? "noopener" : undefined}
              className="flex items-center gap-2 bg-card text-foreground border border-border pl-3 pr-2 py-1.5 rounded-full shadow-md hover:shadow-lg transition-all group"
            >
              <span className="text-sm font-subtitle font-medium whitespace-nowrap">
                {it.label}
              </span>
              <span
                className={`${it.bg} text-white w-9 h-9 rounded-full flex items-center justify-center shrink-0`}
              >
                <it.icon className="w-4 h-4" />
              </span>
            </a>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className="bg-green-whatsapp text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
        aria-label={open ? "Fermer le menu de contact" : "Ouvrir le menu de contact"}
        aria-expanded={open}
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
};

export default WhatsAppButton;
