# TLS renewal on the VM (Docker nginx)

Certificates live on the host at `/etc/letsencrypt` and are mounted read-only into the `nginx` container. Reload nginx after files change:

```bash
cd /path/to/CareVoyage-api
docker compose exec nginx nginx -s reload
```

## If you keep Certbot **standalone**

Renewal needs **port 80 free** while Certbot runs. Docker nginx normally binds 80, so either:

1. **Stop nginx, renew, start** (brief downtime), e.g. cron:

   ```bash
   docker compose stop nginx
   certbot renew --standalone
   docker compose start nginx
   docker compose exec nginx nginx -s reload
   ```

2. Or switch to **webroot** or **DNS** validation so nothing exclusive needs port 80 during renewal; then use a deploy hook:

   ```bash
   certbot renew --deploy-hook "docker compose -f /path/to/CareVoyage-api/compose.yml exec nginx nginx -s reload"
   ```

## Host vs container ports

Only one listener should use **80** and **443** on the VM. If system nginx (or another service) is still running, stop it so Docker can publish those ports.

## App environment

Set `CLIENT_URI` in `.env` to your **frontend** origin (browser app URL) for CORS, not the API hostname. The API is served at `https://api.hasnacodes.site` via nginx.
