# Route pour Stripe

> Enregistrer dans Supabase l'identifiant Stripe du client lorsqu'il effectue un paiement.


## Qu'est-ce que c'est ?

Ceci est un endpoint API. C'est [une fonctionnalité de Next.js](https://nextjs.org/docs/app/building-your-application/routing/route-handlers).
Lorsqu'une requête est faite à `/api/stripe`, le code dans ce fichier est exécuté.



## À quoi ça sert ?

L'API est faite pour recevoir les évènements émis par le webhook de Stripe.
Par exemple, Stripe envoit un évènement lorsqu'un paiement est effectué.
En configurant Stripe pour émettre des évènements webhook vers `/api/stripe`, on peut réagir à ces évènements.
En l'occurence ici, lorsqu'un paiement est effectué, on enregistre dans supabase l'identifiant Stripe (`customer_id`) du client. On sait de quel utilisateur il s'agit puisque nous avons passé à Stripe l'identifiant Supabase de l'utilisateur lors de la création de la session de paiement (voir [la page de paiement](../../[locale]/subscribe/page.tsx)).



## Comment tester en local ?

De base, Stripe ne peut pas envoyer d'évènements webhook à une application en local, même si on est en `test mode`.
Il nous faut donc manuellement simuler ces évènements, grâce à [Stripe CLI](https://stripe.com/docs/stripe-cli).

Toutefois, l'extension [Stripe for VSCode](https://marketplace.visualstudio.com/items?itemName=Stripe.vscode-stripe) permet de forwarder les évènements webhook de Stripe vers une application en local.
