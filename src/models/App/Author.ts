/*-----------------------------------IMPORTS---------------------------------*/
/*--------------------THIRD PARTY-------------------*/
import {
    validate,
    IsString,
    IsNotEmpty,
    IsEmail
} from 'class-validator';
import { JsonProperty, JsonObject } from 'json2typescript';

/*--------------------INTERFACE---------------------*/
interface IAuthor {
    name?: string;
    email?: string;
    github?: string;
}

/*-----------------------------------CLASS-----------------------------------*/
@JsonObject
export class Author {
    /*--------------------MEMBER VARIABLES------------*/
    @IsString()
    @IsNotEmpty()
    @JsonProperty('name', String)
    name: string;

    @IsEmail()
    @IsNotEmpty()
    @JsonProperty('email', String)
    email: string;

    @IsString()
    @JsonProperty('github', String)
    github: string;

    /*--------------------CONSTRUCTOR-----------------*/
    constructor(author?: IAuthor) {
        this.name = (author && author.name) || null;
        this.email = (author && author.email) || null;
        this.github = (author && author.github) || null;
    }

    /*--------------------FUNCTIONS-------------------*/
    async validate() {
        const errors = await validate(this);
        if (errors.length) throw errors;
        return true;
    }
}
