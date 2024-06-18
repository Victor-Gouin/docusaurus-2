# Documentation utilisateur Zabbix

# Documentation Utilisateur de Zabbix

## Ajouter des Hôtes dans Zabbix

1. Connectez-vous à l'interface Zabbix.
2. Allez dans "Configuration" puis "Hôtes".
3. Cliquez sur "Créer un hôte".
4. Remplissez les informations nécessaires (nom de l'hôte, groupe d'hôtes, adresse IP).
5. Cliquez sur "Ajouter". 

![Untitled](Documentation%20utilisateur%20Zabbix%20d20ff06ebcc241e5b5304995f6076fd5/Untitled.png)

## Modifier le Dashboard de Supervision

1. Connectez-vous à l'interface Zabbix.
2. Allez dans "Dashboard".
3. Cliquez sur "Actions" puis "Modifier le dashboard".
4. Vous pouvez ajouter ou supprimer des widgets selon vos besoins.
5. Cliquez sur "Mettre à jour".

![Untitled](Documentation%20utilisateur%20Zabbix%20d20ff06ebcc241e5b5304995f6076fd5/Untitled%201.png)

## Créer des Utilisateurs

1. Connectez-vous à l'interface Zabbix.
2. Allez dans "Administration" puis "Utilisateurs".
3. Cliquez sur "Créer un utilisateur".
4. Remplissez les informations nécessaires (nom d'utilisateur, mot de passe).
5. Cliquez sur "Ajouter".

![Untitled](Documentation%20utilisateur%20Zabbix%20d20ff06ebcc241e5b5304995f6076fd5/Untitled%202.png)

## Utiliser les templates Zabbix

Prérequis : avoir ajouté un hôte dans Zabbix. 

Dans la configuration de l’hôte, sélectionner “modèles” puis naviguer et trouver le modèle en fonction de la supervision désirée. 

![Untitled](Documentation%20d%E2%80%99installation%20Zabbix%20b4fe767d9cff4d3d8adacfbd7297a23e/Untitled.png)

## Monitorer MySQL

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

## Création d'alertes par e-mail

1. **Configurer le serveur de messagerie** : Dans l'interface utilisateur de Zabbix, naviguez vers `Administration` > `Media types` et cliquez sur `Email`. Remplissez les détails du serveur SMTP, comme l'adresse du serveur, le port, l'adresse e-mail de l'expéditeur, etc.
2. **Ajouter un média à l'utilisateur** : Allez à `Administration` > `Users`, sélectionnez un utilisateur et cliquez sur l'onglet `Media`. Cliquez sur `Add` et remplissez les détails, y compris le type de média (Email), l'adresse e-mail à laquelle envoyer les alertes, et quand recevoir les alertes.
3. **Créer une action** : Allez à `Configuration` > `Actions` et cliquez sur `Create action`. Dans l'onglet `Operation`, cliquez sur `Add` et définissez l'opération à `Send message` à l'utilisateur ou au groupe d'utilisateurs choisi, et sélectionnez le type de média (Email).
4. **Configurer les conditions d'alerte** : Dans l'onglet `Conditions`, définissez les conditions pour déclencher l'alerte, par exemple, si une certaine gravité d'événement est atteinte, si un problème spécifique survient, etc.
5. **Sauvegarder l'action** : Cliquez sur `Add` pour sauvegarder l'action. Les alertes seront maintenant envoyées à l'adresse e-mail spécifiée lorsque les conditions définies sont remplies.

## Vérification des alertes :

Lors du redémarrage ou d’un changement d’état d’une VM supervisée, je reçois un e-mail indiquant celui ci : 

![Untitled](Documentation%20d%E2%80%99installation%20Zabbix%20b4fe767d9cff4d3d8adacfbd7297a23e/Untitled%202.png)