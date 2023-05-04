const { sequelize, DataTypes } = require("./sequelize");

    const Purchase = sequelize.define(
        "purchases",
        {
            purchaseId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            date: {
                type: DataTypes.DATE,
            },
            userId: {
                type: DataTypes.INTEGER,
            },
            final_price: {
                type: DataTypes.FLOAT,
            }
        },
        {
            timestamps: false,
        }
    );

module.exports= Purchase;

