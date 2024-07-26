# Documentation d’utilisation OpenSSL, ADCS, Nginx

## Guide utilisation OpenSSL

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

# Guide d'utilisation de l'interface web Certsrv sur Windows Server 2019

1. **Accédez à Certsrv** : Ouvrez un navigateur web et accédez à l'interface web de Certsrv en tapant `https://nom_du_serveur/certsrv` dans la barre d'adresse.
2. **Authentification** : Vous serez invité à entrer vos identifiants de connexion. Entrez le nom d'utilisateur et le mot de passe appropriés, puis cliquez sur "OK".
3. **Demande de certificat** : Cliquez sur "Demander un certificat". Vous aurez la possibilité de demander un certificat d'utilisateur ou un certificat d'ordinateur, selon vos besoins.
4. **Soumettre la demande** : Sélectionnez le type de certificat que vous souhaitez demander, remplissez les informations requises et cliquez sur "Soumettre".
5. **Installation du certificat** : Une fois que votre demande de certificat a été approuvée, vous pouvez installer le certificat en cliquant sur "Installer ce certificat".
6. **Gestion des certificats** : Vous pouvez gérer vos certificats installés en cliquant sur "Voir le statut des certificats" ou "Révoquer un certificat".

![Untitled](Documentation%20d%E2%80%99utilisation%20OpenSSL,%20ADCS,%20Nginx%20e6a5f9ff982640529e2c14d851293973/Untitled.png)

## Signature du certificat via CERTSRV

1. Ouvrez votre navigateur préféré et accédez à l'adresse de l'interface web de votre autorité de certification. Par exemple, si votre serveur s'appelle "monserveur", l'adresse serait "[http://monserveur/certsrv](http://monserveur/certsrv)".
2. Sur la page d'accueil de l'interface web de l'autorité de certification, cliquez sur "Demander un certificat".
3. Sur la page suivante, cliquez sur "demande de certificat avancée".
4. Coller le certificat dans “Demande enregistrée”
5. Modèle de certificat : Serveur WEB 
6. Cliquez sur “Envoyer”
7. Sélectionnez “Base64”
8. Téléchargez le certificat

![Untitled](Documentation%20cre%CC%81ation%20autorite%CC%81%20de%20certification%20b6c6bcec0b004b8e832f98cfed1fcaf4/Untitled%201.png)

1. Choisissez le type de certificat à émettre, généralement "Web Server", puis cliquez sur "Soumettre".
2. Une fois la demande approuvée, vous devriez voir un lien pour télécharger le certificat signé. Cliquez sur "Télécharger le certificat" pour le sauvegarder sur votre ordinateur.

## Importer le certificat signé dans Nginx

Il faut ensuite transférer son certificat signé vers le serveur en question. Je l’ai enregistré dans `/etc/ssl/certs/cert.cer` et j’ai transféré ma clé dans `/etc/ssl/private/cert.key` . Pour cela, il est possible de le transférer via `TFTP`. ou alors tout simplement de le copier et l’enregistrer dans un`nano` au chemin d’accès souhaité. 

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