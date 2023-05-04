const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ApplyJobSchema = new Schema({
    job_id: {
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
    },
    createdBy: {
        type: String,
    },
    expiredOn: {
        type: Date,
        // default: Date.now,
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

    modifyOn: {
        type: Date,
        // default: Date.now,
    },
});

module.exports = mongoose.model("ApplyJob", ApplyJobSchema);
