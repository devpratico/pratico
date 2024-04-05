# Présence

On appelle *présence* la fonctionnalité permettant de voir quels utilisateurs sont connectés en même temps à un espace de collaboration.
La présence est gérée dans le hook [useBroadcastStore](../hooks/useBroadcastStore.tsx).

## Fonctionnement

Pour le moment, la présence s'appuie sur les fonctionnalités de tldraw et du hook (rien dans la base de données).
Les étudiants renseignent leur nom et prénom, et ces infos sont stockées dans le `LocalStorage` du navigateur via la fonctionalité `setUserPreference` de tldraw.


1. Lorsqu'un utilisateur se rend sur la page d'une room, le composant `CanvasST` vérifie si son nom est déjà enregistré dans les 'user preferences' de tldraw, qui sont en fait stockées dans le `LocalStorage` du navigateur. Pour cela, il utilise la fonction `getUserPreference` de tldraw.
2. Si aucun nom n'est trouvé, `CanvasST` effectue une redirection vers la page `student-form`.
3. La page `student-form` permet à l'utilisateur de renseigner son nom et prénom. Ces informations sont stockées dans le `LocalStorage` du navigateur via la fonctionalité `setUserPreference` de tldraw (c'est pourquoi la page est `use client`, `setUserPreference` ne fonctionne que côté client).