const fs = require('fs-extra');

async function getFilesPaths(path) {
  const type = await fs.stat(path);
  if (type.isFile()) return path;
  const paths = await fs.readdir(path);
  const filesPromises = paths.map(
    async p => await getFilesPaths(`${path}/${p}`)
  );
  const files = await Promise.all(filesPromises);
  const flattenFiles = files.reduce(
    (arr, x) => (Array.isArray(x) ? [...arr, ...x] : [...arr, x]),
    []
  );
  return flattenFiles;
}

module.exports = getFilesPaths;
