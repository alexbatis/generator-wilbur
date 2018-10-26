/*-----------------------------------IMPORTS---------------------------------*/
/*--------------------THIRD PARTY-------------------*/
import {
    validate,
    IsNotEmpty,
    IsOptional,
    MinLength,
    ValidateNested
} from 'class-validator';
import { v4 as uuid } from 'uuid';
import { JsonProperty, JsonObject } from 'json2typescript';
/*--------------------CUSTOM------------------------*/
import { MemberVariableDecoratorParam } from './MemberVariableDecoratorParam';

/*--------------------INTERFACE---------------------*/
interface IMemberVariableDecorator {
    id?: string;
    name?: string;
    params?: Array<MemberVariableDecoratorParam>;
    selected?: boolean;
}

/*-----------------------------------CLASS-----------------------------------*/
@JsonObject
export class MemberVariableDecorator {
    /*--------------------MEMBER VARIABLES------------*/
    @IsNotEmpty()
    @JsonProperty('id', String)
    public id: string;

    @IsNotEmpty()
    @JsonProperty('name', String)
    name: string;

    @ValidateNested()
    @JsonProperty('params', [MemberVariableDecoratorParam])
    params: Array<MemberVariableDecoratorParam>;

    /*--------------------CONSTRUCTOR-----------------*/
    constructor(memberVariableDecorator?: IMemberVariableDecorator) {
        this.id = (memberVariableDecorator && memberVariableDecorator.id) || uuid();
        this.name = (memberVariableDecorator && memberVariableDecorator.name) || null;
        this.params =
            (memberVariableDecorator && memberVariableDecorator.params) ||
            new Array<MemberVariableDecoratorParam>();
    }

    /*--------------------FUNCTIONS-------------------*/
    async validate() {
        const errors = await validate(this);
        if (errors.length) throw errors;
        return true;
    }
}
