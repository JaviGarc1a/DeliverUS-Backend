'use strict'
const OrderController = require('../controllers/OrderController')
const OrderValidation = require('../controllers/validation/OrderValidation')

const multer = require('multer')
const upload = multer()

module.exports = (options) => {
  const app = options.app
  const middlewares = options.middlewares

  // TODO: Include routes for:
  // 1. Retrieving orders from current logged-in customer
  app.route('/orders')
    .get(
      middlewares.isLoggedIn,
      middlewares.hasRole('customer'),
      OrderController.indexCustomer
    )
  // 2. Creating a new order (only customers can create new orders)
  app.route('/orders')
    .post(
      middlewares.isLoggedIn,
      middlewares.hasRole('customer'),
      OrderValidation.create(),
      OrderController.create
    )

  app.route('/orders/:orderId/confirm')
    .patch(
      upload.none(),
      middlewares.isLoggedIn,
      middlewares.hasRole('owner'),
      middlewares.checkOrderOwnership,
      OrderValidation.confirm(),
      OrderController.confirm)

  app.route('/orders/:orderId/send')
    .patch(
      upload.none(),
      middlewares.isLoggedIn,
      middlewares.hasRole('owner'),
      middlewares.checkOrderOwnership,
      OrderValidation.send(),
      OrderController.send)

  app.route('/orders/:orderId/deliver')
    .patch(
      upload.none(),
      middlewares.isLoggedIn,
      middlewares.hasRole('owner'),
      middlewares.checkOrderOwnership,
      OrderValidation.deliver(),
      OrderController.deliver)

  app.route('/orders/:orderId')
    .get(
      middlewares.isLoggedIn,
      middlewares.checkOrderVisible,
      OrderController.show)
}
