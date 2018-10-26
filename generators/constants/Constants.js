"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Prompts_1 = require("./Prompts");
const WordArt_1 = require("./WordArt");
class Constants {
    constructor() {
        this.GENERATOR_NAME = 'wilbur';
        this.filePaths = {
            templates: {
                base: 'templates',
                test: '/test',
                app: '/app',
                classes: {
                    base: '/class',
                    class: 'class.ts'
                },
                swagger: {
                    base: '/swagger',
                    definitions: '/swagger/definitions/definition.yaml',
                    tags: '/swagger/tags/tag.yaml',
                    paths: '/swagger/paths/paths.yaml',
                    idPaths: '/swagger/paths/id.paths.yaml'
                },
                controller: {
                    base: '/controller',
                    controller: '/controller/class.controller.ejs',
                    router: '/controller/class.router.ejs',
                    validator: '/controller/class.validator.ejs'
                },
                service: {
                    base: '/service',
                    service: '/service/class.service.ejs'
                },
                other: {
                    base: '/other',
                    gitIgnore: '/other/gitignore.ejs'
                }
            }
        };
        this.prompts = new Prompts_1.Prompts();
        this.wordArt = WordArt_1.wordArt;
    }
    generateOutputDirectories(baseOutputDirectory) {
        return {
            app: {
                base: baseOutputDirectory,
            },
            models: {
                base: baseOutputDirectory + '/src/models',
                mongo: baseOutputDirectory + '/src/models/db/mongodb',
                mongoIndexFile: baseOutputDirectory + '/src/models/db/mongodb/index.ts'
            },
            swagger: {
                base: baseOutputDirectory + '/src/common/swagger',
                index: baseOutputDirectory + '/src/common/swagger/index.yaml',
                tags: baseOutputDirectory + '/src/common/swagger/tags',
                tagsIndex: baseOutputDirectory + '/src/common/swagger/tags/index.yaml',
                definitions: baseOutputDirectory + '/src/common/swagger/definitions',
                definitionsIndex: baseOutputDirectory + '/src/common/swagger/definitions/index.yaml',
                paths: baseOutputDirectory + '/src/common/swagger/paths',
                pathsIndex: baseOutputDirectory + '/src/common/swagger/paths/index.yaml'
            },
            controller: {
                base: baseOutputDirectory + '/src/api/controllers',
                index: baseOutputDirectory + '/src/api/controllers/index.ts',
                routes: baseOutputDirectory + '/src/routes.ts'
            },
            service: {
                base: baseOutputDirectory + '/src/api/services',
                index: baseOutputDirectory + '/src/api/services/index.ts'
            }
        };
    }
}
exports.constants = new Constants();
//# sourceMappingURL=Constants.js.map