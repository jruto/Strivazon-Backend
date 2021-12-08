import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import { validationResult } from 'express-validator'
import { reviewsValidation } from './reviewsValidation.js'
import createHttpError from 'http-errors'
import striptags from 'striptags'
import { getProducts, saveProducts } from '../library/fs-tools.js'

const reviewsRouter = express.Router({ mergeParams: true })

//endpoints
reviewsRouter.post('/', reviewsValidation, async (req, res, next) => {
    try {
        const errorList = validationResult(req)
        if (!errorList.isEmpty()) {
            next(createHttpError(400, "There some errors on your submission, namely: ", { errorList }))
        } else {
            const products = await getProducts()
            const currentIndex = products.findIndex(product => product.id === req.params.productId)
            const newComment = { ...req.body, createdAt: new Date(), id: uuidv4(), productId: req.params.productId }
            if (products[currentIndex].reviews) {
                products[currentIndex].reviews.push(newComment)
            } else {
                products[currentIndex].reviews = []
                products[currentIndex].reviews.push(newComment)
            }
            await saveProducts(products)
            res.status(201).send(`Comment added successfully to ${ products[currentIndex].name }`)

        }
    } catch (error) {
        next(error)
    }
})


// reviewsRouter .post('/', reviewsValidation , async (req, res, next) => {
//     try {
//         const errorList = validationResult(req)
//         if (!errorList.isEmpty()) {
//             next(createHttpError(400, "There some errors on your submission, namely: ", { errorList }))
//         } else {const reviews = await getReviews()
//             const currentReview = reviews.find(review => review.id === req.params.productId)
//             const newComment = { ...req.body, createdAt: new Date(), id: uuidv4(), productId: req.params.productId }
//             if (currentIndex.reviews) {
//                 currentIndex.reviews.push(newComment)
//             } else {
//                 currentIndex.reviews = []
//                 currentIndex.reviews.push(newComment)
//             }
//             reviews.push(currentReview)
//             await postReviews(reviews)
//             res.status(201).send(`Comment added successfully to blog post with id ${ req.params.productId }`)

//         }
//     } catch (error) {
//         next(error)
//     }
// })

reviewsRouter.get('/', async (req, res, next) => {
    try {
        const products = await getProducts()
        const selectedProduct = products.find(product => product.id === req.params.productId)
        res.send(selectedProduct.reviews)
    } catch (error) {
        next(error)
    }
})

reviewsRouter.get('/:reviewId', async (req, res, next) => {
    try {
        const products = await getProducts()
        const selectedProduct = products.find(product => product.id === req.params.productId)
        const selectedReview = selectedProduct.reviews.find(review => review.id === req.params.reviewId)
        res.send(selectedReview)
    } catch (error) {
        next(error)
    }
})

reviewsRouter.put('/:reviewId', async (req, res, next) => {
    try {
        const products = await getProducts()
        const selectedProduct = products.find(product => product.id === req.params.productId)
        const reviewToEditIndex = selectedProduct.reviews.findIndex(review => review.id === req.params.reviewId)
        const editedReview = { ...selectedProduct.reviews[reviewToEditIndex], ...req.body, updatedAt: new Date() }
        selectedProduct.reviews[reviewToEditIndex] = editedReview
        await saveProducts(products)
        res.send(editedReview)
    } catch (error) {
        next(error)
    }
})

reviewsRouter.delete('/:reviewId', async (req, res, next) => {
    try {
        const products = await getProducts()
        const selectedProduct = products.find(product => product.id === req.params.productId)
        const remainingReviewsArray = selectedProduct.reviews.filter(review => review.id !== req.params.reviewId)
        selectedProduct.reviews = remainingReviewsArray
        await saveProducts(products)
        res.status(204).send()
    } catch (error) {
        next(error)
    }
})



export default reviewsRouter