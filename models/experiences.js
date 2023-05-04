const { sequelize, DataTypes } = require("./sequelize");

    const Experience = sequelize.define(
        "experiences",
        {
            experienceId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },

            productId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            expireDate: {
                type: DataTypes.DATE,
                allowNull: false,
            }, 
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                
            },
        },
        {
            timestamps: false,
        }
    );
module.exports = Experience;