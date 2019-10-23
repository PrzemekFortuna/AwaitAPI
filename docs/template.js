/**
 * @swagger
 * 
 * /endpoint:
 *  httpMethod:
 *      description: Updates order status
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
 */