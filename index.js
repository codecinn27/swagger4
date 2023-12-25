const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require('swagger-jsdoc');
// const adminRouter = require('./routes/admin');
app.use(express.json())


// Define the visit schema
const visitSchema = new mongoose.Schema({
    purposeOfVisit: {
        type: String,
        required: true
    },
    visitTime: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });  

// Define the Visit model
const Visit = mongoose.model('Visit', visitSchema);


mongoose.connect('mongodb+srv://codecinnpro:9qLtJIAG9k8G1Pe8@cluster0.egrjwh1.mongodb.net/vms_2?retryWrites=true&w=majority')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open",()=>{
    console.log("Database connected");
})

app.get('/', (req, res) => {
   res.send('Hello World!')
})

app.get("/visit",async (req, res) => {
    try {
      // Fetch all visits from the database
      const allVisits = await Visit.find({});
  
      // Send the visits as the response
      res.json(allVisits);
    } catch (error) {
      console.error('Error fetching visits:', error);
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
                url:"http://localhost:3000/"
                // url:"https://swaggerg6.azurewebsites.net/"
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
