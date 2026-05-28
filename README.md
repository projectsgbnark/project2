# GEE BEE NETWORK PVT LTD Website

This project is a Node.js web application for GEE BEE NETWORK PVT LTD.
The repository includes a static frontend, Express backend, PM2 process configuration, and GitHub Actions deployment.

## Local development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start locally:
   ```bash
   npm start
   ```
3. Open in browser:
   ```bash
   http://localhost:3001
   ```

## Project structure

- `app.js` - application entry point
- `index.html` - static homepage
- `styles.css` - frontend styling
- `script.js` - browser interactions and API calls
- `ecosystem.config.js` - PM2 production process definition
- `.github/workflows/deploy.yml` - CI/CD deployment workflow
- `deployment/nginx.conf.example` - Nginx reverse-proxy example
- `deployment/setup-ec2.sh` - example EC2 setup commands

## GitHub Actions deployment

The workflow in `.github/workflows/deploy.yml` triggers automatically for pushes to the `main` branch.
It performs the following steps:

1. Checkout the repository
2. Setup Node.js runtime
3. Install dependencies
4. Optionally run tests
5. SSH into the EC2 host
6. Pull the latest `main` branch
7. Install production dependencies
8. Restart the PM2 process
9. Run a health check on the server

## Required GitHub secrets

Add these repository secrets in GitHub:

- `EC2_HOST` - public IP or DNS name of the EC2 instance
- `EC2_USER` - SSH username (for Ubuntu 22.04, usually `ubuntu`)
- `EC2_SSH_KEY` - private SSH key for the deploy user
- `EC2_PORT` - SSH port (usually `22`)

### How to set `EC2_SSH_KEY`

The `EC2_SSH_KEY` secret must contain the entire private key, including the `BEGIN` and `END` lines. Example:

```text
-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----
```

If the key is encrypted, also add:

- `EC2_SSH_PASSPHRASE` - passphrase for the private key

Use one of these methods to set the secret:

```bash
gh secret set EC2_SSH_KEY --body-file ~/.ssh/id_rsa
```

or paste the full key into the GitHub web UI secret editor.

## EC2 setup

Make sure your EC2 Ubuntu 22.04 instance is prepared for deployment.
Use the example setup script at `deployment/setup-ec2.sh` or run the commands manually.

Example setup steps:

```bash
sudo apt update
sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git nginx
sudo npm install -g pm2
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
sudo systemctl enable nginx
sudo systemctl start nginx
sudo pm2 startup systemd -u "$USER" --hp "$HOME"
```

Then deploy the app repository to `/var/www/gee-bee-network-site` and ensure it is owned by the deploy user.

> The EC2 host must be able to pull your GitHub repository. Configure a deploy SSH key or use an SSH agent on the Ubuntu instance so `git clone git@github.com:...` works.

## Nginx configuration

Use `deployment/nginx.conf.example` as a starting point for your reverse proxy.
This example forwards all requests to the app running on `http://127.0.0.1:3001`.

## PM2 configuration

The `ecosystem.config.js` file defines a production process:

- app name: `gee-bee-network-app`
- entry point: `app.js`
- environment: `production`
- log files in `./logs/`

To start locally with PM2:

```bash
pm install
pm install -g pm2
pm2 startOrReload ecosystem.config.js --env production
pm2 save
```

## Deployment steps

1. Push code to `main`.
2. GitHub Actions will run the workflow and deploy the latest code to EC2.
3. The workflow pulls code, installs dependencies, reloads PM2, and restarts Nginx.
4. A health check verifies the app is responding.

## Security best practices

- Use SSH key authentication only.
- Disable password login in `/etc/ssh/sshd_config`:
  - `PasswordAuthentication no`
  - `PermitRootLogin no`
- Keep the deploy user minimal with sudo access only when needed.
- Use GitHub secrets for all credentials.
- Only expose required firewall ports:
  - `22` for SSH
  - `80` for HTTP
  - `443` for HTTPS (if you enable TLS)

## Optional rollback strategy

If deployment fails or you need to revert:

1. SSH into the EC2 host
2. `cd /var/www/gee-bee-network-site`
3. `git log --oneline` to find a previous commit
4. `git checkout <previous-commit>`
5. `npm ci --production`
6. `pm2 startOrReload ecosystem.config.js --env production`

For automated rollback, add a separate workflow or retain previous release tags.
