const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require('swagger-jsdoc');
//const loginRouter = require('./routes/login');
const adminRouter = require('./routes/admin');
const User = require('./model/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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

// POST route for user login
app.post('/login',async(req, res) =>{
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
          "GET": `/g6/${redirectLink}`,
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
                //url:"http://localhost:3000/",
                url:"https://swaggerg6.azurewebsites.net/"
            }
        ],
    },
    //all the route.js file store inside the route file 
    apis:["./routes/*.js"],
};



const spacs = swaggerJSDoc(options);
app.use("/g6", swaggerUi.serve, swaggerUi.setup(spacs));
// app.use('/admin',adminRouter);

app.listen(port, () => {
   console.log(`Example app listening on port ${port}`)
})
