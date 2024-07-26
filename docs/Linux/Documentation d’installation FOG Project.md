# Documentation d’installation FOG Project

# Documentation d’installation de FOG

## Contexte

FOG est un outil qui permet de déployer et de faire des images d’un ordinateur à distance.

## Prérequis

- Installation d'UBUNTU version 20.04.5
- Installation de Windows 10
- Sur Windows server 2016, installer un serveur DHCP et une étendue

## Information

Installation du Fog client sur Windows : [http://ipduserv/fog/client](http://ipduserv/fog/client)
Sur hyper V, il faut ajouter une carte réseau héritée afin de pouvoir booter en PXE Gen1.
Commande pour renouveler le bail DHCP Ubuntu :

```bash
sudo dhclient-r
sudo dhclient

```

Ipduserv = adresse ip du serveur

## UBUNTU Etape d’installation FOG

1. Mise à jour des paquets Ubuntu avec la commande :

```bash
sudo apt-get update

```

1. Installation de git

```bash
sudo apt install git
```

1. Clonage du dépôt GitHub

```bash
cd /opt
git clone https://github.com/fogproject/fogproject.git fog_stable/
```

1. Utilisation du script d’installation git

```bash
cd fog_stable/bin
sudo bash installfog.sh
```

1. Suivis d’installation de FOG

![Untitled](Documentation%20d%E2%80%99installation%20FOG%20Project%20956d621d767b419ea8767f42dc308b6d/Untitled.png)

Le programme d’installation va alors vous posez différentes questions de configuration de FOG et installer les différents paramétrage choisis.

## L'installation terminée

L’interface web de management est maintenant accessible depuis un navigateur en mettant l’adresse IP du serveur :

identifiant : fog
Mdp : password

## Réservation de l’adresse IP serveur sur le DHCP

Dans IPV4, Etendu, Option de serveur, clic droit Configurer les options... Et modifier l’option 66 et y ajouter l’adresse IP du serveur. Et pour l’option 67 y ajouter undionly.kpxe.

![Untitled](Documentation%20d%E2%80%99installation%20FOG%20Project%20956d621d767b419ea8767f42dc308b6d/Untitled%201.png)

![Untitled](Documentation%20d%E2%80%99installation%20FOG%20Project%20956d621d767b419ea8767f42dc308b6d/Untitled%202.png)

![Untitled](Documentation%20d%E2%80%99installation%20FOG%20Project%20956d621d767b419ea8767f42dc308b6d/Untitled%203.png)

## Pour capturer l’image de la machine Windows 10

Il faut d’abord enregistrer la machine sur le panel de management. Aller dans le menu Boot et choisir boot LAN.

![Untitled](Documentation%20d%E2%80%99installation%20FOG%20Project%20956d621d767b419ea8767f42dc308b6d/Untitled%204.png)

![Untitled](Documentation%20d%E2%80%99installation%20FOG%20Project%20956d621d767b419ea8767f42dc308b6d/Untitled%205.png)

La machine s’enregistre et va ensuite redémarrer

![Untitled](Documentation%20d%E2%80%99installation%20FOG%20Project%20956d621d767b419ea8767f42dc308b6d/Untitled%206.png)

Sur l’interface de FOG on peut voir que la machine WINDOWS 10 est enregistrée

![Untitled](Documentation%20d%E2%80%99installation%20FOG%20Project%20956d621d767b419ea8767f42dc308b6d/Untitled%207.png)

## Créer l’image

Image management -> Create New image. Rentrer les informations suivantes : le nom de l’image, l’OS, le type d’image, la partition, on active l’image et on coche qu’on peut la répliquer, le taux de compression et on l’ajoute.

![Untitled](Documentation%20d%E2%80%99installation%20FOG%20Project%20956d621d767b419ea8767f42dc308b6d/Untitled%208.png)

## Assigner l’image à la machine enregistrer Windows 10

Cliquer l’adresse mac de la machine et on choisit l’image que l’on veut capturer puis cliquer sur Update.

![Untitled](Documentation%20d%E2%80%99installation%20FOG%20Project%20956d621d767b419ea8767f42dc308b6d/Untitled%209.png)

![Untitled](Documentation%20d%E2%80%99installation%20FOG%20Project%20956d621d767b419ea8767f42dc308b6d/Untitled%2010.png)

## Pour capturer l’image

Il faut retourner dans la liste des machines et sélectionner la machine Windows 10 avec la bonne image, puis de cliquer sur la flèche jaune. Rallumer l’ordinateur en allant dans le boot menu et booter sur Boot LAN, la capture de l’image va alors se faire toute seule.

![Untitled](Documentation%20d%E2%80%99installation%20FOG%20Project%20956d621d767b419ea8767f42dc308b6d/Untitled%2011.png)

## Booter sur le réseau

Il faut ensuite redémarrer la machine comme fait précédemment et booter sur le réseau. FOG devrait se charger du reste.

![Untitled](Documentation%20d%E2%80%99installation%20FOG%20Project%20956d621d767b419ea8767f42dc308b6d/Untitled%2012.png)

## Restauration d’une image

Pour restaurer une image il suffit de faire exactement ma même chose en utilisant la flèche verte.