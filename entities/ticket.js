const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "Ticket", 
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        name: {
            type: "varchar"
        }
    }
});