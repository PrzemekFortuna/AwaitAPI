/**
 * @swagger
 * 
 * /users/register:
 *  post:
 *      description: Registers new user
 *      produces:
 *          - application/json
 *      tags:
 *          - Users
 *      parameters:
 *          - name: user
 *            description: New user data
 *            in: body
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                  name:
 *                      type: string
 *                      example: Jan
 *                  lastname:
 *                      type: string
 *                      example: Kowalski
 *                  email:
 *                      type: string
 *                      example: jan.kowalski@test.pl
 *                      required: true
 *                  password:
 *                      type: string
 *                      example: password1
 *                      required: true
 *      responses:
 *          201:
 *              description: User created successfuly
 *          400:
 *              description: Email or password is missing
 */

 /**
 * @swagger
 * 
 * /users/:id:
 *  get:
 *      description: Gets user with given ID
 *      produces:
 *          - application/json
 *      tags:
 *          - Users
 *      parameters:
 *          - name: id
 *            description: Id of user to get
 *            in: path
 *            required: true
 *            type: string
 *      responses:
 *          200:
 *              description: User exists
 *          404:
 *              description: User doesn't exist
 */

 /**
 * @swagger
 * 
 * /users/:id:
 *  patch:
 *      description: Updates token of user with given ID
 *      produces:
 *          - application/json
 *      tags:
 *          - Users
 *      parameters:
 *          - name: id
 *            description: Id of user to update
 *            in: path
 *            required: true
 *            type: string
 *          - name: token
 *            description: New value of token
 *            in: body
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                  token:
 *                      type: string
 *                      example: asduq@dasda!23$ah
 *      responses:
 *          204:
 *              description: User updated successfuly
 *          400:
 *              description: New token cannot be null
 */