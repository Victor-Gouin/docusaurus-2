# Documentation d’installation OpenVPN

1. **Téléchargement et installation d’OpenVPN :**
    
    ```bash
    curl -O https://raw.githubusercontent.com/angristan/openvpn-install/master/openvpn-install.sh
    sudo bash openvpn-install.sh
    
    ```
    
    La commande « bash » permet d’exécuter le script d’installation. Il faut ensuite suivre les étapes et répondre aux questions que le script pose en fonction de nos besoins.
    
2. **Installation de VSFTPD :**
    
    ```bash
    sudo apt-get install vsftpd
    
    ```
    
3. **Configuration de VSFTPD :**
    
    ```bash
    sudo nano /etc/vsftpd.conf
    
    ```
    
    Copiez et collez la configuration suivante dans le fichier et modifiez les valeurs selon vos besoins. Cette configuration fonctionne de base :
    
    ```bash
    listen=NO
    listen_ipv6=YES
    anonymous_enable=NO
    local_enable=YES
    write_enable=YES
    dirmessage_enable=YES
    use_localtime=YES
    xferlog_enable=YES
    connect_from_port_20=YES
    ascii_upload_enable=YES
    ascii_download_enable=YES
    chroot_local_user=YES
    chroot_list_enable=YES
    chroot_list_file=/etc/vsftpd.chroot_list
    local_root=/home/$USER/Public_html
    allow_writeable_chroot=YES
    ls_recurse_enable=YES
    secure_chroot_dir=/var/run/vsftpd/empty
    pam_service_name=vsftpd
    rsa_cert_file=/etc/ssl/certs/ssl-cert-snakeoil.pem
    rsa_private_key_file=/etc/ssl/private/ssl-cert-snakeoil.key
    ssl_enable=NO
    
    ```
    
4. **Configuration des utilisateur autorisés VSFTPD :**
    
    ```bash
    sudo nano /etc/vsftpd.chroot_list
    
    ```
    
    Il faut ajouter les utilisateurs un par ligne :
    
    ```bash
    ut1
    root
    
    ```
    
    ut1 est l’utilisateur de ma session Linux.
    
5. **Redémarrer le service VSFTPD :**
    
    ```bash
    sudo systemctl restart vsftpd
    
    ```
    
    Cette commande permet d’appliquer les changements de la configuration de VSFTPD
    
6. **Transfert des fichiers de configuration OpenVPN :**
    
    Il est désormais possible de se connecteur au serveur avec un client TFPT (FileZilla) pour transférer les fichiers de configuration client OpenVPN.
    
7. **Utilisation d’OpenVPN connect**
    
    Il faut maintenant installer un client OpenVPN dans les clients (OpenVPN connect, OpenVPN GUI…) et importer le fichier de configuration récupéré précédemment.