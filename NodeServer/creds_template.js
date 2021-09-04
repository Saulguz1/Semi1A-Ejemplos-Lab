let aws_keys = {
    s3: {
        region: 'us-east-2',
        accessKeyId: "",
        secretAccessKey: "",
        //apiVersion: '2006-03-01',
    },
    dynamodb: {
        apiVersion: '2012-08-10',
        region: 'us-east-2',
        accessKeyId: "",
        secretAccessKey: ""
    },
    rekognition: {
        region: '',
        accessKeyId: "",
        secretAccessKey: "" 
    }


}
module.exports = aws_keys
