var express = require('express');
var bodyParser = require('body-parser');
var app = express();
const cors = require('cors');
var corsOptions = { origin: true, optionsSuccessStatus: 200 };
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))
var port = 9000;
app.listen(port);
console.log('Listening on port', port);


// Importacion de librerias para la conexion ssh con mysql
const mysql = require('mysql2');
var Client = require('ssh2').Client;
//instanciamos el cliente
var sshClient = new Client();

//ANTES DE HACER LA CONEXION ASEGURARSE QUE TANTO LOS SEGURITY GROUPS DE RDS Y LA EC2 TENGAN HABILITADO EL PUERTO 3306

//Credenciales de la base de datos RDS privada
const dbServer = {
    host: '<url del host pubnto de acceso>', //Punto de acceso url de RDS 
    port: 3306,  //Puerto de acceso de RDS
    user: '< user >', // usuario de base de datos
    password: '< password >', // password de base de datos
    database: '<nombre de db>' //nombre de la base de datos
}

// Credenciales de la EC2 publica
const tunnelConfig = {
    host: '<url de DNS EC2>',   // DNS ipv4 de la EC2 no es la ip es un url
    port: 22,     // puerto SSH
    username: 'user',   // usuario en este caso es una instancia de Ubuntu
    privateKey: require('fs').readFileSync('ruta de su .pem')  //ruta de su llave .pem de la EC2 , antes darle permisos al archivo
}

// Enlazamos las 2 conexiones
const forwardConfig = {
    srcHost: '<url del host pubnto de acceso>', // punto acceso de RDS
    srcPort: 3306, // puerto
    dstHost: dbServer.host, // destination database
    dstPort: dbServer.port // destination port
};


// Creamos el promise para la conexion
const SSHConnection = new Promise((resolve, reject) => {
    sshClient.on('ready', () => {
        //Le seteamos las credenciales
        sshClient.forwardOut(
        forwardConfig.srcHost,
        forwardConfig.srcPort,
        forwardConfig.dstHost,
        forwardConfig.dstPort,
        (err, stream) => {
             if (err) reject(err);
            // creamos un servidor de base de datos
            const updatedDbServer = {
                 ...dbServer,
                 stream
            };
            // realizamos conexion a mysql rds
            const connection =  mysql.createConnection(updatedDbServer);
           //  hacemos una validacion que si conecte          
           connection.connect((error) => {
            if (error) {
                reject(error);
                console.log('Error de conexion')
            }
            resolve(connection);
            console.log('Conectado a Base de datos');
            });
            //retornamos la conexion
            return connection;
       });
    }).connect(tunnelConfig);
});
//--------------------------------------------------Prueba---------------------------------------

app.get('/', function (req, res) {

  res.json({ mensaje: 'Hola semi 1 - A'})

});

//------------ruta prueba de query a mysql como se haria normalmanete------
app.get("/getdata", async (req, res) => {
//instanciamos la promise para la conexion con un then 
const conn = SSHConnection.then(conn => {
        //hacemos la query normal.
        conn.query(`SELECT * FROM prueba`, function (err, result) {
            if (err) throw err;
            res.send(result);
          });
    })
});
