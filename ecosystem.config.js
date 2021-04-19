module.exports = {
  apps : [{
    script: 'app.js',
    instances : 1,
    exec_mode : 'cluster',
    name : 'sm-backend'
  }]
};
