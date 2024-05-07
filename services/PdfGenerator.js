const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const { Readable } = require('stream');

class PdfGenerator {
    constructor() {}

    async openPdf(pdfPath) {
        const pdfBytes = fs.readFileSync(pdfPath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const page = pdfDoc.getPages()[0];
        const { width, height } = page.getSize();
        const maxTextBoxWidth = width * 0.8;

        this.pdfDoc = pdfDoc;
        this.pdfPage = page;
        this.pdfHeight = height;
        this.pdfWidth = width;
        this.pdfMaxTextBoxWidth = maxTextBoxWidth;
    }

    async addText(text, yPer, fontFamily, fontSize, color={r: 0, g:0, b:0}) {
        const font = await this.pdfDoc.embedFont(StandardFonts[fontFamily]);
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const actualTextBoxWidth = Math.min(textWidth, this.pdfMaxTextBoxWidth);
        const centerX = (this.pdfWidth - actualTextBoxWidth) / 2;

        this.pdfPage.drawText(text, {
            x: centerX,
            y: this.pdfHeight * yPer,
            size: fontSize,
            maxWidth:  this.pdfMaxTextBoxWidth,
            color: rgb(color.r/255, color.g/255, color.b/255),
            font: font,
        });
    }

    addCertificateId(id){
        this.pdfPage.drawText(id, {
            x: this.pdfWidth * 0.815,
            y: this.pdfHeight * 0.105,
            size: 11,
            color: rgb(0, 0, 0),
        });
    }

    async savePdf(outputPath) {
        const pdfBytesNew = await this.pdfDoc.save();
        fs.writeFileSync(outputPath, pdfBytesNew);
    }

    async getPdfBuffer(){
        const pdfBytesNew = await this.pdfDoc.save();
        // return Buffer.from(pdfBytesNew);

        const pdfStream = new Readable();
        pdfStream.push(pdfBytesNew);
        pdfStream.push(null);

        return pdfStream;

    }
}

module.exports = PdfGenerator;