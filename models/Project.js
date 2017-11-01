const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Creat Schema;
const ProjectSchema = new Schema({
    title:{
        type:String,
        required: true
    },
    catagory:{
        type: String,
        required: true
    },

    data: {
        type: Date,
        defualt: Date.now
    }
})

mongoose.model('project', ProjectSchema);