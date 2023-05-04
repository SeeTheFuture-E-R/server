const { sequelize, DataTypes } = require("./sequelize");

    const friend = sequelize.define(
        "friends",
        {
            friendId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            picturePath: {
                type: DataTypes.STRING,
            },
            expireDate: {
                type: DataTypes.DATE,
                
            }
        },
        {
            timestamps: false,
        }
    );

    module.exports = friend;
