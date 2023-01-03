const mongoose = require('mongoose')
mongoose.set("strictQuery", true);

// connect to mongodb
mongoose.connect(process.env.MONGO_URL, (err, data) => {
    if(err){
        console.log("Error connecting mongodb");
    }else{
        console.log("Connected to mongodb");
    }
});

