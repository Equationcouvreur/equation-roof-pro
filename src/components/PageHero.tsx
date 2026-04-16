import { ReactNode } from "react";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

const PageHero = ({ title, subtitle, children }: PageHeroProps) => (
  <section className="bg-noir pt-32 pb-16 md:pt-40 md:pb-20">
    <div className="container-main">
      <h1 className="text-primary-foreground font-heading">{title}</h1>
      {subtitle && <p className="text-primary-foreground/70 mt-3 text-lg font-body max-w-2xl">{subtitle}</p>}
      {children}
    </div>
  </section>
);

export default PageHero;
