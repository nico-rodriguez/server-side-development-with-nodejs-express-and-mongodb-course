const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
  firstname: {
    type: String,
    default: ''
  },
  lastname: {
    type: String,
    default: ''
  },
  telnum: {
    type: Number,
    default: 0
  },
  email: {
    type: String,
    default: ''
  },
  agree: {
    type: Boolean,
    default: false
  },
  contactType: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const Feedbacks = mongoose.model('feedback', feedbackSchema);

module.exports = Feedbacks;