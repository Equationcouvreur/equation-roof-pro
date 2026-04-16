import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => (
  <a
    href="tel:0473875350"
    className="fixed bottom-6 right-6 z-50 bg-green-whatsapp text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 group"
    aria-label="Contactez-nous"
    title="Contactez-nous"
  >
    <MessageCircle className="w-6 h-6" />
    <span className="absolute right-16 bg-foreground text-primary-foreground text-sm font-body py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
      Contactez-nous
    </span>
  </a>
);

export default WhatsAppButton;
