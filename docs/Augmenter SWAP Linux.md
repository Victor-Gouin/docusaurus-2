# Augmenter SWAP Linux

### Empêcher l’OS d’utiliser le SWAP :

```bash
sudo dphys-swapfile swapoff
```

### Modifier le fichier de configuration SWAP :

```bash
sudo nano /etc/dphys-swapfile
```

### Modifier la ligne correspondante à la taille :

```bash
CONF_SWAPSIZE=
```

La valeur doit être saisie en MO (1GO = 1024MO, 2GO = 2048MO)

### Initialiser le nouveau fichier d’échange :

```bash
sudo dphys-swapfile setup
```

### Réactiver le fichier d’échange :

```bash
sudo dphys-swapfile swapon
```

### Redémarrer le système afin de relancer tous les services correctement :

```bash
sudo init 6
```

### Vérifier le nouveau fichier d’échange :

```bash
htop
```

![Untitled](Augmenter%20SWAP%20Linux%20d765e96e52314d13a9c949fb4feeab78/Untitled.png)

On peut voir que la nouvelle taille est bien de 2GO