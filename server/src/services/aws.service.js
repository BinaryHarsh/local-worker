/* eslint-disable */
const AWS = require('aws-sdk');
const fs = require('fs');
const config = require('../config/config');

const s3 = new AWS.S3({
    accessKeyId: config.s3.id,
    secretAccessKey: config.s3.secret,
});

exports.uploadFileToS3Bucket = ({ localFilePath, remoteFilePath }) => {
    try {
        if (!fs.existsSync(localFilePath)) {
            console.error(`${localFilePath} not present on the disk`);
            return
        }

        // Read content from the file
        const fileContent = fs.readFileSync(localFilePath);

        // Setting up S3 upload parameters
        const params = {
            Bucket: config.s3.bucketName,
            Key: remoteFilePath,
            Body: fileContent,
            ACL: 'public-read',
        };

        // Uploading files to the bucket
        s3.upload(params, function (err, data) {
            if (err) {
                console.error(err);
            }
        });
    } catch (e) {
        console.error(e);
    }
};
