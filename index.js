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