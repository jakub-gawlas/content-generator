# Content generator

## Run

### Docker

```bash
docker run -v {{SOURCES_PATH}}:/src/ -v {{OUT_PATH}}:/out/ -e "APP_RESOURCES_BASE_URI={{URI}}" -e "APP_HOT_RELOAD={{BOOLEAN}}" jakubgawlas/content-generator
```

- **{{SOURCES_PATH}}** path to dir with sources of content to generate (file `docu.config.json` and `docu` dir, contains documents and resources)
- **{{OUT_PATH}}** path to the directory with generated files
- **{{URI}}** base URI where resources are served, for proper links generation
- **{{BOOLEAN}}** set to `true` to enable the watcher for sources regeneration


