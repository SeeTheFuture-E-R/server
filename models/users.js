
const { sequelize, DataTypes } = require("./sequelize");
    const User = sequelize.define(
        "users",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            userId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            handicap_precentage: {
                type: DataTypes.INTEGER,
            },
            points: {
                type: DataTypes.FLOAT,
            },
            phone: {
                type: DataTypes.STRING,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            birth_year: {
                type: DataTypes.DATE,
            },
            family_status: {
                type: DataTypes.ENUM("Married", "Divorcee","Separated","Widower", "Single"),
                // type: DataTypes.ENUM({10: "Single"}, {20:"Married"}, {30: "Divorcee"},{40: "Separated"},{50:"Widower"}),

            },
            num_of_children: {
                type: DataTypes.INTEGER,
            },
            identity_card: {
                type: DataTypes.STRING,
                
            },
            handicap_card: {
                type: DataTypes.STRING,
                
            },
            blind_card: {
                type: DataTypes.STRING,
                
            },
        },
        {
            timestamps: false,
        }
    );
module.exports= User;

