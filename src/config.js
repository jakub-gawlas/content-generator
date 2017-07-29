const path = require('path');

module.exports = {
  srcPath: path.resolve(process.env.APP_SRC_PATH || './example/docu'),
  outPath: path.resolve(process.env.APP_OUT_PATH || './example/out'),
  docuConfigPath: path.resolve(
    process.env.APP_DOCU_CONFIG_PATH || './example/docu.config.json'
  ),
  resourcesBaseURI:
    process.env.APP_RESOURCES_BASE_URI || 'http://localhost:3000/files',
  hotReloadMode: Boolean(process.env.APP_HOT_RELOAD) || false,
};
