# Documentation d’installation Apache Guacamole

# Documentation d’installation d’Apache Guacamole

## Installation des outils nécessaires :

```bash
sudo apt install make -y

sudo apt install gcc g++ libcairo2-dev libjpeg-turbo8-dev libpng-dev libtool-bin libossp-uuid-dev libavcodec-dev libavformat-dev libavutil-dev libswscale-dev freerdp2-dev libpango1.0-dev libssh2-1-dev libvncserver-dev libtelnet-dev libssl-dev libvorbis-dev libwebp-dev libpango1.0-dev libwebsockets-dev libpulse-dev -y

```

## Téléchargement et extraction du serveur Guacamole:

```bash
wget <https://archive.apache.org/dist/guacamole/1.5.1/source/guacamole-server-1.5.1.tar.gz>

tar xzf guacamole-server-1.5.1.tar.gz

cd guacamole-server-1.5.1/

```

## Configuration, compilation et installation du serveur Guacamole:

```bash
sudo ./configure --with-init-dir=/etc/init.d

sudo make

sudo make install

sudo ldconfig

sudo systemctl enable guacd

sudo systemctl start guacd

systemctl status guacd

```

## Installation de Tomcat:

```bash
sudo apt install tomcat9 tomcat9-admin tomcat9-common tomcat9-user -y

systemctl status tomcat9

```

## Configuration de Guacamole pour Tomcat:

```bash
sudo mkdir /etc/guacamole

sudo wget <https://archive.apache.org/dist/guacamole/1.5.1/binary/guacamole-1.5.1.war> -O /etc/guacamole/guacamole.war

sudo ln -s /etc/guacamole/guacamole.war /var/lib/tomcat9/webapps/

sudo systemctl restart tomcat9

sudo systemctl restart guacd

```

## Configuration de l’environnement Guacamole

```bash
Cd

sudo mkdir /etc/guacamole/{extensions,lib}

echo "GUACAMOLE_HOME=/etc/guacamole" | sudo tee -a /etc/default/tomcat9

sudo nano /etc/default/tomcat9

# Ajouter à la fin : GUACAMOLE_HOME=/etc/guacamole

```

## Configuration de la base de données MySQL pour Guacamole:

```bash
sudo apt install mariadb-server mariadb-client

sudo mysql

CREATE DATABASE guacamole_db;
CREATE USER 'guacamole_user'@'localhost' IDENTIFIED BY 'P@$sW0rd';
GRANT SELECT,INSERT,UPDATE,DELETE ON guacamole_db.* TO 'guacamole_user'@'localhost';
FLUSH PRIVILEGES;
quit;

```

Cela permet de créer la base de données des utilisateurs. Cette base aura pour utilisateur : guacamole_user et en mot de passe : P@$sW0rd

## Installation de l'authentification JDBC pour MySQL:

```bash
wget <https://archive.apache.org/dist/guacamole/1.5.1/binary/guacamole-auth-jdbc-1.5.1.tar.gz>

tar vfx guacamole-auth-jdbc-1.5.1.tar.gz

cat guacamole-auth-jdbc-1.5.1/mysql/schema/*.sql | sudo mysql guacamole_db

sudo cp guacamole-auth-jdbc-1.5.1/mysql/guacamole-auth-jdbc-mysql-1.5.1.jar /etc/guacamole/extensions/

```

## Configuration du connecteur JDBC MySQL:

```bash
cd /home

sudo wget <https://cdn.mysql.com/archives/mysql-connector-java-8.0/mysql-connector-j_8.0.33-1ubuntu22.04_all.deb>

sudo dpkg-deb -x mysql-connector-j_8.0.33-1ubuntu22.04_all.deb /home

cd /home/usr/share/java/

sudo cp mysql-connector-j-8.0.33.jar /etc/guacamole/lib/

sudo nano /etc/guacamole/guacamole.properties

```

## Configuration des propriétés de Guacamole:

```bash
# Hostname and Guacamole server port
guacd-hostname: localhost
guacd-port: 4822

# MySQL properties
mysql-hostname: localhost
mysql-port: 3306
mysql-database: guacamole_db
mysql-username: guacamole_user
mysql-password: P@$sW0rd

```

## Création d'un lien symbolique pour le répertoire Guacamole :

```bash
sudo ln -s /etc/guacamole /usr/share/tomcat9/.guacamole

sudo systemctl restart tomcat9

sudo systemctl restart guacd

```

## Installation de l'authentification TOTP:

```bash
cd

wget <https://archive.apache.org/dist/guacamole/1.5.1/binary/guacamole-auth-totp-1.5.1.tar.gz>

tar -xzf guacamole-auth-totp-1.5.1.tar.gz

rm guacamole-auth-totp-1.5.1.tar.gz

sudo cp guacamole-auth-totp-1.5.1/guacamole-auth-totp-1.5.1.jar /etc/guacamole/extensions

sudo systemctl restart tomcat9

sudo systemctl restart guacd

```

## Installation et configuration de Nginx pour HTTPS:

```bash
sudo apt install nginx

systemctl enable nginx

```

## Configuration d'un certificat SSL pour Nginx :

```bash
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/guacamole-selfsigned.key -out /etc/ssl/certs/guacamole-selfsigned.crt

```

## Configuration du fichier Nginx pour Guacamole :

```bash
cd

sudo nano /etc/nginx/sites-available/nginx-guacamole-ssl

```

#Ajouter ceci :

```bash
server {
	listen 80;
	#server_name guacamole.example.com;
	return 301 https://$host$request_uri;
}
server {
	listen 443 ssl;
	#server_name guacamole.example.com;

	#root /var/www/html;

	index index.html index.htm index.nginx-debian.html;

    	ssl_certificate /etc/ssl/certs/guacamole-selfsigned.crt;
	ssl_certificate_key /etc/ssl/private/guacamole-selfsigned.key;

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
		    proxy_pass http://guacamole.example.com:8080/guacamole/;    -------------------> remplacer par ip du serveur guacd ou localhost
		    proxy_buffering off;
		    proxy_http_version 1.1;
		    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		    proxy_set_header Upgrade $http_upgrade;
		    proxy_set_header Connection $http_connection;
		    proxy_cookie_path /guacamole/ /;
	}

}

```

## Configuration des paramètres SSL pour Nginx :

```bash
sudo openssl dhparam -dsaparam -out /etc/nginx/dhparam.pem 4096

```

## Activation de Nginx et redémarrage des services :

```bash
sudo ln -s /etc/nginx/sites-available/nginx-guacamole-ssl /etc/nginx/sites-enabled/

sudo nginx -t

systemctl restart nginx

sudo unlink /etc/nginx/sites-enabled/default

```