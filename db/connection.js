const mongoose = require('mongoose')
const connectionstring = process.env.DBCONNECTIONSTRING

mongoose.connect(connectionstring).then(res =>{
    console.log('EduCore db Connected successfully');
    
}).catch(err=>{
    console.log('Mongdb Atlas connection failed');
    console.log(err);
    
    
})