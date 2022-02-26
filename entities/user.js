const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "User", 
    columns: {
        id: {
            primary: true,
            type: "uuid",
            generated: true
        },
        firstName : {
            type: "varchar"
        },
        lastName:{
            type: "varchar"
        },
        userType: {
            type: "enum",
            enum: ["customer", "developer"]
        },
        email: {
            type:"varchar",
            unique: true
        },
        password: {
            type: "varchar"
        },
        createdAt:{
            type: "date",
            createdAt: true
        },
        updatedAt:{
            type: "date",
            updatedAt: true
        }
    },
    relations: {
        categories: {
            target: "Ticket",
            type: "one-to-many",
            joinTable: true,
            cascade: true
        }
    }
});