# Install

node

yarn

pm2

# Create MYSQL DB

CREATE SCHEMA `XXX` DEFAULT CHARACTER SET utf8mb4;

# Setup back-end

```bash
cd /var/www/html/
git clone git@github.com:paulsmpl/kobo-quotes-backend.git
cd kobo-quotes-backend/
cp .env.example .env
(edit DB information in .env)
yarn
yarn build:prod
```

# Create PM2

module.exports = {
apps: [
{
name: "server",
cwd: "/var/www/html/kobo-quotes-backend",
script: "yarn",
args: "start:prod",
},
],
};

```bash
cd ~/
vi ecosystem.config.js
pm2 start ecosystem.config.js --only server
```
