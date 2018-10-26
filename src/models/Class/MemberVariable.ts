/*-----------------------------------IMPORTS---------------------------------*/
/*--------------------THIRD PARTY-------------------*/
import {
    validate,
    IsNotEmpty,
    ValidateNested
} from 'class-validator';
import { v4 as uuid } from 'uuid';
import { JsonProperty, JsonObject } from 'json2typescript';
/*--------------------CUSTOM------------------------*/
import { MemberVariableDecorator } from './MemberVariableDecorator';

/*--------------------INTERFACE---------------------*/
interface IMemberVariable {
    id?: string;
    name?: string;
    type?: string;
    isArray?: boolean;
    decorators?: Array<MemberVariableDecorator>;
}

/*-----------------------------------CLASS-----------------------------------*/
@JsonObject
export class MemberVariable {
    /*--------------------MEMBER VARIABLES------------*/
    @IsNotEmpty()
    @JsonProperty('id', String)
    public id: string;

    @IsNotEmpty()
    @JsonProperty('name', String)
    name: string;

    @IsNotEmpty()
    @JsonProperty('type', String)
    type: string;

    @IsNotEmpty()
    @JsonProperty('isArray', Boolean)
    isArray: boolean;

    @IsNotEmpty()
    @ValidateNested()
    @JsonProperty('decorators', [MemberVariableDecorator])
    decorators: Array<MemberVariableDecorator>;

    /*--------------------CONSTRUCTOR-----------------*/
    constructor(memberVariable?: IMemberVariable) {
        this.id = (memberVariable && memberVariable.id) || uuid();
        this.name = (memberVariable && memberVariable.name) || null;
        this.type = (memberVariable && memberVariable.type) || null;
        this.isArray = (memberVariable && memberVariable.isArray) || false;
        this.decorators = (memberVariable && memberVariable.decorators) || new Array<MemberVariableDecorator>();
    }

    /*--------------------FUNCTIONS-------------------*/
    async validate() {
        const errors = await validate(this);
        if (errors.length) throw errors;
        return true;
    }
}
