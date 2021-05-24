const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const routesUrls = require('./routes/routes')
const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')
const auth = require('./middleware/auth');

const PORT = process.env.PORT || 5000;
dotenv.config()

mongoose.connect(process.env.DATABASE_ACCESS,{ 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(function(){console.log("Success")}).catch(e => {
    console.error('Connection error', e.message)
});

const db = mongoose.connection

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.use('/app/protected', auth,(req,res)=>{
    res.end(`Hi ${req.user.FirstName}, you are authenticated!`);
});

if(process.env.NODE_ENV === 'production'){
app.use(express.static('client/build'));
app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'client','build','index.html'))
})
}
else{
    app.get('/',(req,res)=>{
        res.send('Api running');
    })
}

app.use('/app', routesUrls)

app.use((req,res,next)=>{
    const err = new Error('not found');
    err.status = 404;
    next(err);
});

app.use((err,req,res,next)=>{
    const status = err.status || 500;
    res.status(status).json({error:{message:err.message}});
});

app.listen(PORT, ()=> console.log("server is up and run"))

