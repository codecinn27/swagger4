/**
* @swagger
* /login:
*  post:
*    tags: 
*        - Login
*    summary: Login for admin or host
*    description: Once login authenticate a user and generate a JWT token
*    requestBody:
*      required: true
*      content: 
*          application/json:
*              schema:
*                  type: object
*                  properties:
*                      username:
*                          type: string
*                      password:
*                          type: string
*    responses:
*      200:   
*          description: Successful login
*          schema: 
*              type: object    
*              properties:
*                  token: 
*                      type: string
*                      description: JWT token for authentication
*                  category: 
*                      type: string
*                      description: User category (host or admin)
*                  redirectLink:
*                      type: string
*                      description: Redirect link based on user category
*                  GET:
*                      type: string
*                      description: URL to be used for redirection
*                  Authorization:
*                      type: string
*                      description: JWT token for authorization
*                  Content-Type: 
*                      type: string
*                      description: Response content type
*      401:
*          description: Invalid credentials
*          schema: 
*              type: object
*              properties:
*                  error:  
*                      type: string
*                      description: Error message
*                      example: Invalid credentials
*      500: 
*          description: Internal Server Error
*          schema: 
*              type: object
*              properties: 
*                  error:
*                      type: string
*                      description: Error message
*                      example: Internal Server Error
*          
* 
*      
*/
const express = require('express');
const router = express.Router();
const User = require('../model/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// POST route for user login
router.post('/',async(req, res) =>{
    try {
      // Implement your login logic (e.g., validate credentials against the database)
      const { username, password } = req.body;
      const user = await User.findOne({username});
  
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      // Compare the provided password with the hashed password using bcrypt
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
          return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      // Generate a JWT token
      const token = jwt.sign({ userId: user._id, category: user.category }, 'vms2', {
        expiresIn: '1h',
      });
  
      // Check the user's category and generate the appropriate link
      let redirectLink;
      if (user.category === 'host') {
          redirectLink = `/host/${user._id}`;
      } else if (user.category === 'admin') {
          redirectLink = `/admin`;
      }
  
  
      console.log("JWT:",token);
      res.json({
          token,
          category: user.category,
          redirectLink,
          "GET": `http://localhost:3000${redirectLink}`,
          Authorization: token,
          "Content-Type": "application/json",
        });
        
        
    } catch (error) {
      console.error('Error during login:', error);
        // Log additional information about the error
      console.error('Error Stack:', error.stack);
      // Handle different types of errors
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: 'Invalid input data' });
      } else {
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  });

module.exports = router;
