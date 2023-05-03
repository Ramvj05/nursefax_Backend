const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ApplyJobSchema = new Schema({
    job_id: {
        type: String,
        // required: true,
    },
    createdBy: {
        type: String,
    },

    active: {
        type: Boolean,
        default: true,
    },
    is_delete: {
        type: Boolean,
        default: false,
    },
    createdOn: {
        type: Date,
        // default: Date.now,
    },
    expiredOn: {
        type: Date,
        // default: Date.now,
    },
    modifyOn: {
        type: Date,
        // default: Date.now,
    },
});

module.exports = mongoose.model("ApplyJob", ApplyJobSchema);
