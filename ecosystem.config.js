module.exports = {
  apps: [
    {
      name: 'gee-bee-network-app',
      script: 'app.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_restarts: 5,
      restart_delay: 2000,
      env: {
        NODE_ENV: 'development',
        PORT: 3001,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      error_file: './logs/app-error.log',
      out_file: './logs/app-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      merge_logs: true,
    },
  ],
};
