
const { sequelize } = require("./sequelize");

const applyExtraSetup = () => {

    const { users, books, friends, products, purchase_details, purchases, experiences } = sequelize.models;

    purchases.belongsTo(users);
    users.hasMany(purchases);

    friends.belongsTo(users);
    users.hasMany(friends);

    experiences.belongsTo(products);
    products.hasMany(experiences);

    experiences.belongsTo(users);
    users.hasMany(experiences);

    books.belongsTo(users);
    users.hasMany(books);

    purchase_details.belongsTo(products);
    products.hasMany(purchase_details);

    purchase_details.belongsTo(purchases);
    purchases.hasMany(purchase_details);

};

module.exports = { applyExtraSetup };


