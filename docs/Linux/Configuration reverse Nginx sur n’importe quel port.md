# Configuration reverse Nginx sur n’importe quel port

### Mettre a jour la liste des paquets :

```bash
sudo apt update
```

### Mettre à jour les paquets :

```bash
sudo apt upgrade
```

### Installer Nginx

```bash
sudo apt install nginx
```

### Configurer Nginx

```bash
sudo nano /etc/nginx/nginx.conf
```

Modifier ce fichier par les les adresses IP/protocole voulus ainsi que le port. Il est possible d’ajouter  autant de serveur que l’on veut dans le stream et de même pour la partie http.

```bash
user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;

events {
    worker_connections  1024;
}

stream {
    # Gérer le trafic TCP sur le port 9201
    server {
        listen 9201;
        proxy_pass 192.168.1.254:9201;
    }

    # Gérer le trafic UDP sur le port 9201
    server {
        listen 9201 udp;
        proxy_pass 192.168.1.254:9201;
    }
}

http {
    server {
        listen 80;
#        server_name _;

        location / {
            proxy_pass http://192.168.1.252:20211;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}

```

### Redémarrer le service afin de prendre en compte les modifications :

```bash
sudo systemctl restart nginx
```

### Penser à activer le lancement de Nginx au démarrage du système :

```bash
sudo systemctl enable nginx
```