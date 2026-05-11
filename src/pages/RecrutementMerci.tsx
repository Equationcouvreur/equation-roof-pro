import { Link } from "react-router-dom";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import SEO from "@/components/SEO";

const RecrutementMerci = () => {
  return (
    <>
      <SEO
        title="Candidature reçue — EQUATION"
        description="Merci pour votre candidature chez EQUATION."
        path="/recrutement/merci"
      />
      <section className="container-main section-padding pt-32 min-h-[60vh] flex items-center">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <CheckCircle2 className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-foreground mb-4">Merci pour votre candidature !</h1>
          <p className="text-lg font-body text-muted-foreground leading-relaxed mb-8">
            Nous avons bien reçu votre dossier et reviendrons vers vous sous 7 jours ouvrés.
            À très bientôt chez EQUATION.
          </p>
          <Link to="/" className="btn-bordeaux inline-flex items-center gap-2 px-6 py-3 rounded-lg">
            <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
          </Link>
        </div>
      </section>
    </>
  );
};

export default RecrutementMerci;
