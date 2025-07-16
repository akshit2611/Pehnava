const { default: mongoose } = require("mongoose");
const loginRecordSchema = mongoose.Schema({
  username: String,
  email: String,
  attemptedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('LoginRecord', loginRecordSchema);
