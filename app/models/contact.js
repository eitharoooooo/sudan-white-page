var mongoose = require('mongoose'); // Import Mongoose Package
var Schema = mongoose.Schema; // Assign Mongoose Schema function to variable
var bcrypt = require('bcrypt-nodejs'); // Import Bcrypt Package
var titlize = require('mongoose-title-case'); // Import Mongoose Title Case Plugin
var validate = require('mongoose-validator'); // Import Mongoose Validator Plugin




// Contact Mongoose Schema
var ContactSchema = new Schema({
    name: { type: String, required: true },
    number: { type: String, lowercase: true, required: true, unique: true },
    job: { type: String, required: true },
    location: { type: String, required: true, lowercase: false },
    permission: { type: String, required: true, default: 'admin' }
});



// Mongoose Plugin to change fields to title case after saved to database (ensures consistency)
ContactSchema.plugin(titlize, {
    paths: ['name']
});


module.exports = mongoose.model('Contact', ContactSchema); // Export Contact Model for us in API
