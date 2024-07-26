# Documentation Asterisk

# Documentation d'Installation et Configuration d'Asterisk

## Installation

Sur une base Debian, utilisez la commande suivante pour installer le paquet Asterisk :

```bash
sudo apt-get install --no-install-recommends asterisk

```

## Configuration

Les fichiers de configuration d'Asterisk sont localisés dans le répertoire `/etc/asterisk/`.

Après chaque modification de la configuration, Asterisk doit être redémarré avec la commande :

```bash
$ sudo service asterisk reload

```

Si les modifications requièrent un redémarrage complet d'Asterisk, utilisez la commande :

```bash
sudo asterisk –rx ‘’core restart when convenient’’

```

### Configuration du SIP

La configuration globale du SIP se trouve dans le fichier `/etc/asterisk/sip.conf`. Modifiez-y la langue en 'FR' pour notre cas.

### Déclaration des Utilisateurs

Les utilisateurs sont déclarés dans le fichier `/etc/asterisk/users.conf`. Voici un exemple de configuration pour deux utilisateurs, Victor et Ethan, avec le mot de passe 1234 :

```bash
[local-user](!)
    type = friend
    host = dynamic
    context = default

[6000](local-user)
    fullname = ut1
    secret = 1234

[6001](local-user)
    fullname = ut2
    secret = 1234

```

### Configuration du Plan de Numérotation

Le plan de numérotation est défini dans le fichier `/etc/asterisk/extensions.conf`. Voici un exemple de configuration :

```bash
[default]
; When calling 5000, redirect to choose-user
exten => 5000,1,Goto(choose-user,s,1)

[choose-user]
; Answer the call
exten => s,1,Answer()
; Wait for a digit
exten => s,n,WaitExten()
; Redirect the call to the right user
exten => 0,1,Dial(SIP/6000)
exten => 1,1,Dial(SIP/6001)
; In case of a wrong digit or a timeout, terminate the call
exten => t,1,Hangup()

```

### Utilisation

Afin de vérifier si le serveur fonctionne, j’utilise le softphone Linphone installé sur deux machines différentes. Je me connecte au serveur Asterisk et test un appel. 

J’ai également redirigé les ports SIP du WAN afin de pouvoir se connecter au serveur Asterisk et passer des appels depuis l’extérieur.