/**
* @swagger
* /admin/visits:
*   get:
*     summary: Get all visits data 
*     description: Retrieve all visit data 
*     tags: [Admin]
*     responses:
*       200:
*         description: Successful operation
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Visit'
*       401:
*         description: Unauthorized - Invalid or missing token
*       403:
*         description: Forbidden - Insufficient permissions
*       500:
*         description: Internal Server Error
*/


/**
* @swagger
* /admin/registerHost:
*   post:
*     tags:
*       - Admin
*     summary: Register a new host
*     description: Register a new host in the system (admin access required).
*     security:
*       - Authorization: []
*     requestBody:
*          required: true
*          content: 
*              application/json:
*                  schema:
*                      type: object
*                      properties:
*                          username:
*                              type: string
*                          password:
*                              type: string
*                          email:
*                              type: string
*                          phoneNumber:
*                              type: Number
*                      required:
*                          - username
*                          - password
*                          - email
*                          - phoneNumber
*     responses:
*       201:
*         description: Host registered successfully
*       400:
*         description: Bad Request - Invalid request payload
*       401:
*         description: Unauthorized - Invalid or missing token
*       403:
*         description: Forbidden - Insufficient permissions
*       500:
*         description: Internal Server Error
* 
* definitions:
*   HostRegistration:
*     type: object
*     properties:
*       username:
*         type: string
*         description: Host's username
*         example: john_doe
*       password:
*         type: string
*         description: Host's password
*         example: my_secure_password
*       email:
*         type: string
*         description: Host's email
*         example: john@example33.com
*       phoneNumber:
*         type: number
*         description: Host's phone number
*         example: 1234567890
*/



const express = require('express');
const router = express.Router();
const Visit = require('../model/visit');

router.get('/visits',async(req,res)=>{
    try {
        const allVisits = await Visit.find({});
        res.send(allVisits);
    } catch (error) {
        console.error('Error fetching visits:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }  
});




module.exports = router;