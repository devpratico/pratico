# Intrnationalisation

## Comportement souhaité

Le langage de la page correspond à la `locale` présente dans l’url. Exemple :

- pratico.co/fr → français
- pratico.co/en/dashboard → anglais

Si aucune locale n’est présente dans l’url, une redirection aura lieu afin d’en ajouter une. Elle est choisie grâce au cookie `NEXT_LOCALE` fourni par Next.js. Ce cookie :

- Se base sur les langages du navigateur (cookie `accept-languages` )
- Si l’utilisateur visite volontairement une url avec une locale différente, le cookie est mis à jour

> Exemple : si le language du navigateur du visiteur est le français, le visiteur sera redirigé vers *pratico.co/fr* s’il visite *pratico.co*. Si le visiteur change manuellement l'url pour *pratico.co/en*, Next.js considérera que le visiteur préfère visiter le site en anglais et le cookie sera mis à jour pour *en*. La prochaine fois que le visiteur visitera *pratico.co*, il sera redirigé vers *pratico.co/en*.


# Implémentation

On utilise la librairie `next-intl` en suivant ce [tutoriel](https://next-intl-docs.vercel.app/docs/getting-started/app-router).

* Le fichier de configuration [intl.config.ts](../../intl/intl.config.ts) défini les locales prises en charge.
* Le middleware [intlMiddleware.ts](../../middlewares/intlMiddleware.ts) gère la redirection.
* Le fichier [i18n.ts](../../intl/i18n.ts) charge les fichiers de traduction.
* Les fichiers de traduction sont dans le répertoire [messages](../../intl/messages).
* Le répertoire `[locale]` est ajouté après le répertoire `pages`. C'est ce qui permet d'ajouter la locale dans l'url. C'est une fonctionnalité de routing de Next.js.
* Dans le layout global [layout.tsx](../../app/[locale]/layout.tsx)
    * La locale de l'url est récupérée pour la passer au composant `<html>`
    * ~~On fournit un context provider pour permettre aux composants de type client components d'utiliser les traductions. (Les composants de type server components utilisent directement next-intl).~~~
* Les composants de type client components n'utilisent pas l'internationalisation afin d'améliorer les performances (ne pas charger les traductions inutilement). On leur passe les message par les props. [Voir tutoriel](https://next-intl-docs.vercel.app/docs/environments/server-client-components).


