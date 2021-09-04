var express = require('express');
var bodyParser = require('body-parser');
var app = express();
const cors = require('cors');
const mysql = require('mysql');
var uuid = require('uuid');
const aws_keys = require('./creds');
var corsOptions = { origin: true, optionsSuccessStatus: 200 };
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))
var port = 9000;
app.listen(port);
console.log('Listening on port', port);

const db_credentials = require('./db_creds');
var conn = mysql.createPool(db_credentials);

//instanciamos el sdk
var AWS = require('aws-sdk');
//instanciamos los servicios a utilizar con sus respectivos accesos.
const s3 = new AWS.S3(aws_keys.s3);
const ddb = new AWS.DynamoDB(aws_keys.dynamodb);
const rek = new AWS.Rekognition(aws_keys.rekognition);





//--------------------------------------------------Prueba---------------------------------------

app.get('/', function (req, res) {

  res.json({ mensaje: 'Hola semi 1 - A'})

});


//--------------------------------------------------ALMACENAMIENTO---------------------------------------

//subir foto en s3  EN EL PROYECTO SOLO SE SUBIRAN IMAGENES (JPG,PNG) Y ARCHIVOS PDF
app.post('/subirfoto', function (req, res) {

  var id = req.body.id;
  var foto = req.body.foto;     //base64
  //carpeta y nombre que quieran darle a la imagen

  var nombrei = "fotos/" + id + ".jpg";

  //se convierte la base64 a bytes
  let buff = new Buffer.from(foto, 'base64');


  
  const params = {
    Bucket: "ejemplosemiarchivos",
    Key: nombrei,
    Body: buff,
    ContentType: "image",
    ACL: 'public-read'
  };



  
  const putResult = s3.putObject(params).promise();
  res.json({ mensaje: putResult })



});

//subir pdf en s3
app.post('/subirfile', function (req, res) {

  var nombre = req.body.nombre;
  var pdf = req.body.pdf;  //base 64
  //carpeta y nombre que quieran darle al pdf
  var nombrei = "files/" + nombre +uuid.v4()+ ".pdf";
  //se convierte la base64 a bytes
  let buff = new Buffer.from(pdf, 'base64');
  const params = {
    Bucket: "ejemplosemiarchivos",
    Key: nombrei,
    Body: buff,
    ACL: 'public-read'
  };

  s3.upload(params, function sync(err, data) {
     if (err) {
       res.status(500).send(err)
     } else {
      console.log(data.Location);  
      res.status(200).send(data);
                        
   }}); 


});

//NO ES NECESARIO PARA SU PROYECTO PERO PUEDEN USARLO obtener objeto en s3
app.post('/obtenerfoto', function (req, res) {
  var id = req.body.id;
  //direcccion donde esta el archivo a obtener
  var nombrei = "fotos/" + id + ".jpg";
  var getParams = {
    Bucket: 'ejemplosemiarchivos',
    Key: nombrei
  }
  s3.getObject(getParams, function (err, data) {
    if (err)
      res.json({ mensaje: "error" })
    //de bytes a base64
    var dataBase64 = Buffer.from(data.Body).toString('base64');
    res.json({ mensaje: dataBase64 })

  });

});


//--------------------------------------------------BASES DE DATOS ---------------------------------------
//subir foto y guardar en dynamo
app.post('/saveImageInfoDDB', (req, res) => {
  let body = req.body;

  let name = body.name;
  let base64String = body.base64String;
  let extension = "png";

  //Decodificar imagen
  let buff = new Buffer.from(base64String, 'base64');
  let filename = `${name}-${uuid.v4()}.${extension}`; //uuid() genera un id unico para el archivo en s3

  //Parámetros para S3
  let bucketname = 'bucketejemplo1semia';
  let folder = 'fotos/';
  let filepath = `${folder}${filename}`;

  var uploadParamsS3 = {
    Bucket: bucketname,
    Key: filepath,
    Body: buff,
    ACL: 'public-read',
  };

    console.log("Entro")
  s3.upload(uploadParamsS3, function sync(err, data) {
    if (err) {
      console.log('Error uploading file:', err);
      res.send({ 'message': 's3 failed' })
    } else {
      console.log('Url del objetot:', data.Location);
     
      //PARTE DE INSERCION EN DYNAMO
      ddb.putItem({
        TableName: "ejemplosemi1",
        Item: {
          "id": { S: "saul" },
          "apellido": { S: name },
          "urlfoto": { S: data.Location }
        }
      }, function (err, data) {
        if (err) {
          console.log('Error saving data:', err);
          res.send({ 'message': 'ddb failed' });
        } else {
          console.log('Save success:', data);
          res.send({ 'message': 'ddb success' });
        }
      });

    }
  });
 

})

//obtener datos de la BD RDS
app.get("/getdata", async (req, res) => {
  conn.query(`SELECT * FROM ejemplo`, function (err, result) {
    if (err) throw err;
    res.send(result);
  });
});

//insertar datos RDS
app.post("/insertdata", async (req, res) => {
  let body = req.body;
  conn.query('INSERT INTO ejemplo VALUES(?,?)', [body.id, body.nombre], function (err, result) {
    if (err) throw err;
    res.send(result);
  });
});


//----------------------------------- Inteligencia Artificial Rekognition ---------------------------------------


// Analizar Emociones Cara
app.post('/detectarcara', function (req, res) { 
  var imagen = req.body.imagen;
  var params = {
    /* S3Object: {
      Bucket: "mybucket", 
      Name: "mysourceimage"
    }*/
    Image: { 
      Bytes: Buffer.from(imagen, 'base64')
    },
    Attributes: ['ALL']
  };

  rek.detectFaces(params, function(err, data) {
    if (err) {res.json({mensaje: err})} 
    else {   
           res.json({Deteccion: data});      
    }
  });
});



// Analizar texto
app.post('/detectartexto', function (req, res) { 
  var imagen = req.body.imagen;
  var params = {
    /* S3Object: {
      Bucket: "mybucket", 
      Name: "mysourceimage"
    }*/
    Image: { 
      Bytes: Buffer.from(imagen, 'base64')
    }
  };
  rek.detectText(params, function(err, data) {
    if (err) {res.json({mensaje: "Error"})} 
    else {   
           res.json({texto: data.TextDetections});      
    }
  });
});

// Analizar Famoso
app.post('/detectarfamoso', function (req, res) { 
  var imagen = req.body.imagen;
  var params = {
    /* S3Object: {
      Bucket: "mybucket", 
      Name: "mysourceimage"
    }*/
    Image: { 
      Bytes: Buffer.from(imagen, 'base64')
    }
  };
  rek.recognizeCelebrities(params, function(err, data) {
    if (err) {
      console.log(err);
      res.json({mensaje: "Error al reconocer"})} 
    else {   
           res.json({artistas: data.CelebrityFaces});      
    }
  });
});
// Obtener Etiquetas
app.post('/detectaretiquetas', function (req, res) { 
  var imagen = req.body.imagen;
  var params = {
    /* S3Object: {
      Bucket: "mybucket", 
      Name: "mysourceimage"
    }*/
    Image: { 
      Bytes: Buffer.from(imagen, 'base64')
    }, 
    MaxLabels: 123
  };
  rek.detectLabels(params, function(err, data) {
    if (err) {res.json({mensaje: "Error"})} 
    else {   
           res.json({texto: data.Labels});      
    }
  });
});
// Comparar Fotos
app.post('/compararfotos', function (req, res) { 
  var imagen1 = req.body.imagen1;
  var imagen2 = req.body.imagen2;
  var params = {
    
    SourceImage: {
        Bytes: Buffer.from(imagen1, 'base64')     
    }, 
    TargetImage: {
        Bytes: Buffer.from(imagen2, 'base64')    
    },
    SimilarityThreshold: '80'
    
   
  };
  rek.compareFaces(params, function(err, data) {
    if (err) {res.json({mensaje: err})} 
    else {   
           res.json({Comparacion: data.FaceMatches});      
    }
  });
});



