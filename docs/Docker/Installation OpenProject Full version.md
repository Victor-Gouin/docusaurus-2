# Installation OpenProject Full version

# Mise à jour.

## Release note

- Il peut être intéressant de lire la release note d’OpenProject ([https://www.openproject.org/docs/release-notes/](https://www.openproject.org/docs/release-notes/)) pour connaître les changements depuis la dernière version installée et éviter les problématiques d’incompatibilités ou de régression.

## Snapshot

- La première étape de la mise à jour consiste à demander à l’équipe Sysprod de faire un “snapshot” de la machine virtuelle hébergeant OpenProject par sécurité au cas où la mise à jour provoque une régression ou autre.

On pourra faire la mise à jour tôt le matin pour bénéficier du snapshot automatique de la nuit

## Mise à jour

### Arrêt du service

- OpenProject se compose de plusieurs briques de services fonctionnant sous forme de conteneurs. On va donc arrêter ceux-ci dans un premier temps.
- Se rendre sur le serveur OpenProject dans le répertoire où est déposé le fichier “**docker-compose.yml**” (ex: /var/www/html/openproject/compose) et arrêter le service avec la commande :

```bash
docker-compose down
```

```bash
`Exemple : root@xopenproject1:/var/www/html/openproject/compose# docker-compose down
Stopping compose_proxy_1 … done
Stopping compose_worker_1 … done
Stopping compose_cron_1 … done
Stopping compose_web_1 … done
Stopping compose_cache_1 … done
Stopping compose_autoheal_1 … done
Stopping compose_db_1 … done
Removing compose_proxy_1 … done
Removing compose_worker_1 … done
Removing compose_cron_1 … done
Removing compose_web_1 … done
Removing compose_seeder_1 … done
Removing compose_cache_1 … done
Removing compose_autoheal_1 … done
Removing compose_db_1 … done
Removing network compose_backend
Removing network compose_default
Removing network compose_frontend
```

### Mise à jour des fichiers

### Sauvegarde des fichiers

- Afin de conserver les fichiers de configurations qui ont été modifiés on fait une archive du répertoire du projet “openproject” dans son répertoire d’installation. On renomme ensuite l’ancien répertoire pour éviter les conflits aux prochaines étapes.

```bash
Exemple : root@xopenproject1:/var/www/html# tar -cvzf openproject_12.5.7.tgz openproject/ openproject/ 
openproject/README.md openproject/compose/ openproject/compose/Dockerfile.old
```

### Téléchargement

- Pour des raisons de suivi dans le temps on s’assure de bien récupérer les dernières version des fichiers du projet (voir [https://github.com/opf/openproject-deploy/](https://github.com/opf/openproject-deploy/)) en se plaçant avant dans le répertoire où a été installé OpenProject :

```bash
git clone https://github.com/opf/openproject-deploy --depth=1 --branch=stable/<VERSION> openproject

```

- On s’assure d’utiliser les dernières versions des images Docker depuis le répertoire compose du projet (ex: /var/www/html/openproject/compose) :

```bash
docker-compose pull
```

### Modifications

### .env.example

- On remplace le contenu du fichier .env.example, puis on le renommera en .env :

OPENPROJECT_HOST_NAME=“domaine_name.fr”

### docker-compose.yml

- Pour assurer la prise en compte des modifications faites sur le comportement du service on remplace la valeur du paramètre “x-op-image: &image” du fichier docker-compose.yml comme suit:

```yaml
x-op-image: &image
  build:
    context: .
    dockerfile: Dockerfile

```

### Dockerfiles

- Il faut rajouter les proxies si necessaire au début du fichier pour que les dépendances puissent être téléchargées correctement dans le fichier “**openproject/compose/control/Dockerfile**” :

```bash
root@xopenproject1:/var/www/html/openproject/compose# cat control/Dockerfile
FROM debian:10

ENV http_proxy http://proxy:port

ENV https_proxy http://proxy:port

…
```

- Le fichier “**openproject/compose/Dockerfile**” doit être créé :

```bash
FROM openproject/openproject:${TAG:-14-slim}
COPY ./enterprise_token.rb app/models/enterprise_token.rb
```

- Les fonctionnalités supplémentaires sont débloquée par un fichier de configuration particulier qu’il faut mettre lui aussi à jour à partir de [enterprise_token.rb](https://gist.github.com/CC1119/da05e02ba5b885b40db66beb191dd456) dans **/openproject/compose**

Attention ce fichier n’est pas officiel et utilisable uniquement en raison du fait qu’OpenProject soit sous licence GNU GPLv3

### Build

- On va ensuite build la nouvelle version de l’application avec la commande :

```
docker-compose -f docker-compose.yml -f docker-compose.control.yml build
```

- L’ensemble des images doit être téléchargé sur le serveur.

### Redémarrage

- On redémarre enfin l’application via la commande :

```
docker-compose up -d
```

```bash
Exemple: root@xopenproject1:/var/www/html/openproject/compose# docker-compose up -d

Pulling seeder (openproject/community:13)… 13:
Pulling from openproject/community
Digest: sha256:4d0e78034ecfb4c3be5c532da1204143df3dcf555ab0b89b17df759d4ae80656
Status: Downloaded newer image for openproject/community:13
Creating compose_db_1 … done
Creating compose_seeder_1 … done
Creating compose_autoheal_1 … done
Creating compose_cache_1 … done
Creating compose_cron_1 … done
Creating compose_web_1 … done
Creating compose_worker_1 … done
Creating compose_proxy_1 … done
```

### Pour visualiser les logs en direct :

```bash
docker-compose logs –tail=“all” -f
```

## Vérification

- Simplement attendre quelques minutes et vérifier que l’ensemble des conteneurs indiquent bien le statut “**Up**” et éventuellement “**healthy**” avec la commande “**docker ps**”
- Après cela, valider l’accès à l’interface web

## Post-opération

### Nettoyage

- Supprimer les images (garder celles de la version précédente) et conteneurs docker en excédent.
- Supprimer le répertoire contenant l’ancienne version.
- Supprimer l’archive contenant l’avant-dernière version.

### Snapshot

- Si un snapshot manuel a été fait, il faudra demander à l’équipe Sysprod de le supprimer au bout de quelques temps pour éviter la consommation inutile d’espace disque sur le stockage.