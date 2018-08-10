var despachoView = require('../views/reference'),
    despachoModel = require('../models/dataAccess'),
    jsonxml = require('jsontoxml');
const nodemailer = require('nodemailer');
const smtpTrasnport = require('nodemailer-smtp-transport')
 


var despacho = function(conf) {
    this.conf = conf || {};

    this.view = new despachoView();
    this.model = new despachoModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

despacho.prototype.post_create = function(req, res, next) {
   var self = this;
      for (var i = 0; i < req.body.direcciones.length; i++) {
        req.body.direcciones[i] = {
            direccion: req.body.direcciones[i]
        }
    }

    var params = [
       { name: 'idRuta', value: req.body.idRuta, type: self.model.types.INT },
        { name: 'idOperador', value: req.body.idOperador, type: self.model.types.INT },
          { name: 'idUnidad', value: req.body.idUnidad, type: self.model.types.INT },
            { name: 'idOperadorUnidadRuta', value: req.body.idOperadorUnidadRuta, type: self.model.types.INT },
              { name: 'idEmpresa', value: req.body.idEmpresa, type: self.model.types.INT },
                { name: 'idUsuario', value: req.body.idUsuario, type: self.model.types.INT },
        {
            name: 'direcciones',
            value: jsonxml({
                direcciones: req.body.direcciones
            }),
            type: self.model.types.STRING
        }
    ];
   
console.log(params);
    self.model.query('INS_DESPACHO_PEDIDO_RUTA_SP', params, function(error, result) {
       
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
despacho.prototype.post_update = function(req, res, next) {
   var self = this;
      for (var i = 0; i < req.body.direcciones.length; i++) {
        req.body.direcciones[i] = {
            direccion: req.body.direcciones[i]
        }
    }

    var params = [
        { name: 'idOperador', value: req.body.idOperador, type: self.model.types.INT },
        { name: 'idUnidad', value: req.body.idUnidad, type: self.model.types.INT },    
        {
            name: 'direcciones',
            value: jsonxml({
            direcciones: req.body.direcciones
        }),
        type: self.model.types.STRING
        },
        { name: 'idDespacho', value: req.body.idDespacho, type: self.model.types.INT },
    ];
   
 console.log(params);
    self.model.query('UPD_DESPACHO_PEDIDO_RUTA_SP ', params, function(error, result) {
        console.log(result);
         console.log(error);
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
despacho.prototype.post_delete = function(req, res, next) {
   var self = this;


    var params = [
        { name: 'idOperador', value: req.body.idOperador, type: self.model.types.INT },
        { name: 'idUnidad', value: req.body.idUnidad, type: self.model.types.INT },    
        { name: 'idDespacho', value: req.body.idDespacho, type: self.model.types.INT },
    ];
   
 console.log(params);
    self.model.query('DEL_DESPACHO_PEDIDO_RUTA_SP ', params, function(error, result) {
        console.log(result);
         console.log(error);
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
despacho.prototype.get_rutasShow = function(req, res, next) {
   var self = this;

    var params = [  { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT}];
 
    self.model.query('SEL_DESPACHO_PEDIDOS_RUTA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


despacho.prototype.get_pedidosShow = function(req, res, next) {
   var self = this;

    var params = [  { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT}];
 
    self.model.query('SEL_PEDIDOS_DIRECCIONES_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

despacho.prototype.get_busquedaPedidoDetalle = function(req, res, next) {
   var self = this;

    var params = [  { name: 'idCotizacion', value: req.query.pedido, type: self.model.types.INT}];
 
    self.model.query('SEL_PEDIDO_DETALLE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

despacho.prototype.post_gnrDespacho = function(req, res, next) {
   var self = this;

    // var params = [  { name: 'idDespacho', value: req.body.idDespacho, type: self.model.types.INT},
    //                 { name: 'situacion', value: req.body.situacion, type: self.model.types.INT}];
  
 
    self.model.query('UPD_DESPACHO_SITUACION_SP_1', true, function(error, result) {

        
        self.view.expositor(res, {
            error: error,
            result: result
        });
          for(var i = 0; i < result.length; i++ ){
              
                   sendMail(result[i])
             
          }
        
    });
};


function sendMail(datosPedidos) {
     console.log('datosPedidos')
    console.log(datosPedidos.mail)
  
   
  return new Promise(function(resolve, reject) {
    //let subject = 'Contrato:  ' + contrato;
    var transporter = nodemailer.createTransport(smtpTrasnport({
      host: '192.168.20.17',
      port: 25,
      secure: false,
      auth: {
        user: 'noreply',
        pass: 'P4n4m4!'
      },
      tls:{rejectUnauthorized:false}
    }));

    var message = {
      from: '"Siniestros"<noreply@centraldeoperaciones.com>',
      to:datosPedidos.mail ,
      //to: 'david.vazquezr@outlook.com',
      subject:'ASE - Entrega de Pedido',
      html:'Estimado Socio,</br></br></br>En breve estará recibiendo las refacciones para vehículo asegurado con <strong>BANORTE</strong> documentado con el siniestro <strong>' 
      +datosPedidos.idSiniestro+'</strong>.</br></br>El pedido en relación es el <strong>'+datosPedidos.numBpro
      +'</strong> que para recibirlo requiere el token <strong>'+datosPedidos.token+'</strong>.</br></br>'
      +'<b>No omitimos el solicitarle que al momento de recibir el pedido se asegure detalladamente que cada una de las refacciones son correctas y exactamente en la cantidad requerida,'
      +' adicional a que cumplan con la calidad, origen y que se encuentren sin daño alguno. El registro de este token valida las condiciones anteriormente descritas. '
      +'En caso de detectar alguna diferencia favor de señalarla al momento toda vez que no aceptaremos devoluciones posteriores a la recepción de las mismas.<b></br></br>'
      +'Cualquier duda o sugerencia favor de comunicarse al 55 7018 2018 o bien al correo </br>'
      +'sugerencias@centraldeoperaciones.com.mx</br></br></br></br>'
      +'Atentamente</br>'
      +'Dirección de Operaciones.</br>' 
    };

    transporter.sendMail(message, function(err) {
      if (!err) {
        console.log('Email enviado');
        resolve({err: false, result: 'ok'});
      } else {
        console.log(err);
        resolve({err: false});
      }
    });
  });

}

module.exports = despacho;