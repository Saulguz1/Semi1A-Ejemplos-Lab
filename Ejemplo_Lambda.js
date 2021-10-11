var AWS = require('aws-sdk');
var ddb = new AWS.DynamoDB({region: 'us-east-2'});
var s3 = new AWS.S3({region: 'us-east-2'});
var rek = new AWS.Rekognition({region: 'us-east-2'});

exports.handler = function(req,ctx,callback) {


//======================================================================
/*ENTRADA 
{
  "nombre": " ",
  "carrera": " ",
  "edad": 1
}

*/


//Ejemplo de Dynamo con Lambda
var params = {
  TableName: 'PruebaLambda',
  Item: {
    'nombre':    {S: req.nombre},
    'carrera':   {S: req.carrera},
    'edad':      {N: req.edad.toString()}
  }
};

ddb.putItem(params, function(err, data) {
  if (err) {
    console.log("Error al insertar", err);
    callback("Error",err);
  } else {
    console.log("Sucess dato insertado con exito",data)
    callback(null,data);
  }
});

//====================================================================================
/*ENTRADA 
{
  "imagen": " ",
  "nombre": " ",
  "extension": " "
}

*/

//Ejemplo de S3 con Lambda
var id = req.nombre;
var foto = req.imagen;
var extension = req.extension;
var nombrei = "fotos/" + id + "."+ extension;
let buff = new Buffer.from(foto, 'base64');
const params = {
  Bucket: "ejemplosemi1",
  Key: nombrei,
  Body: buff,
  ContentType: "image",
  ACL: 'public-read'
};
s3.putObject(params, function(err, data) {
    if (err) {
      console.log("Error al insertar", err);
      callback("Error",err);
    } else {
      console.log("Sucess foto insertada",data)
      callback(null,data);
    }
  });


//======================================================================
/*ENTRADA 
{
  "imagen": " "
}

*/


//Ejemplo de REKOGNITION con Lambda
var imagen = req.imagen;
  var params = {
    /* S3Object: {
      Bucket: "mybucket", 
      Name: "mysourceimage"
    }*/
    Image: { 
      Bytes: Buffer.from(imagen, 'base64')
    }, 
    MaxLabels: 15
  };
  
  rek.detectLabels(params, function(err, data) {
    if (err) {
        callback("Error",data);
    } 
    else {   
        callback(null,data.Labels);  
    }
  });
//

};
