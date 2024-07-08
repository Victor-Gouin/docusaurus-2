# Installer FreshRSS

# Installation de FreshRSS sur Docker

Pour installer FreshRSS sur Docker, vous pouvez utiliser le fichier docker-compose suivant:

```yaml
version: "3"
services:
  freshrss:
    container_name: freshrss2
    image: thegeeklab/freshrss
    ports:
      - "49153:8080"
    volumes:
      - freshrss_data:/var/www/app/data
      - freshrss_extensions:/var/www/app/extensions
    environment:
      FRESHRSS_DEFAULT_USER: admin
      FRESHRSS_DEFAULT_PASSWORD: freshrss
      FRESHRSS_API_ENABLED: "true"
      FRESHRSS_SALT: "38fd29ac5878c270bbfc3599723cd479d48c6c58"
volumes:
  freshrss_data:
    driver: local
  freshrss_extensions:
    driver: local

```

Vous pouvez déployer ce service en exécutant la commande `docker-compose up -d` dans le même dossier que votre fichier docker-compose.

# 

# Ajouts de flux :

Pour ajouter des flux RSS dans FreshRSS, suivez ces étapes :

1. Connectez-vous à votre compte FreshRSS.
2. Cliquez sur le bouton "Subscription management" (Gestion des abonnements) ou l'icône qui ressemble à un engrenage située généralement dans le coin supérieur droit de l'écran.
3. Cliquez sur le bouton "+ Add" (+ Ajouter) ou une icône similaire pour ajouter un nouvel abonnement de flux.
4. Dans le champ "Feed URL" (URL du flux), saisissez l'URL du flux RSS que vous souhaitez ajouter.
5. Cliquez sur le bouton "Submit" (Soumettre) ou similaire pour ajouter le flux à votre compte FreshRSS.
6. Vous pouvez répéter ces étapes pour chaque flux RSS que vous souhaitez ajouter à votre compte FreshRSS.

![Untitled](Installer%20FreshRSS%202c33e81751b64c05bb1797d0d6e931be/Untitled.png)