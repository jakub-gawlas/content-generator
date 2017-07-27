const path = require('path');

module.exports = {
  srcPath: path.resolve(process.env.APP_SRC_PATH || './docu'),
  outPath: path.resolve(process.env.APP_OUT_PATH || './out'),
  docuConfigPath: path.resolve(process.env.APP_DOCU_CONFIG_PATH || './docu.config.json'),
};
