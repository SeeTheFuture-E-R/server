const { sequelize, DataTypes } = require("./sequelize");

    const Purchase_details = sequelize.define(
        "purchase_details",
        {
            id:{
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            }, 
            // productId: {
            //     type: DataTypes.INTEGER,
            // },
            count: {
                type: DataTypes.INTEGER,
            },
            price: {
                type: DataTypes.FLOAT,
            },
            discount_precentage: {
                type: DataTypes.FLOAT,
            },
        },
        {
            timestamps: false,
        }
    );
module.exports= Purchase_details;

