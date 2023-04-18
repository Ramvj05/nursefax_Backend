const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("dotenv").config();

const BlogsViewSchema = Schema({

    blog_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    user_ip: {
        type: String,
    },

    Status: {
        type: String,
        // default: true, 
    },
    createDt: {
        type: Date,
        default: Date.now(),
    },
    modifyDt: {
        type: Date,
        default: Date.now(),
    },
    is_active: {
        type: Boolean,
        default: true,
    },
    is_delete: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model("BlogsView", BlogsViewSchema);