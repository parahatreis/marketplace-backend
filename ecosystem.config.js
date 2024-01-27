module.exports = {
  apps : [{
    name : 'backend-marketplace',
    script: 'app.js',
    instances: 'max',
    exec_mode: 'cluster',
    log_date_format: 'MM-DD-YYYY HH:mm Z',
  }]
};
