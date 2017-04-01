// This script is a model of the Semester object

// Load external dependencies
var mongoose = require('mongoose')

// Define the semesterSchema
var evaluationsSchema = new mongoose.Schema({
  _id: Number,
  code: Number,
  name: String,
  start_date: String,
  end_date: String
})

semesterSchema.statics.getAllSemesters = function (callback) {
  this.find({}, function (err, semesters) {
    if (err) {
      console.log(err)
    }
    callback(semesters)
  })
}

// Create the Semester model from the courseSchema
var Semester = mongoose.model('Semester', semesterSchema)

// Export the Course model
module.exports = Semester
