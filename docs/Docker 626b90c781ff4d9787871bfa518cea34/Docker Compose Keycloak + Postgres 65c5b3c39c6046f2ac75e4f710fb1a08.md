# Docker Compose Keycloak + Postgres

### Créer le fichier docker-compose.yml :

```bash
sudo nano docker-compose.yml
```

### Insérer ceci :

```docker
volumes:
  postgres_data:
    driver: local

services:
  postgres:
    image: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: keycloak
      POSTGRES_USER: keycloak
      POSTGRES_PASSWORD: password

  keycloak:
    image: quay.io/keycloak/keycloak:legacy
    environment:
      DB_VENDOR: POSTGRES
      DB_ADDR: postgres
      DB_DATABASE: keycloak
      DB_USER: keycloak
      DB_SCHEMA: public
      DB_PASSWORD: password
      KEYCLOAK_USER: admin
      KEYCLOAK_PASSWORD: Pa55w0rd
      # Uncomment the line below if you want to specify JDBC parameters.
      # JDBC_PARAMS: "ssl=true"
    ports:
      - 8180:8080
    depends_on:
      - postgres

```

Ne pas oublier de configurer la BDD avec un mot de passe sécurisé.

### Lancer le docker-compose :

```bash
sudo docker-compose up -d
```