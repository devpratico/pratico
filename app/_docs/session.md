# Fonctionnement d'une session



## Vocabulaire

### 📖 Session
Dans Pratico, une "session" désigne le moment (qui a un début et une fin) pendant lequel un formateur lance une capsule, invite des participants, fait défiler les slides, lance un quiz etc. L'objet "session" n'existe pas en tant que tel techniquement. Il n'est que l'ensemble des `events` (voir ci-dessous) qui ont lieu dans une `room` (voir ci-dessous). Pour récupérer les infos d'une session et les présenter à l'utilisateur - dans un rapport par exemple - on ira trier dans la table `room_events` les évènements qui ont eu lieu dans une `room` donnée.

### 🚩 Event
C'est un évènement qui a lieu dans une room. Exemple : un formateur lance une session, un participat se connecte, un participant se déconnecte, un quizz est lancé, un participant répond au quiz, la session est terminée, etc. Chaque évènement est enregistré dans la base de données. Les évènements qui ont lieu dans le cadre d'une session (donc pendant qu'une room est ouverte) sont enregistrés avec l'identifiant de la room, et l'id de l'utilisateur qui a lancé la room.

### 🏫 Room
C'est un objet ephémère (il sera supprimé à la fin de la session) représentant la "salle de classe". Elle contient l'état **actuel** de la session : le lien, la capsule en cours, la page à afficher, l'activité en cours, les scores, les participants, l'état du chat, le mode de navigation, les réglages de collaboration etc. c'est une "photographie" à l'instant *t* de la session - c'est son *state*. Les participants vont se connecter à cette room pour participer à la session.



## Déroulement


1. L'utilisateur ouvre une capsule et clique sur **Lancer**

2. Une nouvelle `room` est créée dans la base de données avec :
    - `id` : l'identifiant de la room
    - `created_at`: la date de création de la room
    - `created_by` : l'id de l'utilisateur qui a lancé la room
    - `name` : le nom de la room, qui sera utilisé pour générer le lien partageable. Il est généré à partir du titre de la capsule, en vérifiant qu'il est unique. L'utilisateur pourra le modifier s'il le souhaite.
    - `capsule_id`: l'id de la capsule actuellement affichée (on peut imaginer dans le futur que l'utilisateur puisse changer de capsule en cours de session)
    - `capsule_snapshot`: le snapshot tldraw de la capsule actuellement affichée
    - `quiz_id`: l'id du quizz actuellement affiché (s'il y en a un)
    - `quiz_scores`: les scores des participants au quizz
    - `params`: les paramètres de la session (mode de navigation, réglages de collaboration etc.)

3. Un chat est ajouté dans la table `chats` avec :
    - `id` : l'identifiant du chat
    - `created_at` : la date de création du chat
    - `room_id` : l'id de la room dans laquelle le chat est utilisé

4. Les visiteurs se connectent à la room en utilisant le lien partageable

5. Chaque action entraînera une modification de l'état de la room. Lorsqu'il s'agit d'une action importante, un évènement est enregistré dans la table `room_events` avec :
    - `id` : l'identifiant de l'évènement
    - `created_at` : la date de création de l'évènement
    - `room_id` : l'id de la room dans laquelle l'évènement a eu lieu
    - `user_id` : l'id de l'utilisateur qui a déclenché l'évènement
    - `type` : le type de l'évènement (lancement de la session, connexion d'un participant, déconnexion d'un participant, lancement d'un quizz, réponse à un quizz, fin de la session etc.)
    - `data` : les données associées à l'évènement (par exemple, le score d'un participant, le temps de réponse à un quizz, etc.)

6. Lorsque la session est terminée, la room est supprimée de la base de données, ainsi que le(s) chat(s) associé(s).


## Quiz

Comme les étudiants n'ont pas de compte, le `user_id` associé à l'évènement "quelqu'un a répondu à un quiz" sera associé à l'user_id du formateur. Les data de l'évènement contiendront les noms et prénoms de l'étudiant.