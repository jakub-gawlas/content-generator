const generate = require('./generator');
const chokidar = require('chokidar');
const config = require('./config');

// Hot reloading generation
if (config.hotReloadMode) {
  chokidar.watch(config.srcPath).on('all', onChange);
  chokidar.watch(config.docuConfigPath).on('change', onChange);

  let timer = null;
  function onChange(event, path) {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      generate();
      timer = null;
    }, 100);
  }

  return;
}

// Once generation
generate();
