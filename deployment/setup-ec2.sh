#!/usr/bin/env bash
set -e

# Update package lists and install security updates
sudo apt update
sudo apt upgrade -y

# Install Node.js 20.x from NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git nginx

# Install PM2 globally for process management
sudo npm install -g pm2

# Create application directory and set correct ownership
sudo mkdir -p /var/www/gee-bee-network-site
sudo chown "$USER":"$USER" /var/www/gee-bee-network-site

# Enable and start Nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# Configure firewall for SSH and web traffic
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
sudo ufw status verbose

# Configure PM2 startup for the current user
pm2 startup systemd -u "$USER" --hp "$HOME"

# Notes:
# - Copy your GitHub repository into /var/www/gee-bee-network-site
# - Place your SSH deploy key on the EC2 host or use GitHub Actions SSH deploy workflow
# - Use the example nginx.conf.example file to configure Nginx
