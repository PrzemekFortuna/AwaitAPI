/**
 * @swagger
 * 
 * /restaurants/register:
 *  post:
 *      description: Creates new restaurant
 *      produces:
 *          - application/json
 *      tags:
 *          - Restaurants
 *      parameters:
 *          - name: restaurant
 *            description: Restaurant data
 *            in: body
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                  email:
 *                      type: string
 *                      example: zahir@zahir.pl
 *                  password:
 *                      type: string
 *                      example: zahirkebab
 *                  name:
 *                      type: string
 *                      example: Zahir Kebab
 *                  city:
 *                      type: string
 *                      example: Łódź
 *                  address:
 *                      type: string
 *                      example: al. Politechniki 113
 *      responses:
 *          201:
 *              description: Restaurant created successfully
 */