// Configure the AWS SDK
AWS.config.region = 'us-east-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:d67a078c-2f97-4551-8d7a-c1a25b4970c3'
});

// Create an S3 client
const s3 = new AWS.S3();

//var x = document.querySelector("#parent #child")
document.querySelector('body sectio#app-section form#upload-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const fileInput = document.querySelector('body section#app-section form#upload-form file-input');
    const file = fileInput.files[0];
    if (!file) {
        alert('Please select a file to upload.');
        return;
    }

    const key = `${file.name}`;
    const params = {
        Bucket: 'support-doc-pdfs',
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