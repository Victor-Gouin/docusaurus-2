# Installer Nginx Proxy Manager Docker

# Installation de Nginx Proxy Manager dans Docker pour la gestion des certificats SSL et des requêtes DNS

Nginx Proxy Manager est un outil puissant qui vous permet de gérer facilement les certificats SSL et les requêtes DNS pour vos conteneurs Docker, comme FreshRSS. Voici comment l'installer et le configurer dans Docker :

1. **Téléchargement de l'image Nginx Proxy Manager :** Vous pouvez télécharger l'image Nginx Proxy Manager à partir du Docker Hub en utilisant la commande suivante : `docker pull jc21/nginx-proxy-manager`.
2. **Configuration du Nginx Proxy Manager :** Une fois l'image téléchargée, vous pouvez configurer le Nginx Proxy Manager en utilisant un fichier docker-compose. Voici un exemple de configuration :

```yaml
version: "3"
services:
  app:
    image: 'jc21/nginx-proxy-manager:latest'
    ports:
      - '80:80'
      - '81:81'
      - '443:443'
    volumes:
      - ./config.json:/app/config/production.json
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt

```

1. **Démarrage du Nginx Proxy Manager :** Vous pouvez démarrer le Nginx Proxy Manager en exécutant la commande `docker-compose up` dans le même dossier que votre fichier docker-compose.
2. **Configuration des certificats SSL et des requêtes DNS :** Une fois le Nginx Proxy Manager démarré, vous pouvez accéder à l'interface utilisateur pour configurer vos certificats SSL et vos requêtes DNS. Par exemple, pour FreshRSS, vous pouvez ajouter une nouvelle entrée de proxy pour rediriger les requêtes DNS vers le conteneur FreshRSS et installer un certificat SSL pour sécuriser la connexion.