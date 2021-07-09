---
to: src/api/<%= firstLower = name.charAt(0).toLowerCase() + name.substr(1) %>/<%= firstLower %>Model.ts
---


import { Sequelize, Model, DataTypes as DataTypesModule, HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasManyHasAssociationMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, Association } from 'sequelize';

export class <%= name %>Model extends Model {
    public id!: number;
    public ownerId!: number;
    <% if (softDelete) { %>public active!: number;
<% } %>
    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

}

export default (sequelize: Sequelize, DataTypes: typeof DataTypesModule) => {
    // TODO: Add any relevant database fields
    <%= name %>Model.init({
        id: {
            type:  DataTypes.INTEGER,
			primaryKey : true,
            autoIncrement : true
        },
        ownerId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }<% if (softDelete) { %>, 
        active: {
            type: DataTypes.INTEGER,
            allowNull: false
        }<% } %>
    }, {
        tableName: '<%= name.charAt(0).toLowerCase() + name.substr(1) %>',
        sequelize: sequelize, // this bit is important
    });
};