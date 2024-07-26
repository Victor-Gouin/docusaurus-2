# Créer une configuration nginx avec certificat signé

Nom de domaine : infra.dom

Nom du service : guacamole

cn : guacamole.infra.dom

Autorité de certification : ADCS Wserver 2019

Pour créer un script pour le certificat dans /home, utilisez le code suivant :

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

Ensuite, exécutez les commandes suivantes :

```bash
sudo openssl genrsa -out cert.key 2048
sudo openssl req -new -key cert.key -out cert.pem -config config

```

Il est ensuite nécessaire de signer le certificat cert.pem auprès de l'autorité de certification, puis d'importer le certificat signé dans le serveur cible.

Voici un exemple de configuration de mon serveur nginx :

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

![Untitled](Documentation%20cre%CC%81ation%20autorite%CC%81%20de%20certification%20b6c6bcec0b004b8e832f98cfed1fcaf4/Untitled%202.png)