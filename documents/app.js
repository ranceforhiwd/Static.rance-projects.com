// Configure the AWS SDK
AWS.config.region = 'us-east-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: '<YOUR_IDENTITY_POOL_ID>'
});

// Create an S3 client
const s3 = new AWS.S3();

document.getElementById('upload-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];
    if (!file) {
        alert('Please select a file to upload.');
        return;
    }

    const key = `${file.name}`;
    const params = {
        Bucket: 'rance-business-docs',
        Key: key,
        Body: file
    };

    s3.putObject(params, (err, data) => {
        if (err) {
            console.error('Error uploading file:', err);
            alert('An error occurred while uploading the file.');
        } else {
            console.log('File uploaded successfully:', data);
            alert('File uploaded successfully!');
        }
    });
});