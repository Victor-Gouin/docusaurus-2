# Documentation d’installation Zabbix

# Installation et configuration de Zabbix

Suivez les étapes ci-dessous pour installer et configurer Zabbix sur Ubuntu Server 22.04.

## a. Installer le dépôt Zabbix

Exécutez ces commandes :

```bash
wget https://repo.zabbix.com/zabbix/6.4/ubuntu/pool/main/z/zabbix-release/zabbix-release_6.4-1+ubuntu22.04_all.deb
dpkg -i zabbix-release_6.4-1+ubuntu22.04_all.deb
apt update

```

## b. Installer le serveur Zabbix, l'interface utilisateur, l'agent

Exécutez cette commande :

```bash
apt install zabbix-server-mysql zabbix-frontend-php zabbix-nginx-conf zabbix-sql-scripts zabbix-agent

```

## c. Créer la base de données initiale

Assurez-vous que votre serveur de base de données est en cours d'exécution.

Exécutez les commandes suivantes sur votre hôte de base de données :

```bash
sudo apt install mysql-server
mysql -uroot -p
create database zabbix character set utf8mb4 collate utf8mb4_bin;
create user zabbix@localhost identified by 'password';
grant all privileges on zabbix.* to zabbix@localhost;
set global log_bin_trust_function_creators = 1;
quit;

```

Sur l'hôte du serveur Zabbix, importez le schéma initial et les données. Il vous sera demandé d'entrer le mot de passe que vous venez de créer.

```bash
zcat /usr/share/zabbix-sql-scripts/mysql/server.sql.gz | mysql --default-character-set=utf8mb4 -uzabbix -p zabbix

```

Désactivez l'option log_bin_trust_function_creators après avoir importé le schéma de la base de données.

```bash
mysql -uroot -p
set global log_bin_trust_function_creators = 0;
quit;

```

## d. Configurer la base de données pour le serveur Zabbix

Modifiez le fichier `/etc/zabbix/zabbix_server.conf` et ajoutez cette ligne : `DBPassword=password`.

## e. Configurer PHP pour l'interface utilisateur de Zabbix

Modifiez le fichier `/etc/zabbix/nginx.conf`, décommentez et définissez les directives 'listen' et 'server_name'.

```bash
listen 8080;
server_name example.com;
```

## e. Configurer le certificat SSL autosigné

```bash
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/zabbix-selfsigned.key -out /etc/ssl/certs/zabbix-selfsigned.crt
```

Modifiez le fichier `/etc/nginx/sites-available/default/` . Voici un exemple de configuration que j’utilise dans mon cas avec des certification générés et signé par mon autorité de certification. J’ai aussi redirigé le port 80 vers le https. 

```bash
server {
        listen 80;
        return 301 https://$host$request_uri;
}
server {
        listen 443 ssl;

        #root /var/www/html;

        index index.html index.htm index.nginx-debian.html;

        ssl_certificate /etc/ssl/certs/zabbix-selfsigned.crt;
        ssl_certificate_key /etc/ssl/private/zabbix-selfsigned.key;

        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_prefer_server_ciphers on;
        ssl_dhparam /etc/nginx/dhparam.pem;
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
                    proxy_pass http://zabbix.infra.dom:8080;
                    proxy_buffering off;
                    proxy_http_version 1.1;
                    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                    proxy_set_header Upgrade $http_upgrade;
                    proxy_set_header Connection $http_connection;
                    proxy_cookie_path /guacamole/ /;
        }

}
```

```bash
sudo openssl dhparam -dsaparam -out /etc/nginx/dhparam.pem 4096

```

## f. Démarrer les processus du serveur et de l'agent Zabbix

Démarrez les processus du serveur et de l'agent Zabbix et faites-les démarrer au démarrage du système.

```bash
systemctl restart zabbix-server zabbix-agent nginx php8.1-fpm
systemctl enable zabbix-server zabbix-agent nginx php8.1-fpm

```

## g. Ouvrir la page Web de l'interface utilisateur de Zabbix

L'URL pour l'interface utilisateur de Zabbix lors de l'utilisation de Nginx dépend des modifications de configuration que vous devriez avoir effectuées. Dans mon cas, cela est **https://zabbix.infra.dom**

## h. Installation de l'agent Zabbix sur linux

Tout d'abord, téléchargez l'agent Zabbix en utilisant wget :

```bash
wget https://repo.zabbix.com/zabbix/6.0/ubuntu/pool/main/z/zabbix-release/zabbix-release_6.0-4+ubuntu22.04_all.deb

```

Ensuite, installez le paquet téléchargé :

```bash
sudo dpkg -i zabbix-release_6.0-4+ubuntu22.04_all.deb

```

Mettez à jour votre liste de paquets :

```bash
sudo apt update

```

Installez l'agent Zabbix :

```bash
sudo apt install zabbix-agent2

```

Ouvrez le fichier de configuration de l'agent Zabbix avec nano :

```bash
sudo nano /etc/zabbix/zabbix_agentd.conf

```

Enfin, définissez les paramètres de configuration suivants :

```bash
Server=<IP_du_serveur_Zabbix>
ServerActive=<IP_du_serveur_Zabbix>
Hostname=<Nom_d'hôte_du_client_Ubuntu>
```

## I. Utiliser les templates Zabbix

Prérequis : avoir ajouté un hôte dans Zabbix. 

Dans la configuration de l’hôte, sélectionner “modèles” puis naviguer et trouver le modèle en fonction de la supervision désirée. 

![Untitled](Documentation%20d%E2%80%99installation%20Zabbix%20b4fe767d9cff4d3d8adacfbd7297a23e/Untitled.png)

## J. Monitorer MySQL

1. **Installer Zabbix Agent 2 sur le serveur MySQL** : Vous pouvez le faire en utilisant les commandes d'installation de Zabbix Agent 2 mentionnées dans le document.
2. **Autoriser zabbix a monitorer mysql** : `sudo mysql -u root` 

```bash
CREATE USER 'zbx_monitor'@'%' IDENTIFIED BY '<password>';
GRANT REPLICATION CLIENT,PROCESS,SHOW DATABASES,SHOW VIEW ON *.* TO 'zbx_monitor'@'%';
```

1. Créer .my.cnf pour zabbix : `sudo mkdir /var/lib/zabbix`, `sudo nano /var/lib/zabbix/.my.cnf`

```bash
[client]
user='zbx_monitor'
password='<password>'
```

1. **Autoriser zabbix a écouter mysql** : `sudo nano /etc/mysql/my.cnf` 

```bash
bind-address = 0.0.0.0

```

1. **Redémarrer Zabbix Agent** : Après avoir effectué les modifications, vous devez redémarrer Zabbix Agent pour qu'il commence à surveiller MySQL. Vous pouvez le faire avec la commande `systemctl restart zabbix-agent2`.
2. **Ajouter le serveur MySQL à Zabbix Server** : Vous devez ajouter le serveur MySQL à Zabbix Server pour pouvoir le surveiller. Vous pouvez le faire dans l'interface utilisateur de Zabbix.
3. **Appliquer le modèle MySQL à l'hôte** : Enfin, vous devez appliquer le modèle MySQL à l'hôte que vous venez d'ajouter. Dans l'interface utilisateur de Zabbix, naviguez vers `Configuration` > `Hosts`, cliquez sur le nom de l'hôte, puis sur `Templates`. Ajoutez le modèle `Template DB MySQL`.
4. **Ajouter les macros à Zabbix lors de la configuration de l’hote**:
- `{$MYSQL.DSN}` – définissez la source de données du serveur MySQL (la chaîne de connexion d'une session nommée à partir du fichier de configuration du plugin MySQL Zabbix agent 2). Ce guide utilise la source de données par défaut "tcp://localhost:3306" pour surveiller un serveur MySQL installé sur la même machine que le serveur Zabbix et l'agent Zabbix 2.
- `{$MYSQL.PASSWORD}` – définissez le mot de passe de l'utilisateur MySQL "zbx_monitor" précédemment créé.
- `{$MYSQL.USER}` – définissez le nom de l'utilisateur MySQL "zbx_monitor" précédemment créé.
1. **Vérification de la supervision Mysq** :

On peut voir ici le trafic de la base de données de mon GLPI supervisée dans Zabbix : 

![Untitled](Documentation%20d%E2%80%99installation%20Zabbix%20b4fe767d9cff4d3d8adacfbd7297a23e/Untitled%201.png)

## k. Création d'alertes par e-mail

1. **Configurer le serveur de messagerie** : Dans l'interface utilisateur de Zabbix, naviguez vers `Administration` > `Media types` et cliquez sur `Email`. Remplissez les détails du serveur SMTP, comme l'adresse du serveur, le port, l'adresse e-mail de l'expéditeur, etc.
2. **Ajouter un média à l'utilisateur** : Allez à `Administration` > `Users`, sélectionnez un utilisateur et cliquez sur l'onglet `Media`. Cliquez sur `Add` et remplissez les détails, y compris le type de média (Email), l'adresse e-mail à laquelle envoyer les alertes, et quand recevoir les alertes.
3. **Créer une action** : Allez à `Configuration` > `Actions` et cliquez sur `Create action`. Dans l'onglet `Operation`, cliquez sur `Add` et définissez l'opération à `Send message` à l'utilisateur ou au groupe d'utilisateurs choisi, et sélectionnez le type de média (Email).
4. **Configurer les conditions d'alerte** : Dans l'onglet `Conditions`, définissez les conditions pour déclencher l'alerte, par exemple, si une certaine gravité d'événement est atteinte, si un problème spécifique survient, etc.
5. **Sauvegarder l'action** : Cliquez sur `Add` pour sauvegarder l'action. Les alertes seront maintenant envoyées à l'adresse e-mail spécifiée lorsque les conditions définies sont remplies.

## l. Vérification des alertes :

Lors du redémarrage ou d’un changement d’état d’une VM supervisée, je reçois un e-mail indiquant celui ci : 

![Untitled](Documentation%20d%E2%80%99installation%20Zabbix%20b4fe767d9cff4d3d8adacfbd7297a23e/Untitled%202.png)