const { google } = require('googleapis');
const apikeys = require('../apikeys.json');

class GoogleDriveService {
    constructor() {
        this.jwtClient = GoogleDriveService.jwtClient;
    }

    static async initService() {
        this.jwtClient = new google.auth.JWT(
            apikeys.client_email,
            null,
            apikeys.private_key,
            ['https://www.googleapis.com/auth/drive'],
        );

        return new Promise((resolve, reject) => {
            this.jwtClient.authorize((err) => {
                if (err) {
                    console.error('Error authorizing JWT client:', err);
                    reject(err);
                }
                console.log('Google Drive service initialized successfully!');
                
                resolve();
            });
        });
    }

    async uploadFile(fileBuffer, fileName) {
        try {
            const fileMetadata = {
                name: fileName,
                parents: ['1HnW-RTbstxY1mjby0G27yP82UArOaLWi'],
                // parents: ['1LQq3o2f8Bam_Lw7MHq_rv4Zr7aHrCyAo'],
            };
            const media = {
                mimeType: 'application/pdf',
                body: fileBuffer,
            };

            const drive = google.drive({
                version: 'v3',
                auth: this.jwtClient,
            });

            const res = await drive.files.create({
                resource: fileMetadata,
                media: media,
                fields: 'id,webViewLink',
            });
            
            // Set the file to be publicly accessible
            await drive.permissions.create({
                fileId: res.data.id,
                requestBody: {
                    role: 'reader',
                    type: 'anyone',
                },
            });

            console.log('File uploaded:');
            return res.data.webViewLink;
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    }
}

GoogleDriveService.initService();

module.exports = GoogleDriveService;
