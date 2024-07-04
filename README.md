# Vexed.Me

The source code of https://vexed.me.


## Development

```
docker compose -f docker/compose/base.yml -f docker/compose/dev.yml up
```

### Crawler

```
docker compose -f docker/compose/base.yml -f docker/compose/dev.yml attach crawler
```

```
npm i
npm run dev
```

### Web

```
docker compose -f docker/compose/base.yml -f docker/compose/dev.yml attach web
```

```
npm i
npm run dev
```

Add http://localhost:3000 to https://console.cloud.google.com/apis/credentials for /food/map.


## Production

https://www.linode.com/marketplace/apps/linode/docker

```
sudo apt update
sudo apt upgrade
sudo ufw allow 80
sudo ufw allow 443
echo '{ "log-driver": "local" }' | sudo tee /etc/docker/daemon.json
sudo systemctl restart docker
```

### First Build

```
sudo chown 999:999 crawler/dist
sudo docker compose -f docker/compose/base.yml -f docker/compose/prod.yml build
sudo docker compose -f docker/compose/base.yml -f docker/compose/prod.yml run --rm crawler npm run build
sudo docker compose -f docker/compose/base.yml -f docker/compose/prod.yml run --rm web npm run build
```

999 is the container "crawler" user "pptruser".

### Cert

```
sudo docker/cron/cert.sh user@example.org example.org
```

Add the following line to root's crontab:

```
5 5 5 * * /home/user/vexed.me/docker/cron/cert.sh user@example.org example.org
```

### Services Up/Down

```
sudo docker compose -f docker/compose/base.yml -f docker/compose/prod.yml up -d
```

```
sudo docker compose -f docker/compose/base.yml -f docker/compose/prod.yml down
```

### Build while Running

```
sudo docker compose -f docker/compose/base.yml -f docker/compose/prod.yml exec web npm run build
```

```
sudo docker compose -f docker/compose/base.yml -f docker/compose/prod.yml exec crawler npm run build
```

### Restart a Service

```
sudo docker compose -f docker/compose/base.yml -f docker/compose/prod.yml restart crawler
```

```
sudo docker compose -f docker/compose/base.yml -f docker/compose/prod.yml restart web
```

### View Logs

```
sudo docker compose -f docker/compose/base.yml -f docker/compose/prod.yml logs -n 1000 -t --follow crawler
```

```
sudo docker compose -f docker/compose/base.yml -f docker/compose/prod.yml logs -n 1000 -t --follow web
```
