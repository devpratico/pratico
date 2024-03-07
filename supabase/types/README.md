# Les types

Le fichier [database.types.ts](./database.types.ts) contient les types typescript correspondant à la structure de la base de données. Il est généré par supabase via une commande CLI, appelée dans le script [supabase-db-reset.sh](../../scripts/supabase-db-reset.sh), lui-même appelé lors de la commande `pnpm supabase:reset', définie dans [package.json](../../package.json).

Le fichier ne doit pas être modifié à la main, car il sera écrasé lors de la prochaine génération.