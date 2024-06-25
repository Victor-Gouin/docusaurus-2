# Documentation d'installation GLPI

## 1. Installation de GLPI

Mettez à jour la liste des paquets et les paquets eux-mêmes avec la commande :

```bash
sudo apt update && apt full-upgrade -y

```

Installez Apache2, MariaDB et PHP avec la commande suivante :

```bash
sudo apt install apache2 mariadb-server php -y

```

Activez le lancement automatique de Apache2 et MariaDB au démarrage du système Linux avec la commande :

```bash
sudo systemctl enable apache2 mariadb

```

Installez Perl avec la commande :

```bash
sudo apt install perl -y

```

Installez toutes les dépendances de GLPI avec la commande :

```bash
sudo apt install php-ldap php-imap php-apcu php-xmlrpc php-cas php-mysqli php-mbstring php-curl php-gd php-simplexml php-xml php-intl php-zip php-bz2 -y

```

Redémarrez Apache2 avec la commande :

```bash
sudo systemctl restart apache2

```

Allez dans le dossier temporaire de Linux avec la commande :

```bash
cd /tmp/

```

Téléchargez la dernière version de GLPI depuis internet avec la commande :

```bash
sudo wget https://github.com/glpi-project/glpi/releases/download/10.0.9/glpi-10.0.9.tgz

```

Extrayez le fichier téléchargé précédemment avec la commande :

```bash
sudo tar xzf glpi-10.0.9.tgz -C /var/www/html

```

Modifiez le propriétaire du dossier GLPI avec la commande :

```bash
sudo chown -R www-data:www-data /var/www/html/glpi

```

Modifiez les droits du dossier GLPI avec la commande :

```bash
sudo chmod -R 775 /var/www/html/glpi

```

## 2. Configuration de la base de données

Entrez dans le mode de configuration de la base de données en tant que root avec la commande :

```bash
sudo mysql -u root

```

Créez la base de données nommée GLPI avec la commande :

```bash
create database glpi;

```

Créez l'utilisateur 'GLPI' avec le mot de passe 'motdepasse' avec la commande :

```bash
create user glpiuser@localhost identified by 'motdepasse';

```

Donnez les droits à la base de données avec la commande :

```bash
grant all privileges on glpi.* to glpiuser@localhost;

```

Validez les modifications faites avec la commande :

```bash
flush privileges;

```

Quittez avec la commande :

```bash
exit;

```

## 3. Configuration de l'interface GLPI

Une fois l'installation terminée, mettez l'adresse IP du serveur /glpi dans votre navigateur internet, puis suivez les instructions à l'écran pour terminer la configuration de l'interface GLPI.

Sur le menu suivant, nous vérifierons que tous les paquets sont correctement installés :

![Untitled](Documentation%20d'installation%20GLPI%20d21e1dfbdbd442278a20936d8a94410c/Untitled.png)

Sur cette fenêtre, nous allons indiquer la base de données

Les informations sont les suivantes :

- Serveur SQL (MariaDB ou MySQL) → **localhost**
- Utilisateur SQL → **glpiuser**
- Mot de passe SQL → **Le mot de passe que vous avez défini précédemment.**

![Untitled](Documentation%20d'installation%20GLPI%20d21e1dfbdbd442278a20936d8a94410c/Untitled%201.png)

Cette page confirme que GLPI est correctement installé : 

![Untitled](Documentation%20d'installation%20GLPI%20d21e1dfbdbd442278a20936d8a94410c/Untitled%202.png)

# GLPI Agent

## 4. Télécharger l’agent GLPI depuis le site officiel.

[GLPI Agent 1.7 - GLPI Project](https://glpi-project.org/fr/glpi-agent-1-7/)

## 5. Renseigner les information comme ci-dessous :

![Untitled](Documentation%20d'installation%20GLPI%20d21e1dfbdbd442278a20936d8a94410c/Untitled%203.png)

## 6. Forcer l’inventaire

Afin de forcer l’inventaire dans GLPI agent, il faut aller sur http://127.0.0.1:62354 et cliquer sur “force inventory”