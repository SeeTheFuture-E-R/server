const { sequelize, DataTypes } = require("./sequelize");

    const Book = sequelize.define(
        "books",
        {
            bookId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
            },
            picture: {
                type: DataTypes.STRING,
            },
            description: {
                type: DataTypes.STRING,
            },
            author: {
                type: DataTypes.STRING,
            },
            num_of_pages: {
                type: DataTypes.INTEGER,
            },
            userId: {
                type: DataTypes.INTEGER,
            },
            isLend: {
                type: DataTypes.BOOLEAN,
            },
            contact_details: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            address:{
                type: DataTypes.STRING,
                allowNull:false,
            }
        },
        {
            timestamps: false,
        }
    );
    
module.exports= Book;

