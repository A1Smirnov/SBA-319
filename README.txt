MongoDB validation

db.createCollection("buildings", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["type", "resources", "constructionCost", "owner"],
      properties: {
        type: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        resources: {
          bsonType: "object",
          required: ["energy", "money"],
          properties: {
            energy: { bsonType: "int", minimum: 0, description: "must be an integer >= 0" },
            money: { bsonType: "int", minimum: 0, description: "must be an integer >= 0" }
          }
        },
        constructionCost: {
          bsonType: "object",
          required: ["energy", "money"],
          properties: {
            energy: { bsonType: "int", minimum: 0, description: "must be an integer >= 0" },
            money: { bsonType: "int", minimum: 0, description: "must be an integer >= 0" }
          }
        },
        owner: {
          bsonType: ["null", "objectId"],
          description: "must be an ObjectId or null"
        }
      }
    }
  }
})


