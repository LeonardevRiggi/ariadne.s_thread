// app/(marketing)/layout.tsx

// Questo layout avvolge tutte le pagine pubbliche/marketing.
// Eredita dal layout principale (app/layout.tsx) e assicura
// che nessun codice dinamico della dashboard possa "contaminare"
// le pagine statiche.

export default function MarketingLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return <>{children}</>;
  }