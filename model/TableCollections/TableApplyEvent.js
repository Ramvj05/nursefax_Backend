const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ApplyEventsSchema = new Schema({
  event_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
  },
  is_delete: {
    type: Boolean,
    default: false,
  },
  createdOn: {
    type: Date,
  },
  modifyOn: {
    type: Date,
  },
});

module.exports = mongoose.model("ApplyEvents", ApplyEventsSchema);
