# Documentation Technique de Zabbix

Zabbix est un logiciel de surveillance de réseau open source qui permet de surveiller l'état des divers services de réseau, serveurs et autres matériels de réseau.

## Configuration

La configuration de Zabbix se fait principalement à travers l'interface web. Vous pouvez ajouter des hôtes à surveiller, définir des éléments à surveiller pour chaque hôte, définir des déclencheurs pour alerter sur certaines conditions, et plus encore.

Mon Zabbix est configuré en https avec un certificat signé par mon autorité de certification. Il est également enregistré dans le DNS afin de faciliter son utilisation. 

## Utilisation

Une fois que vous avez configuré Zabbix avec vos hôtes et vos éléments de surveillance, vous pouvez commencer à utiliser le tableau de bord pour surveiller l'état de vos services de réseau. Vous pouvez également configurer des notifications pour être alerté en cas de problèmes.

Mon interface web est la suivante : https://zabbix.infra.dom

Dans mon cas, Zabbix supervise Windows Server, PfSense, Asterisk, Docker, GLPI, Guacamole, OpenVPN. J’y ai aussi configuré un serveur mail afin de recevoir des alertes par mail dès lors qu’une machine ou un service s’arrête. 

## Conclusion

Zabbix est un outil puissant pour la surveillance de réseau. Avec une configuration adéquate, il peut vous aider à rester en tête des problèmes potentiels avant qu'ils ne deviennent de véritables problèmes.

![Infra Victor Gouin BTS SIO-2.drawio.svg](Documentation%20Technique%20de%20Zabbix%209eff955d9504471db5d5e10e0a6d5dff/Infra_Victor_Gouin_BTS_SIO-2.drawio.svg)