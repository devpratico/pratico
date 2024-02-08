# Développer en local avec Supabase

## Introduction
On utilise [l'outil CLI](https://github.com/supabase/cli) de Supabase pour créer un environnement de test et développer en local, ainsi que pour déployer les changements sur l'environnement de production.

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

Pour arrêter l'environnement de développement :
```bash
pnpm supabase:stop
```
Pour arrêter sans conserver les données :
```bash
pnpm supabase stop --no-backup
```