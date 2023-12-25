const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require('swagger-jsdoc');
const Visit = require('./model/visit');
const User = require('./model/user');
const Visitor = require('./model/visitor');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
app.use(express.json())

mongoose.connect('mongodb+srv://codecinnpro:9qLtJIAG9k8G1Pe8@cluster0.egrjwh1.mongodb.net/vms_2?retryWrites=true&w=majority')
.then(()=>{
    console.log('connected to mongodb');
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
     })
}).catch((error)=>{
    console.log(error);
})

const options = {
    definition:{
        openapi: "3.0.3",
        info:{
            title: "Visitor Management System BERR G6",
            version: "0.1",
            description:"Visitor Management System with admin, host, visitors. A system to issue visitors pass and store the record into the cloud database, Mongodb Atlas.",
            contact:{
                name: "Hee Yee Cinn",
                url:"cinn.com",
                email:"b022110115@student.utem.edu.my"
            },

        },
        tags:[
            {name:'Login', description:"Default endpoints"},
            {name: 'Admin', description:"Admin operation"},
            {name: 'Host', description:"Host operation"},
        ],
        components:{
            securitySchemes:{
                Authorization:{
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    value: "Bearer <JWT token here>",
                    description: "This is for authentication, you must logout to change the JWT token"
                }
            }
        },

    },
    //all the route.js file store inside the route file 
    apis:["./swagger.js"],
};
const spacs = swaggerJSDoc(options);
app.use("/g6", swaggerUi.serve, swaggerUi.setup(spacs));

app.get('/', (req, res) => {
    res.send('Hello World!')
 })
 
app.get('/admin/visits',async(req,res)=>{
    try {
        const allVisits = await Visit.find({});
        res.send(allVisits);
    } catch (error) {
        console.error('Error fetching visits:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }  
});

// // POST route for user login
// app.post('/login',async(req, res) =>{
//     try {
//       // Implement your login logic (e.g., validate credentials against the database)
//       const { username, password } = req.body;
//       const user = await User.findOne({username});
  
//       if (!user) {
//         return res.status(401).json({ error: 'Invalid credentials' });
//       }
  
//       // Compare the provided password with the hashed password using bcrypt
//       const isPasswordValid = await bcrypt.compare(password, user.password);
  
//       if (!isPasswordValid) {
//           return res.status(401).json({ error: 'Invalid credentials' });
//       }
  
//       // Generate a JWT token
//       const token = jwt.sign({ userId: user._id, category: user.category }, 'vms2', {
//         expiresIn: '1h',
//       });
  
//       // Check the user's category and generate the appropriate link
//       let redirectLink;
//       if (user.category === 'host') {
//           redirectLink = `/host/${user._id}`;
//       } else if (user.category === 'admin') {
//           redirectLink = `/admin`;
//       }
  
  
//       console.log("JWT:",token);
//       res.json({
//           token,
//           category: user.category,
//           redirectLink,
//           Authorization: token,
//           "Content-Type": "application/json",
//         });
        
        
//     } catch (error) {
//       console.error('Error during login:', error);
//         // Log additional information about the error
//       console.error('Error Stack:', error.stack);
//       // Handle different types of errors
//       if (error.name === 'ValidationError') {
//         return res.status(400).json({ error: 'Invalid input data' });
//       } else {
//         return res.status(500).json({ error: 'Internal Server Error' });
//       }
//     }
// });

// app.get('/:hostId', async (req, res) => {
//     try {
//       const { hostId } = req.params;
  
//       // Assuming hostId is the user's ID
//       const user = await User.findById(hostId);
  
//       if (!user) {
//         return res.status(404).json({ error: 'User not found' });
//       }
  
//       const { username } = user;
//       res.json({ message: `Welcome, ${username}!` });
//     } catch (error) {
//       console.error('Error getting welcome message:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
// })

// app.get('/:hostId/visitor',async (req, res) => {
//     try {
//       // Assuming req.user is populated by your authentication middleware
//       const { userId } = req.user;
  
//       // Find the host by userId
//       const host = await User.findById(userId);
  
//       if (!host) {
//         return res.status(404).json({ error: 'Host not found' });
//       }
  
//       // Get visitors registered under the host
//       const visitors = host.visitors;
  
//       res.json({ visitors });
//     } catch (error) {
//       console.error('Error getting visitors:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
// })



