const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "User", 
    columns: {
        id: {
            primary: true,
            type: "uuid",
            generated: true
        },
        name: {
            type: "varchar"
        }
    }
});