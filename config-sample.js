const tunnel = require('tunnel');

module.exports.remoteClashYaml = 'YOUR_REMOTE_CLASH_URL';

// if you need proxy to got
module.exports.gotConfig = {
  agent: {
    https: tunnel.httpsOverHttp({
      proxy: {
        host: '127.0.0.1',
        port: 7890,
      },
    }),
  },
};

// if you need to filter proxies
module.exports.proxyFilter = (proxies) => proxies.filter(p => !p.name.startsWith('SOME_KEYWORD'));
