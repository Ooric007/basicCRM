import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const ContactSchema = new Schema({
    firstName: {
        type: String,
        required: 'Enter a first name'
    },
    lastName: {
        type: String,
        required: 'Enter a last name'
    },
    email: {
        type: String
    },
    company: {
        type: String
    },
    phone: {
        type: Number
    },
    created_date: {
        type: Date,
        default: Date.now,
        get: function(v) { return v.toISOString(); }
    },
    modified_date: {
        type: Date
    }
}, {
    versionKey: 'version' // Specify the version key name
});

// Middleware to set modified_date before update
ContactSchema.pre('findOneAndUpdate', function(next) {
    this._update.modified_date = new Date();
    this._update.$inc = { version: 1 }; // Increment version
    next();
});

// Create Contact model
const Contact = mongoose.model('Contact', ContactSchema);

// Export Contact model
export default Contact;
