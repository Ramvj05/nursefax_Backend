const mongoose = require("mongoose");
const { stringify } = require("uuid");
const Schema = mongoose.Schema;
require('dotenv').config()


const UserRatingsSchema = Schema({

    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    blog_id:{
        type: mongoose.Schema.Types.ObjectId,
    },
    review_rating:{
        type: Number,
    },
    comments:{
        type: String,
    },
    Status: {
        type: Boolean,
        default: false,
      },
    createDt:{
        type: Date,
        default: Date.now(),
    },
    modifyDt:{
        type: Date,
        default: Date.now(),
    },
    is_active:{
        type:Boolean,
        default : true
    },
    is_delete:{
        type:Boolean,
        default:false
    }

});


module.exports = mongoose.model("UserRatings", UserRatingsSchema);



