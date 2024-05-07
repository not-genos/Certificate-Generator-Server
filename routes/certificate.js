const { Router } = require('express');
const path = require('path');
const PdfGenerator = require('../services/PdfGenerator');
const GoogleDriveService = require('../services/GoogleDrive');
const StudentService = require('../services/Student');
const route = Router();

const writeTextToPdf = async (name, course, date, certificate_id) => {
    const pdfGenerator = new PdfGenerator();

    const inputPath = path.resolve(__dirname, '..', 'resources', 'TDC.pdf');
    await pdfGenerator.openPdf(inputPath);

    await pdfGenerator.addText(name, 0.62, 'TimesRomanBold', 50, {
        r: 228,
        g: 165,
        b: 26,
    });

    await pdfGenerator.addText(
        `For successfully completing the Tutedude ${course}`,
        0.545,
        'TimesRomanBold',
        19,
    );
    await pdfGenerator.addText(`course on ${date}`, 0.5, 'TimesRomanBold', 19);
    pdfGenerator.addCertificateId(certificate_id);

    return await pdfGenerator.getPdfBuffer();
};

const studentService = new StudentService();
const driveServive = new GoogleDriveService();

route.post('/create-student', async (req, res) => {
    const { name, email } = req.body;

    const newStudent = await studentService.createStudent({ name, email });

    return res.json({ message: 'Student created successfully', student: newStudent });
});

route.get('/students', async (req, res) => {
    const students = await studentService.showStudentList();

    return res.json({students});
});

route.post('/generate-certificate', async (req, res) => {
    const { name, email, course, date, certificate_id } = req.body;

    const pdfBuffer = await writeTextToPdf(name, course, date, certificate_id);
    const driveLink = await driveServive.uploadFile(pdfBuffer, `${name} certificate.pdf`);
    
    await studentService.saveCertificate(email, {
        printed_name: name,
        course,
        date: new Date(date),
        certificateId: certificate_id,
        link: driveLink,
    });

    return res.json({ message: 'Certificate generated successfully', driveLink });
});

module.exports = route;
