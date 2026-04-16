import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 left-6 z-50 bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-bordeaux-dark transition-colors"
      aria-label="Retour en haut"
    >
      <ArrowUp className="w-4 h-4" />
    </button>
  );
};

export default BackToTop;
