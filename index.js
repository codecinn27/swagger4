const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require('swagger-jsdoc');
//const loginRouter = require('./routes/login');
const adminRouter = require('./routes/admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Visitor = require('./model/visitor');
const User = require('./model/user');
app.use(express.json())

mongoose.connect('mongodb+srv://codecinnpro:9qLtJIAG9k8G1Pe8@cluster0.egrjwh1.mongodb.net/vms_2?retryWrites=true&w=majority')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open",()=>{
    console.log("Database connected");
})

app.get('/', (req, res) => {
   res.send('Hello World!')
})

//app.use('/login', loginRouter);
app.use('/admin', adminRouter);

/**
* @swagger
* tags:
*   name: Admin
*   description: Admin operations
* 
* /admin/hosts:
*   get:
*     summary: Get all hosts
*     description: Retrieve a list of all hosts
*     tags: [Admin]
*     responses:
*       200:
*         description: Successful operation
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/User'
*       401:
*         description: Unauthorized - Invalid or missing token
*       403:
*         description: Forbidden - Insufficient permissions
*       500:
*         description: Internal Server Error
*/

app.get('/admin/hosts',  async (req, res) => {
    try {
      // Fetch all hosts from the database with the category 'host'
      const allHosts = await User.find({ category: 'host' });
  
      // Send the hosts as the response
      res.json(allHosts);
    } catch (error) {
      console.error('Error fetching hosts:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});



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
        servers: [
            {
                url:"http://localhost:3000/",
                //url:"https://swaggerg6.azurewebsites.net/"
            }
        ],
    },
    //all the route.js file store inside the route file 
    apis:["./routes/*.js","./index.js"],
};



const spacs = swaggerJSDoc(options);
app.use("/g6", swaggerUi.serve, swaggerUi.setup(spacs));
// app.use('/admin',adminRouter);

app.listen(port, () => {
   console.log(`Example app listening on port ${port}`)
})
