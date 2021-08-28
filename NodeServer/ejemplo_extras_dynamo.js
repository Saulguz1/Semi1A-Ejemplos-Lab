//Insertar un registro
var params = {
    TableName: 'Prueba',
    Item: {
      'id_numero': {N: req.id_numero.toString()},
      'nombre':    {S: req.nombre},
      'carrera':   {S: req.carrera},
      'edad':      {N: req.edad.toString()}
    }
  };
  
  ddb.putItem(params, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Sucess",data)
    }
  });
  
  
  
  //Eliminar un Registro
  var params = {
    TableName: 'Prueba',
    Key: {
      'id_numero': {N: req.id_numero.toString()}
    }
  };
  ddb.deleteItem(params, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data);
    }
  });
  
  
  
  //Consultar un registro
  var params = {
    TableName: 'Prueba',
    Key: {
      'id_numero': {N: req.id_numero.toString()}
    },
    ProjectionExpression: 'nombre'   //Este es solo para obtener un dato en especifico
  };
  
  ddb.getItem(params, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data.Item);
    }
  });
  
  
  
  //Toda la tabla
  let params = {
      TableName: 'Prueba',
      Limit: 100 
  };
  
  ddb.scan(params, function(err, data){
    if(err){
        console.log("Error", err);
    }  else{
        console.log(null,data.Items);
    }
  });