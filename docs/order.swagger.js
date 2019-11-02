 /**
 * @swagger
 * 
 * /orders:
 *  post:
 *      description: Adds new order with status 'inprogress'
 *      produces:
 *          - application/json
 *      tags:
 *          - Orders
 *      parameters:
 *          - name: order
 *            description: New order
 *            in: body
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                  restaurant:
 *                      title: Restaurant ID
 *                      type: string
 *                      required: true
 *                      example: 5da5a2b7b779b616eb4566bf
 *                  note:
 *                      title: Order note
 *                      type: string
 *                      example: Order note
 *      responses:
 *          201:
 *              description: Order created
 */


/**
 * @swagger
 * 
 * /orders/:id:
 *  patch:
 *      description: Updates order status. Available statuses = inprogress -> 1, ready -> 2, finalised -> 3, canceled -> 4.
 *      produces:
 *          - application/json
 *      tags:
 *          - Orders
 *      parameters:
 *          - name: id
 *            description: Id of order to update
 *            in: path
 *            required: true
 *            type: string
 *          - name: status
 *            description: New status
 *            in: body
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                  status:
 *                      type: integer
 *                      format: int32
 *                      example: 2
 *                      minimum: 2
 *                      maximum: 4
 *      responses:
 *          200:
 *              description: Updated successfuly
 *          400:
 *              description: Status out of allowed range
 */


 /**
 * @swagger
 * 
 * /connect/:id:
 *  patch:
 *      description: Connects user to order
 *      produces:
 *          - application/json
 *      tags:
 *          - Orders
 *      parameters:
 *          - name: id
 *            description: Id of order to update
 *            in: path
 *            required: true
 *            type: string
 *          - name: status
 *            description: ID of user to connect to order. User must be of role 'customer'
 *            in: body
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                  user:
 *                      type: string
 *                      example: 5d9d984b4b20a80f9ffaec4b
 *      responses:
 *          204:
 *              description: Connected successfuly
 */