// import express from "express"
// import Book from "../models/Book.js"
// import BookTransaction from "../models/BookTransaction.js"

// const router = express.Router()

// router.post("/add-transaction", async (req, res) => {
//     try {
//         if (req.body.isAdmin === true) {
//             const newtransaction = await new BookTransaction({
//                 bookId: req.body.bookId,
//                 borrowerId: req.body.borrowerId,
//                 bookName: req.body.bookName,
//                 borrowerName: req.body.borrowerName,
//                 transactionType: req.body.transactionType,
//                 fromDate: req.body.fromDate,
//                 toDate: req.body.toDate
//             })
//             const transaction = await newtransaction.save()
//             const book = Book.findById(req.body.bookId)
//             await book.updateOne({ $push: { transactions: transaction._id } })
//             res.status(200).json(transaction)
//         }
//         else if (req.body.isAdmin === false) {
//             res.status(500).json("You are not allowed to add a Transaction")
//         }
//     }
//     catch (err) {
//         res.status(504).json(err)
//     }
// })

// router.get("/all-transactions", async (req, res) => {
//     try {
//         const transactions = await BookTransaction.find({}).sort({ _id: -1 })
//         res.status(200).json(transactions)
//     }
//     catch (err) {
//         return res.status(504).json(err)
//     }
// })

// router.put("/update-transaction/:id", async (req, res) => {
//     try {
//         if (req.body.isAdmin) {
//             await BookTransaction.findByIdAndUpdate(req.params.id, {
//                 $set: req.body,
//             });
//             res.status(200).json("Transaction details updated successfully");
//         }
//     }
//     catch (err) {
//         res.status(504).json(err)
//     }
// })

// router.delete("/remove-transaction/:id", async (req, res) => {
//     if (req.body.isAdmin) {
//         try {
//             const data = await BookTransaction.findByIdAndDelete(req.params.id);
//             const book = Book.findById(data.bookId)
//             console.log(book)
//             await book.updateOne({ $pull: { transactions: req.params.id } })
//             res.status(200).json("Transaction deleted successfully");
//         } catch (err) {
//             return res.status(504).json(err);
//         }
//     } else {
//         return res.status(403).json("You dont have permission to delete a book!");
//     }
// })

// export default router

import express from "express";
import Book from "../models/Book.js";
import BookTransaction from "../models/BookTransaction.js";

const router = express.Router();

// POST /api/transactions/add-transaction
router.post("/add-transaction", async (req, res) => {
    try {
        if (req.body.isAdmin === true) {
            const newTransaction = new BookTransaction({
                bookId: req.body.bookId,
                borrowerId: req.body.borrowerId,
                bookName: req.body.bookName,
                borrowerName: req.body.borrowerName,
                transactionType: req.body.transactionType,
                fromDate: req.body.fromDate,
                toDate: req.body.toDate
            });

            const transaction = await newTransaction.save();

            await Book.findByIdAndUpdate(req.body.bookId, {
                $push: { transactions: transaction._id }
            });

            res.status(200).json(transaction);
        } else {
            res.status(403).json("You are not allowed to add a Transaction");
        }
    } catch (err) {
        res.status(500).json(err.message);
    }
});

// GET /api/transactions/all-transactions
router.get("/all-transactions", async (req, res) => {
    try {
        const transactions = await BookTransaction.find({}).sort({ _id: -1 });
        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).json(err.message);
    }
});

// PUT /api/transactions/update-transaction/:id
router.put("/update-transaction/:id", async (req, res) => {
    try {
        if (req.body.isAdmin) {
            await BookTransaction.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json("Transaction details updated successfully");
        } else {
            res.status(403).json("You are not allowed to update a Transaction");
        }
    } catch (err) {
        res.status(500).json(err.message);
    }
});

// DELETE /api/transactions/remove-transaction/:id
router.delete("/remove-transaction/:id", async (req, res) => {
    try {
        if (req.body.isAdmin) {
            const transaction = await BookTransaction.findByIdAndDelete(req.params.id);
            if (!transaction) {
                return res.status(404).json("Transaction not found");
            }
            await Book.findByIdAndUpdate(transaction.bookId, {
                $pull: { transactions: req.params.id }
            });
            res.status(200).json("Transaction deleted successfully");
        } else {
            res.status(403).json("You are not allowed to delete a Transaction");
        }
    } catch (err) {
        res.status(500).json(err.message);
    }
});

export default router;
