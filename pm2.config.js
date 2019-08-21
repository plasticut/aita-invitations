const config = require('config');

module.exports = {
  apps: [{
    name: 'aita_invitations_main',
    script: 'app/server.js',
    exec_mode: 'cluster',
    instances: Number(config.get('instances')),
    // wait_ready: Instead of reload waiting for listen event, wait for process.send(‘ready’)
    wait_ready: true,
    // listen_timeout: time in ms before forcing a reload if app not listening
    listen_timeout: 3000,
    // kill_timeout: time in milliseconds before sending a final SIGKILL
    kill_timeout: config.get('gracefulShutdown.timeout')
    // node_args : '--harmony'
  }]
};
