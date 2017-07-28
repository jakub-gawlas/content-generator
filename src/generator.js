const path = require('path');
const fs = require('fs-extra');
const metaMarked = require('meta-marked');

const getFilesPaths = require('./getFilesPaths');
const createEvaluator = require('js-native-template');

const config = require('./config');

const docuConfig = require(config.docuConfigPath);

async function generate() {
  const filesPaths = await getFilesPaths(config.srcPath);

  const filesInfo = filesPaths.map(p => ({
    path: p,
    base: path.basename(p),
    dir: path.dirname(p),
    ext: path.extname(p),
  }));

  const DOCUMENT_EXTS = ['.html', '.md'];
  const paths = filesInfo.reduce(
    (obj, x) => {
      obj.files.push(x.path);
      DOCUMENT_EXTS.includes(x.ext)
        ? obj.documents.push(x.path)
        : obj.resources.push(x.path);
      return obj;
    },
    { files: [], documents: [], resources: [] }
  );

  const documentFiles = filesInfo.filter(f => DOCUMENT_EXTS.includes(f.ext));

  const rawsPromise = documentFiles.map(
    async f => await fs.readFile(f.path, 'utf8')
  );
  const raws = await Promise.all(rawsPromise);

  /**
  * Object, key is path of file, `raw` is undefined if file isn't document
  * TODO: maybe Map instead Object? for performance?
  */
  const files = documentFiles.reduce((obj, f, i) => {
    obj[f.path] = Object.assign(f, {
      raw: raws[i],
    });
    return obj;
  }, {});
  // Add rest of files to object (which aren't document)
  filesInfo.forEach(f => {
    if (files[f.path]) return;
    files[f.path] = f;
  });

  /**
  * Evaluate documents (template strings)
  */
  const evaluate = createEvaluator({
    partial: p =>
      function file(fileToEval) {
        const file = files[`${fileToEval.dir}/${p}`];
        if (!file) throw new Error(`File "${p}" doesn't exist.`);
        if (!file.raw) throw new Error(`File "${p}" isn't a partial.`);
        return files[`${fileToEval.dir}/${p}`].raw;
      },
    request: require('request-promise-native'),
    link: p => `${config.resourcesBaseURI}/${path.basename(p)}`,
  });
  const evaluateDocs = documentFiles.map(async f => {
    try {
      const evaluatedRaw = await evaluate(files[f.path].raw, {
        file: f,
      });
      files[f.path].evaluatedRaw = evaluatedRaw;
    } catch (err) {
      throw new Error(`While evaluate "${f.path}": ${err.message}`);
    }
  });
  await Promise.all(evaluateDocs);

  /**
  * Documents converted from MD to HTML with metadatas
  */
  const parsedDocs = documentFiles.map(f => {
    const parsed = metaMarked(files[f.path].evaluatedRaw || files[f.path].raw);
    return Object.assign(parsed, {
      path: f.path,
    });
  });

  /**
  * Result documents collection
  */
  const documents = parsedDocs.filter(d => d.meta).map(d =>
    Object.assign(d.meta, {
      content: d.html,
    })
  );

  /**
   * Result object
   */
  const result = Object.assign(docuConfig.spec, { documents });

  /**
   * Save result file
   */
  const OUT_RESULT_FILENAME = 'data.json';
  const resultFilePath = path.join(config.outPath, OUT_RESULT_FILENAME);
  await fs.outputJSON(resultFilePath, result, { spaces: 2 });

  /**
   * Save resources
   */
  const OUT_RESOURCES_DIR = 'resources';
  const resourcesPath = path.join(config.outPath, OUT_RESOURCES_DIR);
  paths.resources.forEach(async p => {
    await fs.copy(p, path.join(resourcesPath, files[p].base));
  });
};

module.exports = generate;
