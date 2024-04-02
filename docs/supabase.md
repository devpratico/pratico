# Développer en local avec Supabase

## Introduction

En développement, l'application ne se connecte jamais à la base de données de production. Les clés d'API de production ne sont jamais utilisées en local. Ainsi, pour tester son code, on lance une instance Supabase en local sur sa machine. On utilise pour cela [l'outil CLI](https://github.com/supabase/cli) de Supabase.
Les variables d'environnement de Supabase sont consultables sur le Dashboard du projet, dans l'onglet "Settings" > "API".
Elles sont automatiquement ajoutée à l'environnement de production Vercel via une intégration automatique (plugin Supabase sur Vercel).

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

L'environnement de développement Supabase se lance automatiquement lors du lancement du server de développement avec `pnpm dev`.

Pour le lancer manuellement, lancer Docker Desktop, puis exécuter la commande suivante :
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


## Authentification

Pour tester la création de compte, il suffit de s'inscrire en renseignant n'importe quel email factice et un mot de passe. L'environnement Supabase en local est configuré pour ne pas envoyer de mail de confirmation. L'authentification se fait donc immédiatement sans vérification de l'adresse mail.

Si une fonctionnalité d'envoi de mail est activée manuellement (ce n'est pas le cas pour l'instant), l'environnement local Supabase est configuré pour envoyer les mails sur le serveur SMTP de développement. On peut donc utiliser une adresse email factice. L'outil `Inbucket` est utilisé pour visualiser les mails envoyés. L'adresse url de'`Inbucket` est affichée dans la console lors du lancement de l'environnement de développement.


# Utilisations

