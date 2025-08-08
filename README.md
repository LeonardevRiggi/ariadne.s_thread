This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Folder Structure 

/app
  /(marketing)      // Pagine pubbliche come la landing page
    /page.tsx
  /(auth)           // Pagine per il login, signup, ecc.
    /login/page.tsx
    /auth/callback/route.ts // Gestisce il redirect da Supabase
  /(dashboard)      // L'applicazione vera e propria, protetta
    /layout.tsx       // Layout principale che verifica l'autenticazione
    /therapist/       // Route e componenti solo per il terapeuta
      /dashboard/page.tsx // Vista con la lista dei pazienti
      /patient/[patientId]/page.tsx // Dettaglio del singolo paziente
    /patient/         // Route e componenti solo per il paziente
      /journal/page.tsx
      /tasks/page.tsx
    /account/page.tsx   // Pagina per la gestione del profilo (comune)
  /invite/page.tsx  // Pagina pubblica dove il paziente completa il profilo
/lib
  /supabase/client.ts // Crea il client Supabase per il browser
  /supabase/server.ts // Crea il client Supabase per il server
/components
  /ui/              // Componenti UI riutilizzabili (es. Button, Card con shadcn/ui)