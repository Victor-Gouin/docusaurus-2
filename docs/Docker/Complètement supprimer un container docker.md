# Complètement supprimer un container docker

1. Stop all containers if they are running from the AIO interface
2. Stop the mastercontainer with `sudo docker stop nextcloud-aio-mastercontainer`
3. If the domaincheck container is still running, stop it with `sudo docker stop nextcloud-aio-domaincheck`
4. Check that no AIO containers are running anymore by running `sudo docker ps --format {{.Names}}`. If no `nextcloud-aio` containers are listed, you can proceed with the steps below. If there should be some, you will need to stop them with `sudo docker stop <container_name>` until no one is listed anymore.
5. Check which containers are stopped: `sudo docker ps --filter "status=exited"`
6. Now remove all these stopped containers with `sudo docker container prune`
7. Delete the docker network with `sudo docker network rm nextcloud-aio`
8. Check which volumes are dangling with `sudo docker volume ls --filter "dangling=true"`
9. Now remove all these dangling volumes: `sudo docker volume prune --filter all=1` (on Windows you might need to remove some volumes afterwards manually with `docker volume rm nextcloud_aio_backupdir`, `docker volume rm nextcloud_aio_nextcloud_datadir`).
10. If you've configured `NEXTCLOUD_DATADIR` to a path on your host instead of the default volume, you need to clean that up as well. (E.g. by simply deleting the directory).
11. Make sure that no volumes are remaining with `sudo docker volume ls --format {{.Name}}`. If no `nextcloud-aio` volumes are listed, you can proceed with the steps below. If there should be some, you will need to stop them with `sudo docker volume rm <volume_name>` until no one is listed anymore.
12. Optional: You can remove all docker images with `sudo docker image prune -a`.
13. And you are done! Now feel free to start over with the recommended docker run command!