# Création autorité de certification WServer 2019 et demande signature Nginx OpenSSL

# Présentation de l'autorité de certification

Une autorité de certification (CA) est une entité qui émet des certificats numériques. Ces certificats sont utilisés pour établir une chaîne de confiance, permettant à des entités (comme des sites Web, des utilisateurs ou des programmes informatiques) de prouver leur identité les uns aux autres.

# Procédure de création d'une autorité de certification sur Windows Server 2019

1. Ouvrez le Gestionnaire de serveur sur votre Windows Server 2019.
2. Dans le menu du Gestionnaire de serveur, sélectionnez "Ajouter des rôles et des fonctionnalités".
3. Dans l'assistant qui s'ouvre, sélectionnez "Installation de rôles ou de fonctionnalités basée sur une fonction", puis cliquez sur "Suivant".
4. Assurez-vous que votre serveur est sélectionné et cliquez sur "Suivant".
5. Dans la liste des rôles de serveur, sélectionnez "Services de certificats Active Directory", cochez les 4 cases comme ci-dessous puis cliquez sur "Suivant".

![Untitled](Documentation%20cre%CC%81ation%20autorite%CC%81%20de%20certification%20b6c6bcec0b004b8e832f98cfed1fcaf4/Untitled.png)

1. Dans l'écran des fonctionnalités, cliquez simplement sur "Suivant".
2. Dans l'écran des rôles des services de certificats Active Directory, cliquez sur "Suivant".
3. Maintenant, vous devez choisir le type de CA à installer. Pour une nouvelle installation, vous choisirez probablement une "autorité de certification racine d'entreprise" ou une "autorité de certification racine autonome". Sélectionnez celui qui convient à vos besoins, puis cliquez sur "Suivant".
4. Vous devez maintenant configurer la clé privée de votre CA. À moins que vous n'importiez une clé existante, vous choisirez "Créer une nouvelle clé privée". Cliquez ensuite sur "Suivant".
5. L'écran suivant vous permet de configurer votre CA. Donnez un nom à votre CA, choisissez une durée pour la clé de la CA (la durée par défaut est de 5 ans) et cliquez sur "Suivant".
6. Enfin, vérifiez vos paramètres et cliquez sur "Installer" pour créer l'autorité de certification.

## Demande de signature

Pour générer une demande de signature de certificat (CSR) avec OpenSSL en utilisant le script donné, suivez les étapes suivantes:

1. Enregistrez le script dans un fichier, par exemple `config`.

```bash
[req]
default_bits= 2048
prompt = no
default_md= sha256
req_extensions= req_ext
distinguished_name= dn
[ dn]
C=FR
L=Angers
O=End Point
CN = guacamole.infra.dom
[ req_ext]
subjectAltName= @alt_names
[ alt_names]
DNS.1 = *.infra.dom

```

1. Ouvrez un terminal ou une invite de commande.
2. Exécutez la commande suivante :

```bash
sudo openssl genrsa -out cert.key 2048
sudo openssl req -new -key cert.key -out cert.pem -config config
```

Cette commande crée une nouvelle demande de signature de certificat (CSR) et une nouvelle clé privée. Le `-new` signifie que nous créons une nouvelle demande PEM, `-out cert.pem` spécifie le nom du fichier de sortie pour la demande CSR, `-new -key rsa:2048` crée une nouvelle clé RSA de 2048 bits,  `-out cert.key` spécifie le nom du fichier de sortie pour la nouvelle clé privée et `-config config` spécifie le fichier de configuration à utiliser (le script).

1. Une fois cette commande exécutée, vous devriez avoir deux nouveaux fichiers : `cert.pem` et `cert.key`. Le fichier PEM est la demande de signature de certificat que vous soumettrez à votre autorité de certification (CA) pour obtenir un certificat signé.

# Signature du certificat via une interface web

1. Ouvrez votre navigateur préféré et accédez à l'adresse de l'interface web de votre autorité de certification. Par exemple, si votre serveur s'appelle "monserveur", l'adresse serait "[http://monserveur/certsrv](http://monserveur/certsrv)".
2. Sur la page d'accueil de l'interface web de l'autorité de certification, cliquez sur "Demander un certificat".
3. Sur la page suivante, cliquez sur "demande de certificat avancée".
4. Ensuite, choisissez "Soumettre une demande en utilisant un fichier de demande de certificat", puis cliquez sur "Suivant".
5. Utilisez le bouton "Parcourir" pour sélectionner votre fichier de demande de signature de certificat (CSR) et cliquez sur "Suivant".

![Untitled](Documentation%20cre%CC%81ation%20autorite%CC%81%20de%20certification%20b6c6bcec0b004b8e832f98cfed1fcaf4/Untitled%201.png)

1. Choisissez le type de certificat à émettre, généralement "Web Server", puis cliquez sur "Soumettre".
2. Une fois la demande approuvée, vous devriez voir un lien pour télécharger le certificat signé. Cliquez sur "Télécharger le certificat" pour le sauvegarder sur votre ordinateur.

# Installation de Nginx :

Voici comment installer Nginx sur Ubuntu Server :

1. Mettre à jour les packages disponibles avec la commande :

```bash
sudo apt-get update

```

1. Installer Nginx avec la commande :

```bash
sudo apt-get install nginx

```

1. Une fois l'installation terminée, vous pouvez vérifier que Nginx est bien installé et fonctionne correctement en tapant l'adresse IP de votre serveur Ubuntu dans votre navigateur. Vous devriez voir la page par défaut de Nginx.
2. Pour que Nginx démarre automatiquement au démarrage, utilisez la commande suivante :

```bash
sudo systemctl enable nginx

```

1. Pour vérifier que Nginx fonctionne correctement, vous pouvez utiliser cette commande :

```bash
sudo systemctl status nginx

```

Si Nginx a été installé et démarré correctement, le statut devrait indiquer "active (running)".

# Importer le certificat signé dans Nginx

Exemples de configuration : 

```bash
server {
    listen 80;
    return 301 https://$host$request_uri;
}
server {
    listen 443 ssl;

    #root /var/www/html;

    index index.html index.htm index.nginx-debian.html;

    ssl_certificate /etc/ssl/certs/cert.cer;
    ssl_certificate_key /etc/ssl/private/cert.key;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    #ssl_dhparam /etc/nginx/dhparam.pem;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384;
    ssl_ecdh_curve secp384r1;
    ssl_session_timeout  10m;
    ssl_session_cache shared:SSL:10m;
    resolver 192.168.42.129 8.8.8.8 valid=300s;
    resolver_timeout 5s;
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";

    access_log  /var/log/nginx/guac_access.log;
    error_log  /var/log/nginx/guac_error.log;

    location / {
        proxy_pass <http://zabbix.infra.dom:8080>;
        proxy_buffering off;
        proxy_http_version 1.1;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $http_connection;
        proxy_cookie_path /guacamole/ /;
    }
}

```

1. `server {` : C'est le début d'un bloc serveur. Chaque bloc serveur spécifie la configuration pour un serveur virtuel.
2. `listen 80;` : Le serveur écoute les connexions sur le port 80, qui est le port standard pour le protocole HTTP.
3. `return 301 https://$host$request_uri;` : Toutes les requêtes arrivant sur le port 80 sont automatiquement redirigées vers le protocole HTTPS (port 443) en utilisant une redirection permanente (301).
4. `}` : Fin du bloc serveur.
5. `server {` : Début d'un nouveau bloc serveur. Cette fois, il s'agit de la configuration pour les connexions HTTPS.
6. `listen 443 ssl;` : Le serveur écoute les connexions sur le port 443, qui est le port standard pour le protocole HTTPS.
7. `ssl_certificate /etc/ssl/certs/cert.cer;` et `ssl_certificate_key /etc/ssl/private/cert.key;` : Ces lignes indiquent où se trouvent le certificat SSL et la clé privée à utiliser pour les connexions HTTPS.
8. `ssl_protocols TLSv1.2 TLSv1.3;` : Les protocoles SSL/TLS à utiliser sont spécifiés ici.
9. `ssl_prefer_server_ciphers on;` et `ssl_ciphers ...;` : Ces lignes déterminent les algorithmes de chiffrement à utiliser pour les connexions SSL/TLS.
10. `ssl_ecdh_curve secp384r1;`, `ssl_session_timeout 10m;` et `ssl_session_cache shared:SSL:10m;` : Ces lignes configurent d'autres aspects de la session SSL.
11. `resolver 192.168.42.129 8.8.8.8 valid=300s;` et `resolver_timeout 5s;` : Ces lignes configurent le DNS resolver pour le serveur Nginx.
12. `add_header ...;` : Ces lignes ajoutent divers en-têtes de sécurité HTTP à toutes les réponses du serveur.
13. `access_log /var/log/nginx/guac_access.log;` et `error_log /var/log/nginx/guac_error.log;` : Ces lignes indiquent où le serveur doit enregistrer les journaux d'accès et d'erreur.
14. `location / { ... }` : Ce bloc spécifie comment le serveur doit répondre aux requêtes pour différentes URLs. Dans ce cas, toutes les requêtes sont passées à un autre serveur (`proxy_pass`), avec divers paramètres de proxy spécifiés (zabbix).
15. `}` : Fin du bloc serveur.

Cette configuration est donc destinée à un serveur Nginx qui redirige tout le trafic HTTP vers HTTPS et transfère toutes les requêtes à un autre serveur spécifié (zabbix).

## Vérification du bon fonctionnement du certificat :

![Untitled](Documentation%20cre%CC%81ation%20autorite%CC%81%20de%20certification%20b6c6bcec0b004b8e832f98cfed1fcaf4/Untitled%202.png)

On peut voir que le certificat a été émis pour zabbix.infra.dom par l’autorité infra-WIN.