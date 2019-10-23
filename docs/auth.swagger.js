/**
 * @swagger
 * 
 * /auth/login:
 *  post:
 *      description: Logins user. Generates JWT token on successful login
 *      produces:
 *          - application/json
 *      tags:
 *          - Authorization
 *      parameters:
 *          - name: credentials
 *            description: Email and password
 *            in: body
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                  email:
 *                      type: string
 *                      example: user@test.pl
 *                  password:
 *                      type: string
 *                      example: password
 *      responses:
 *          200:
 *              description: Login successful. Returns JWT
 *          401:
 *              description: Login failed. Email and password doesn't match
 */