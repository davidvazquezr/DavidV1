var pedidoView = require('../views/reference'),
    pedidoModel = require('../models/dataAccess')


var pedido = function(conf) {
    this.conf = conf || {};

    this.view = new pedidoView();
    this.model = new pedidoModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};