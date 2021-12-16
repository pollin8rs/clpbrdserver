// importing modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

const ThirdPartyProviderSchema = new mongoose.Schema({
    provider_name: {
        type: String, 
        default: null
    },
    provider_id: {
        type: String,
        dfeault: null
    },
    provider_data: {
        type: {},
        default: null
    }
})

var UserSchema = new Schema(
    {
        fullname: {
            type: String,
            required: true,        
        }
        email: {
            type: String,
            required:true,
            unique:true
        },
        email_is_verified: {
            type: Boolean,
            default: false
        },
        username: {
            type: String,
            unique: true,
            required:true
        },
        usernumber: {
            type: Number,
            unique: true,
            required: true
        },
        third_party_auth: [ThirdPartyProviderSchema],
        created_date: {
            type: Date,
            default: Date.now
        }
    }, 
    { strict: false }
);

// plugin for passport-local-mongoose
UserSchema.plugin(passportLocalMongoose);

// export userschema
module.exports = mongoose.model("Users", UserSchema);
