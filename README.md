# 👋 Bonjour

Pratico est une application web construite avec `TypeScript`, `React` et `Next.js`. Son backend utilise `Supabase`. Elle est déployée sur `Vercel`.

# Prérequis
- [pnpm](https://pnpm.io/fr/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Stripe CLI](https://stripe.com/docs/stripe-cli) (optionnel - si besoin de travailler sur Stripe)
- Variables d'environnement à renseigner dans un fichier `.env.local` à la racine du projet (voir `.env.example` pour connaître les variabled)

# 🚀 Pour commencer
1. `pnpm i`
2. `pnpm dev` lance automatiquement le container docker pour l'instance locale de supabase, ainsi que le server Next.js de dév.
