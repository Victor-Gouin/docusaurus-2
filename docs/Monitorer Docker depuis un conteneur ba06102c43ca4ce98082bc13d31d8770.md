# Monitorer Docker depuis un conteneur

Installer le conteneur Zabbix agent 2, donnez lui les privilèges (cochez la case “Privileged :”), configurez le pour pointez vers votre serveur Zabbix.

Pour Unraid, il faut commencer par monter docker.sock dans le conteneur : 

Dans la section des volumes ou des montages, ajoutez une nouvelle ligne pour monter le socket Docker :

- **Container Path**: `/var/run/docker.sock`
- **Host Path**: `/var/run/docker.sock`

![Untitled](Monitorer%20Docker%20depuis%20un%20conteneur%20ba06102c43ca4ce98082bc13d31d8770/Untitled.png)

Depuis l’hôte du docker (la console Unraid), exécuter la commande suivante pour trouver l’ID du groupe docker : 

```bash
getent group docker 
```

![Untitled](Monitorer%20Docker%20depuis%20un%20conteneur%20ba06102c43ca4ce98082bc13d31d8770/Untitled%201.png)

Ici, mon GID est 281.

Afin d’utiliser root dans la console du conteneur, exécutez cette commande : 

```bash
docker exec -it --user root zabbix-agent2 /bin/bash
```

Ensuite, il faut créer le groupe docker dans le conteneur avec le meme GID : 

```bash
addgroup -g 281 docker
```

Il faut également créer le user zabbix dans le groupe docker : 

```bash
adduser zabbix docker
```

redémarrer le conteneur

Il reste maintenant plus qu’à configurer l’hôte dans le serveur Zabbix en utilisant le template “docker by zabbix agent2”

![Untitled](Monitorer%20Docker%20depuis%20un%20conteneur%20ba06102c43ca4ce98082bc13d31d8770/Untitled%202.png)