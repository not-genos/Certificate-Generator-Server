const Student = require('../models/student');

class StudentService {
  constructor() {
  }

  async createStudent(student) {
    const existingStudent = await Student.findOne({email: student.email});
    if(existingStudent){
        throw new Error('Student already exists');
    }
    const newStudent = new Student(student);
    await newStudent.save();

    return newStudent;
  }

  async getStudents(email) {
    const student = await Student.findOne({email});
    if(!student){
        throw new Error('Student not found');
    }
    return student;
  }

  async showStudentList() {
    return await Student.find();
  }

  async saveCertificate(email, certificate) {
    const student = await Student.findOne({email});
    if(!student){
        throw new Error('Student not found');
    }
    if(!student.certificates){
        student.certificates = [];
    }
    student.certificates.push(certificate);
    await student.save();
  }
}

module.exports = StudentService;