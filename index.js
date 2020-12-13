const yaml = require('js-yaml');
const got = require('got');
const { config: defaultConfig } = require('./default-clash-config');
const remoteClashYaml = process.env.REMOTE_CLASH_YAML;

const generate = async ({ platform } = {}) => {
  try {
    const response = await got(remoteClashYaml);
    const remoteConfig = yaml.safeLoad(response.body, 'utf8');

    const proxies = remoteConfig.proxies;
    const config = {
      ...defaultConfig,
      proxies,
    };
    config['proxy-groups'][0] = {
      name: '🔰国外流量',
      type: 'select',
      proxies: proxies.map(p => p.name),
    };
    if (platform === 'win') {
      config['external-ui'] = 'ui';
    }
    return yaml.safeDump(config).replace(/\\U0001F530/g, '🔰');
  } catch (error) {
    console.error(error);
    return error;
  }
}

module.exports = {
  generate,
};
