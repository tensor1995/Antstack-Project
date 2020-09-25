const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const coupounSchema = new Schema({
      name: String,
      startDate: Date,
      endDate: Date,
      minAmt: Number,
      type: String,
      discount: Number
});
mongoose.model("Coupouns", coupounSchema);