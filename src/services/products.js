import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import { validationResult } from 'express-validator'
import { productValidation } from './productValidation.js'
import createHttpError from 'http-errors'
import { saveProducts, saveProductImage, getProducts } from '../library/fs-tools.js'

const productsRouter = express.Router({ mergeParams: true })

productsRouter.post('/', productValidation, async (req, res, next) => {
    try {
        const errorList = validationResult(req)
        if (!errorList.isEmpty()) {
            next(createHttpError(400, "There some errors on your submission, namely: ", { errorList }))
        } else {
            const productsArray = await getProducts()
            const newProduct = { ...req.body, id: uuidv4(), 
                info: "The phone comes with a 2.40-inch display with a resolution of 240x320 pixels. Nokia 3310 4G comes with 256MB of RAM. The Nokia 3310 4G runs Android and is powered by a 1200mAh removable battery. As far as the cameras are concerned, the Nokia 3310 4G on the rear packs 2-megapixel camera.",
                image: 'https://drop.ndtv.com/TECH/product_database/images/2152017124957PM_635_nokia_3310.jpeg?downsize=*:420&output-quality=80', createdAt: new Date(), updatedAt: new Date() }
            productsArray.push(newProduct)
            await saveProducts(productsArray)
            res.status(201).send({ id: newProduct.id })
        }
    } catch (error) {
        next(error)
    }
})

productsRouter.get('/', async (req, res, next) => {
    try {
        const productsArray = await getProducts()
        if (req.query && req.query.name) {
            const filteredProducts = productsArray.filter(product => product.name.includes(req.query.name))
            res.send(filteredProducts)
        } else {
            res.send(productsArray)
        }
    } catch (error) {
        next(error)
    }
})

productsRouter.get('/:productId', async (req, res, next) => {
    try {
        const productsArray = await getProducts()
        const selectedProduct = productsArray.find(product => product.id === req.params.productId)
        if (selectedProduct) {
            res.send(selectedProduct)
        } else {
            next(createHttpError(404, "The product you're searching for doesn't exist."))
        }
    } catch (error) {
        next(error)
    }
})

productsRouter.put('/:productId', async (req, res, next) => {
    try {
        const productsArray = await getProducts()
        const index = productsArray.findIndex(product => product.id === req.params.productId)
        const editedProduct = { ...productsArray[index], ...req.body, updatedAt: new Date() }
        productsArray[index] = editedProduct
        await saveProducts(productsArray)
        res.send(editedProduct)
    } catch (error) {
        next(error)
    }
})

productsRouter.delete('/:productId', async (req, res, next) => {
    try {
        const productsArray = await getProducts()
        const remainingProductsArray = productsArray.filter(product => product.id !== req.params.productId)
        await saveProducts(remainingProductsArray)
        res.status(204).send()
    } catch (error) {
        next(error)
    }
})



export default productsRouter