const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "Ticket", 
    columns: {
        id: {
            primary: true,
            type: "uuid",
            generated: true
        },
        description : {
            type: "varchar",
            length: 255
        },
        creatorID:{
            type: "varchar"
        },
        assigneeID:{
            type: "varchar"
        },
        status: {
            type: "enum",
            enum: ["todo", "done"],
            default:"todo"
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
            target: "User",
            type: "many-to-one",
            joinTable: true,
            cascade: true
        }
    }
});