# Développer en local avec Supabase

## Introduction

En développement, l'application ne se connecte jamais à la base de données de production. Les clés d'API de production ne sont jamais utilisées en local. Ainsi, pour tester son code, on lance une instance Supabase en local sur sa machine. On utilise pour cela [l'outil CLI](https://github.com/supabase/cli) de Supabase.

Pas besoin d'installer l'outil CLI de façon globale sur sa machine. On peut appeler les commandes directement avec `pnpm`.

L'outil nécessite d'installer [Docker Desktop](https://docs.docker.com/desktop/) pour fonctionner.


## Se connecter

Créer un compte Supabase pour rejoindre l'équipe Pratico, ou bien utiliser le compte de l'équipe en s'authentifiant avec le compte GitHub *devpratico*.

Le mot de passe de la base de donnée est enregistrée dans *Bitwarden*.

Pour s'identifier avec l'outil CLI :
```bash
pnpm supabase login
```


## Lancer l'environnement de développement

Lancer Docker Desktop, puis exécuter la commande suivante :
```bash
pnpm supabase:start
```
Une interface graphique est disponible à [localhost:54323](http://localhost:54323).

Ensuite seulement, on pourra lancer le server front-end avec `pnpm dev`.

Pour arrêter l'environnement de développement :
```bash
pnpm supabase:stop
```
Pour arrêter sans conserver les modifications effectées sur les tables depuis le dashboard ('Studio') :
```bash
pnpm supabase stop --no-backup
```

Les données de la base de données sont, elles, conservées entre les redémarrages de l'environnement de développement. Pour les supprimer, il faut effectuer un reset `pnpm supabase db reset`.


## CI/CD

Le déploiement en production se fait automatiquement avec GitHub Actions. Là encore, c'est l'outil CLI de supabase qui est utilisé - cette fois-ci par le script GitHub. Il applique les modifications sur la base de données de production. Les secrets nécessaires sont enregistrés dans les paramètres du dépôt.