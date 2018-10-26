/*-----------------------------------IMPORTS---------------------------------*/
/*--------------------THIRD PARTY-------------------*/
import {
    validate,
    IsString,
    IsNotEmpty,
    IsArray,
    ValidateNested,
    ArrayMinSize,
    IsOptional
} from 'class-validator';
import { v4 as uuid } from 'uuid';
import { JsonProperty, JsonObject } from 'json2typescript';
/*--------------------CUSTOM------------------------*/
import { MemberVariable } from './MemberVariable';

/*--------------------INTERFACE---------------------*/
interface IClass {
    id?: string;
    name?: string;
    description?: string;
    memberVariables?: Array<MemberVariable>;
}

/*-----------------------------------CLASS-----------------------------------*/
@JsonObject
export class Class {
    /*--------------------MEMBER VARIABLES------------*/
    @IsNotEmpty()
    @JsonProperty('id', String)
    public id: string;

    @IsString()
    @IsNotEmpty()
    @JsonProperty('name', String)
    name: string;

    @IsString()
    @IsOptional()
    @JsonProperty('description', String)
    description?: string;

    @IsArray()
    @ValidateNested()
    @ArrayMinSize(1)
    @JsonProperty('memberVariables', [MemberVariable])
    memberVariables: Array<MemberVariable>;

    /*--------------------CONSTRUCTOR-----------------*/
    constructor(iclass?: IClass) {
        this.id = (iclass && iclass.id) || uuid();
        this.name = (iclass && iclass.name) || null;
        this.description = (iclass && iclass.description) || null;
        this.memberVariables = (iclass && iclass.memberVariables) || new Array<MemberVariable>();
    }

    /*--------------------FUNCTIONS-------------------*/
    async validate() {
        const errors = await validate(this);
        if (errors.length) throw errors;
        return true;
    }
}
