import express from 'express'
import listEndpoints from 'express-list-endpoints'
import authorsRouter from './services/authors.js'
import blogPostsRouter from './services/blogPosts.js'
import blogCommentsRouter from './services/blogComments.js'
import blogCoversRouter from './services/blogCovers.js'
import authorAvatarsRouter from './services/authorAvatars.js'
import productsRouter from './services/products.js'
import reviewsRouter from './services/reviews.js'
import productImageRouter from './services/productImage.js'
import cors from 'cors'
import { badRequestHandler, unauthorisedHandler, notFoundHandler, genericErrorHandler } from './errorHandlers.js'
import { join } from 'path'

const server = express()

const port = process.env.PORT


const publicFolderPath = join(process.cwd(), "./public")
//middleware
server.use(express.static(publicFolderPath))

const whiteList = [process.env.FE_LOCAL_URL, process.env.FE_REMOTE_URL]

const corsOptions = {
  origin: function (origin, next) {
    // since CORS is a GLOBAL middleware, it is going to be executed for each and every request --> we are going to be able to determine the origin of each and every request we are receiving
    console.log("ORIGIN: ", origin)

    if (!origin || whiteList.indexOf(origin) !== -1) {
      // if origin is included in the whitelist --> OK
      next(null, true)
    } else {
      // If origin is NOT in the whitelist --> trigger a CORS error
      next(new Error("CORS ERROR!"))
    }
  },
}
server.use(cors(corsOptions)) //we need this to connect front end with back end --> more on this next week
server.use(express.json())

//endpoints
// server.use('/authors', authorsRouter)
// server.use('/authors/:authorId/uploadAvatar', authorAvatarsRouter)
// server.use('/blogPosts', blogPostsRouter)
// server.use('/blogPosts/:postId/comments', blogCommentsRouter)
// server.use('/blogPosts/:postId/uploadCover', blogCoversRouter)
server.use('/products', productsRouter)
server.use('/products/:productId/reviews', reviewsRouter)
server.use('/products/:productId', productImageRouter)

//error handlers
server.use(badRequestHandler)
server.use(unauthorisedHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

console.table(listEndpoints(server))

server.listen(port, () => {
    console.log(`Server running on port: ${ port }`)
})