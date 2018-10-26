/*-----------------------------------IMPORTS---------------------------------*/
/*--------------------THIRD PARTY-------------------*/
import {
    validate,
    IsString,
    IsNotEmpty,
    IsBoolean,
    IsDefined,
    ValidateNested
} from 'class-validator';
import { v4 as uuid } from 'uuid';
import { JsonProperty, JsonObject } from 'json2typescript';
/*--------------------CUSTOM------------------------*/
import { Author } from './Author';
import { Class } from '../Class/Class';

/*--------------------INTERFACE---------------------*/
interface IApp {
    id?: string;
    appName?: string;
    description?: string;
    generateAngularProject?: boolean;
    author?: Author;
    classes?: Array<Class>;
}

/*-----------------------------------CLASS-----------------------------------*/
@JsonObject
export class App {
    /*--------------------MEMBER VARIABLES------------*/
    @JsonProperty('id', String)
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    @JsonProperty('appName', String)
    appName: string;

    @IsString()
    @IsNotEmpty()
    @JsonProperty('description', String)
    description: string;

    @IsBoolean()
    @IsDefined()
    @JsonProperty('generateAngularProject', Boolean)
    generateAngularProject: boolean;

    @IsDefined()
    @ValidateNested()
    @JsonProperty('author', Author)
    author: Author;

    @JsonProperty('classes', [Class])
    @ValidateNested()
    classes: Array<Class>;

    /*--------------------CONSTRUCTOR-----------------*/
    constructor(app?: IApp) {
        this.id = (app && app.id) || uuid();
        this.appName = (app && app.appName) || null;
        this.description = (app && app.description) || null;
        this.generateAngularProject = (app && app.generateAngularProject) || false;
        this.author = (app && app.author) || new Author();
        this.classes = (app && app.classes) || new Array<Class>();
    }

    /*--------------------FUNCTIONS-------------------*/
    async validate() {
        const errors = await validate(this);
        if (errors.length) throw errors;
        return true;
    }
}
