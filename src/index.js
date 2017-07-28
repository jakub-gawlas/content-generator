const generate = require('./generator');
const chokidar = require('chokidar');
const config = require('./config');

// Hot reloading generationmode
if (config.hotReloadMode) {
  let timer = null;
  chokidar.watch(config.srcPath).on('all', (event, path) => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      generate();
      timer = null;
    }, 100);
  });
  return;
}

// Single generation mode
generate();
