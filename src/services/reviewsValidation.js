import { body } from 'express-validator'

export const reviewsValidation = [
    body("comment").exists().withMessage("leave your comment to our product!"),
    body("rate").exists().withMessage("rate our product!")
]





// "comment": "A good book but definitely I don't like many parts of the plot", //REQUIRED
//         "rate": 3, //REQUIRED, max 5
//         "productId": "5d318e1a8541744830bef139", //REQUIRED
