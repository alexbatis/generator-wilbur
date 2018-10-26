/*-----------------------------------IMPORTS---------------------------------*/
/*--------------------THIRD PARTY-------------------*/
import { validate, IsNotEmpty } from 'class-validator';
import { v4 as uuid } from 'uuid';
import { JsonProperty, JsonObject } from 'json2typescript';

/*--------------------INTERFACE---------------------*/
export interface IMemberVariableDecoratorParam {
    id?: string;
    name?: string;
    value?: any;
    type?: string;
}

/*-----------------------------------CLASS-----------------------------------*/
@JsonObject
export class MemberVariableDecoratorParam {
    /*--------------------MEMBER VARIABLES------------*/
    @IsNotEmpty()
    @JsonProperty('id', String)
    public id: string;

    @JsonProperty('name', String)
    @IsNotEmpty()
    name: string;

    @JsonProperty('value', String)
    @IsNotEmpty()
    value: any;

    @JsonProperty('type', String)
    type: string;

    /*--------------------CONSTRUCTOR-----------------*/
    constructor(memberVariableDecoratorParam?: IMemberVariableDecoratorParam) {
        this.id = (memberVariableDecoratorParam && memberVariableDecoratorParam.id) || uuid();
        this.name = (memberVariableDecoratorParam && memberVariableDecoratorParam.name) || null;
        this.value = (memberVariableDecoratorParam && memberVariableDecoratorParam.value) || null;
        this.type = (memberVariableDecoratorParam && memberVariableDecoratorParam.type) || 'any';
    }

    /*--------------------FUNCTIONS-------------------*/
    async validate() {
        const errors = await validate(this);
        if (errors.length) throw errors;
        return true;
    }
}
