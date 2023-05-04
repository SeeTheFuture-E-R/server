
const db = require('../models/index')
const { Op } = require('sequelize')

const Book = db.books

class BookDal {
    getAllBooks = async (where) => {
        const books = await Book.findAll({
            where: { [Op.and]: where }
        })
        return (books)
    }

    addBook = async (newBook) => {
        const book = await Book.create(newBook)
        if (book) {
            return book
        }
    }

    deleteBook = async (bookId) => {

        await Book.destroy({
            where: {
                bookId: bookId
            }
        });

    }

    updateBook = async (bookId, newBook) => {

        const book = await Book.update(newBook, { where: { bookId: bookId } })

        return (book)
    }


    updatePicturePath = async (picture, bookId) => {
        
        await Book.update({ picture: picture }, { where: { bookId: bookId } })
        const book = await Book.findByPk(bookId)

        return (book)
    }

    getBooksByUserId = async (userId) => {

        const books = await Book.findAll({ where: { userId: userId } })
        return (books)
    }

    getBooksByBookId = async (bookId) => {

        const books = await Book.findOne({ where: { bookId: bookId } })
        return (books)
    }
}
const bookDal = new BookDal();
module.exports = bookDal;
