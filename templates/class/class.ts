<% 
const modelNameLowerCaseFirst = model.name.charAt(0).toLowerCase() + model.name.substring(1);

function createAdditionalModelImportsString(){
    additionalModelTypes = [];
    model.memberVariables.forEach(memberVariable => {
        if(memberVariable.type !== 'string'
        && memberVariable.type !== 'number'
        && memberVariable.type !== 'boolean'
        && memberVariable.type !== 'object'
        && memberVariable.type !== model.name)
        additionalModelTypes.push(memberVariable.type);
    });
    if(!additionalModelTypes.length) return null;
    let additionalModelsImportString = "import { ";
    additionalModelTypes.forEach(type =>{
        additionalModelsImportString += `${type}, `;
    })
    additionalModelsImportString = additionalModelsImportString.substring(0, additionalModelsImportString.length - 2);
    additionalModelsImportString = `${additionalModelsImportString} } from "@models";`;
    return additionalModelsImportString
}

function createConstructorString(memberVariable){
    memberVariablestring = ``;
    if(memberVariable.type !== 'string'
    && memberVariable.type !== 'number'
    && memberVariable.type !== 'boolean'
    && memberVariable.type !== 'object'){
        memberVariablestring = (memberVariable.isArray)
        ? `this.${memberVariable.name} = (${modelNameLowerCaseFirst} && ${modelNameLowerCaseFirst}.${memberVariable.name} && ${modelNameLowerCaseFirst}.${memberVariable.name}.length) ? new Array<${memberVariable.type}>() : null;
        if (this.${memberVariable.name}) ${modelNameLowerCaseFirst}.${memberVariable.name}.forEach(item => { this.${memberVariable.name}.push(new ${memberVariable.type}(item)); });`
        : `this.${memberVariable.name} = (${modelNameLowerCaseFirst} && ${modelNameLowerCaseFirst}.${memberVariable.name}) ? new ${memberVariable.type}(${modelNameLowerCaseFirst}.${memberVariable.name}) : null;`
    } else if (memberVariable.type === 'boolean')
            memberVariablestring = `this.${memberVariable.name} = (${modelNameLowerCaseFirst} && typeof ${modelNameLowerCaseFirst}.${memberVariable.name} !== "undefined") ? ${modelNameLowerCaseFirst}.${memberVariable.name} : null;`
    else
        memberVariablestring = `this.${memberVariable.name} = ${modelNameLowerCaseFirst} && ${modelNameLowerCaseFirst}.${memberVariable.name} || null;`
    return memberVariablestring
}

function createUpdateString(memberVariable){
    memberVariablestring = ``;
    if(memberVariable.type !== 'string'
    && memberVariable.type !== 'number'
    && memberVariable.type !== 'boolean'
    && memberVariable.type !== 'object'){
        memberVariablestring = (memberVariable.isArray)
        ? `this.${memberVariable.name} = (${modelNameLowerCaseFirst} && ${modelNameLowerCaseFirst}.${memberVariable.name} && ${modelNameLowerCaseFirst}.${memberVariable.name}.length) ? new Array<${memberVariable.type}>() : null;
        if (this.${memberVariable.name}) ${modelNameLowerCaseFirst}.${memberVariable.name}.forEach(item => { this.${memberVariable.name}.push(new ${memberVariable.type}(item)); });`
        : `this.${memberVariable.name} = (${modelNameLowerCaseFirst} && ${modelNameLowerCaseFirst}.${memberVariable.name}) ? new ${memberVariable.type}(${modelNameLowerCaseFirst}.${memberVariable.name}) : null;`
    } else if (memberVariable.type === 'boolean')
            memberVariablestring = `this.${memberVariable.name} = (${modelNameLowerCaseFirst} && typeof ${modelNameLowerCaseFirst}.${memberVariable.name} !== "undefined") ? ${modelNameLowerCaseFirst}.${memberVariable.name} : null;`
    else
        memberVariablestring = `this.${memberVariable.name} = ${modelNameLowerCaseFirst} && ${modelNameLowerCaseFirst}.${memberVariable.name} || this.${memberVariable.name};`
    return memberVariablestring
}


function createDecoratorString(decorator) {
    if(decorator.name === 'IsUnique') return;
    if (!decorator.params.length) return `@${decorator.name}()`;
    let paramsString = "";
    decorator.params.forEach(param => {
        paramsString += `${param.value}, `;
    });
    paramsString = paramsString.substring(0, paramsString.length - 1);
	if(paramsString.charAt(paramsString.length-1) === ",")
		paramsString = paramsString.substring(0,paramsString.length - 1);
    
    paramsString = `@${decorator.name}(${paramsString})`;
    return paramsString;
}

let decoratorArray = ['validate'];
model.memberVariables.forEach((memberVariable, index) => {
    model.memberVariables[index].decoratorStrings = [];
    memberVariable.decorators.forEach(decorator => {
        if(decorator.name === 'IsUnique') return;
        if (decoratorArray.indexOf(decorator.name) === -1 && decoratorArray.indexOf(" " + decorator.name) === -1)
            decoratorArray.push(" " + decorator.name);
        model.memberVariables[index].decoratorStrings.push(createDecoratorString(decorator));
    });
});
decoratorArray = decoratorArray.join(",");
-%>
/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */
/* ------------------------------- THIRD PARTY ------------------------------ */
import { prop, getModelForClass } from "@typegoose/typegoose";
import { JsonObject, JsonProperty } from "json2typescript";
import { <%- decoratorArray %> } from "class-validator";
<%- createAdditionalModelImportsString() %>

/* ---------------------------- PARTIAL INTERFACE --------------------------- */
interface I<%- model.name %> {
<% for (var i = 0; i < model.memberVariables.length; i++) { -%>
    <%- model.memberVariables[i].name %>?: <%if (model.memberVariables[i].isArray == true) {%>Array<<%}%><%- model.memberVariables[i].type %><%if (model.memberVariables[i].isArray == true) {%>><%}%>;
<% } -%>
}


/* -------------------------------------------------------------------------- */
/*                              CLASS DEFINITION                              */
/* -------------------------------------------------------------------------- */
@JsonObject
export class <%- model.name %> {
    /* ---------------------------- MEMBER VARIABLES ---------------------------- */
<% for (var i = 0; i < model.memberVariables.length; i++) { -%>
    <% for (var j = 0; j < model.memberVariables[i].decoratorStrings.length; j++) { -%><%- model.memberVariables[i].decoratorStrings[j] -%>

    <% } -%>@JsonProperty("<%- model.memberVariables[i].name -%>", <%if (model.memberVariables[i].isArray == true) {%>[<%}%><%- model.memberVariables[i].type.charAt(0).toUpperCase() + model.memberVariables[i].type.substring(1) -%><%if (model.memberVariables[i].isArray == true) {%>]<%}%>)
    @prop(<%if (model.memberVariables[i].decorators.find(d => d.name === 'IsUnique')) {%>{ unique: true }<%}%>)
    <%- model.memberVariables[i].name %>: <%if (model.memberVariables[i].isArray == true) {%>Array<<%}%><%- model.memberVariables[i].type %><%if (model.memberVariables[i].isArray == true) {%>><%}%>;

<% } -%>
    /* ------------------------------- CONSTRUCTOR ------------------------------ */
    constructor(<%- modelNameLowerCaseFirst %>?: I<%- model.name %>) {
    <% for (var i = 0; i < model.memberVariables.length; i++) { -%>
    <%- createConstructorString(model.memberVariables[i]) %>
    <% } -%>
}

    /* --------------------------------- METHODS -------------------------------- */
    async validateInstance() {
        const errors = await validate(this);
        if (errors.length) throw errors;
        return true;
    }

    async updateAndValidate(updated<%- model.name  %>?: I<%- model.name %>) {
    <% for (var i = 0; i < model.memberVariables.length; i++) { -%>
    this.<%- model.memberVariables[i].name %> = updated<%- model.name %> && updated<%- model.name %>.<%- model.memberVariables[i].name %> || this.<%- model.memberVariables[i].name %>;
    <% } -%>
    await this.validateInstance();
        return true;
    }
}


/* ----------------------------- TYPEGOOSE MODEL ---------------------------- */
export const <%- model.name %>Model = getModelForClass(<%- model.name %>, { schemaOptions: { timestamps: true } });
