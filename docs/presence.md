# Présence

On appelle *présence* la fonctionnalité permettant de voir quels utilisateurs sont connectés en même temps à un espace de collaboration.
La présence est gérée dans le hook [useBroadcastStore](../hooks/useBroadcastStore.tsx).

## Fonctionnement

Pour le moment, la présence s'appuie sur les fonctionnalités de tldraw et du hook (rien dans la base de données).
Les étudiants renseignent leur nom et prénom, et ces infos sont stockées dans le `LocalStorage` du navigateur via la fonctionalité `setUserPreference` de tldraw.