module.exports = {
  apps: [
    {
      name: 'southpark-site',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000 -H 0.0.0.0',
      cwd: __dirname,
      env: {
        NODE_ENV: 'production'
      },
      env_production: {
        NODE_ENV: 'production'
      },
      max_memory_restart: '512M',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      merge_logs: true,
      time: true
    }
  ]
}
