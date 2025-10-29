require('dotenv').config()
const express = require('express')
const cors = require('cors')
const router = require('./routing/router')
require('./db/connection')
const educoreServer = express()

educoreServer.use(cors())
educoreServer.use(express.json())
educoreServer.use(router)
educoreServer.use('/uploads',express.static('./uploads'))

const PORT = 3001

educoreServer.listen(PORT,()=>{
    console.log(`EduCore Server Started at POrt :${PORT},wait for client request`);
    
})

educoreServer.get('/',(req,res)=>{
    res.status(200).send('<h1>Educore Server started</h1>');
    
})