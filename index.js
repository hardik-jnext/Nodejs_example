const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const {I18n} = require('i18n')
const userrouter = require('./src/routes/users.routes.js')
const itemrouter = require("./src/routes/items.routes.js")
const ordertrouter = require("./src/routes/order.routes.js")
const path = require("path")
const db = require("./src/config/Config.js")
const body = require("body-parser")
const  hadleErrorMessage  = require('./src/middleware/errorHandle.js')
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require("swagger-jsdoc")
const cors = require("cors"); 
require("dotenv").config(); 
var Publishable_Key = process.env.STRIPE_PUBLISHABLE_KEY
var Secret_Key = process.env.STRIPE_SECRET_KEY
 const stripe = require("stripe")(Secret_Key);


 
 
 
app.use(body.urlencoded({extended:false}))
app.use(body.json())
 
// View Engine Setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
 
app.get('/getpayment', function(req, res){
    res.render('home', {
       key: Publishable_Key
    })
})
 
app.post('/payment', function(req, res){
 
    // Moreover you can take more details from user
    // like Address, Name, etc from form
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        name: 'hardik sheladiya',
        address: {
            line1: '75,yogidhra',
            postal_code: '395006',
            city: 'surat',
            state: ' gujrat',
            country: 'India',
        }
    })
    .then((customer) => {
 
        return stripe.charges.create({
            amount: 2500,     // Charging Rs 25
            description: 'Web Development Product',
            currency: 'INR',
            customer: customer.id
        });
    })
    .then((charge) => {
        res.send("Success")  // If no error occurs
    })
    .catch((err) => {
        res.send(err)       // If some error occurs
    });
})
    





const options ={
    swaggerDefinition :{
        components:{
            securitySchemes: {
                bearerAuth:{
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"    
                }
            }
        },
        openapi : "3.0.2",
        info:{
            title : "Nodejs example",
            version : "1.0.0",
            description :"A complete nodejs example"
        },
        servers : [{
            url : "http://localhost:3000"
        }],    
    },
  apis :["src/routes/*.js"]
}
const specs = swaggerJsDoc(options)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

 

// Task no.:50 (Implement i18n for multi-language in response.)
    
// start

const i18n = new I18n({
    locales :['en','de','fr'],
    directory : path.join(__dirname,'/src/translation'),
    defaultLocale : "en",
    header: 'accept-language'   
})

app.use(i18n.init) 

//end


app.use(body.json())
db.sequelize.sync({force : false })



app.use("/",express.static("./uploads"))
app.use('/',userrouter)
app.use('/item',itemrouter)
app.use('/order',ordertrouter)

app.use(hadleErrorMessage)



app.listen(port,()=>{
    console.log(`Server running at port.${port}`)
})