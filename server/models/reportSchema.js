const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reportSchema = new Schema({
    date: { type: Date, default: Date.now },
    reportId:String,
    title:String,
    content:String,
    publicationYear:Number,
    keywords:String,
    ownerId:String,
    ownerName:String,
   
})





module.exports = mongoose.model('reports',reportSchema)
