import { Prompts } from "./Prompts";
import { wordArt } from "./WordArt";

export interface IOutputDirectories {
    app: {
        base: string;
        injectables: string
    }
    models: {
        base: string;
        mongo: string;
        mongoIndexFile: string;
    },
    swagger: {
        base: string;
        index: string;
        tags: string;
        tagsIndex: string;
        definitions: string;
        definitionsIndex: string;
        paths: string;
        pathsIndex: string;
    },
    controller: {
        base: string;
        index: string;
        routes : string;
    },
    service : {
        base : string;
        index : string;
    }
}

class Constants {
    GENERATOR_NAME: string = 'wilbur';

    // File paths
    filePaths = {
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
                inversify : '/controller/inversify/class.controller.ejs',
                controller: '/controller/class.controller.ejs',
                router: '/controller/class.router.ejs',
                validator : '/controller/class.validator.ejs'
            },
            service : {
                base : '/service',
                inversify : '/service/inversify/class.service.ejs',
                service : '/service/class.service.ejs'
            },
            other : {
                base : '/other',
                gitIgnore : '/other/gitignore.ejs'
            }
        }
    }

    generateOutputDirectories(baseOutputDirectory: string): IOutputDirectories {
        return {
            app: {
                base: baseOutputDirectory,
                injectables : baseOutputDirectory + '/src/common/inversify/injectables.ts'
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
                routes : baseOutputDirectory + '/src/api/routes.ts'
            },
            service : {
                base : baseOutputDirectory + '/src/api/services',
                index : baseOutputDirectory + '/src/api/services/index.ts'
            }
        }
    }

    prompts = new Prompts();
    wordArt = wordArt;
}

export const constants = new Constants();