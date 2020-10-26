const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const got = require('got');
const { config: defaultConfig } = require('./default-clash-config');
const { remoteClashYaml, gotConfig, proxyFilter } = require('./config');

(async () => {
	try {
    const response = await got(remoteClashYaml, gotConfig);
    const remoteConfig = yaml.safeLoad(response.body, 'utf8');
    
    const config = {
      ...defaultConfig,
      proxies,
    };
    const proxies = proxyFilter ? proxyFilter(remoteConfig.proxies) : remoteConfig.proxies;
    config['proxy-groups'][0] = {
      name: '🔰国外流量',
      type: 'select',
      proxies: proxies.map(p => p.name),
    };
    fs.writeFileSync(path.resolve(__dirname, 'config.yaml'), yaml.safeDump(config).replaceAll('\\U0001F530', '🔰'));
    config['external-ui'] = 'clash-dashboard';
    config['interface-name'] = 'WLAN';
    fs.writeFileSync(path.resolve(__dirname, 'config-win.yaml'), yaml.safeDump(config).replaceAll('\\U0001F530', '🔰'));
	} catch (error) {
		console.error(error);
	}
})();
