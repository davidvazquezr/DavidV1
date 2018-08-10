registrationModule.controller('unidadController', function($sce, $http, $scope, $rootScope, $location, $timeout, alertFactory, unidadRepository, filterFactory, userFactory, globalFactory) {


    $scope.listUnidades = [];
    $scope.bloquea = false;
    $scope.add = false;
    $scope.tipo = 1;
    $scope.verBtn = false;
    $scope.texto = "";
    $scope.verdad = false;


    $scope.init = function() {
        $scope.Usuario = userFactory.getUserData();
        $scope.getEmpresas();
        $scope.getPesoUni();
    };

    $scope.getEmpresas = function() {
        filterFactory.getEmpresas($scope.Usuario.idUsuario, 'admin').then(function(result) {
            if (result.data.length > 0) {

                $scope.empresas = result.data;
                $scope.empresaActual = $scope.empresas[0];

                if (localStorage.getItem('pedEmpresa') !== null) {

                    $scope.pedEmpresa = []
                    $scope.tempPedEmp = localStorage.getItem('pedEmpresa')
                    $scope.pedEmpresa.push(JSON.parse($scope.tempPedEmp))

                    setTimeout(function() {
                        $("#selEmpresas").val($scope.pedEmpresa[0][0].emp_idempresa);
                        $scope.empresaActual = $scope.pedEmpresa[0][0];
                    }, 100);
                }
            } else { alertFactory.success('No se encontraron empresas'); }
        });
        $scope.getMarca();
        $scope.getTipoCarga();
        $scope.getTipoCombustibles();
    };

    $scope.cambioEmpresa = function() {

        $('#tblUnidades').DataTable().destroy();
        $scope.listUnidades = [];

        if ($scope.empresaActual.emp_idempresa != 0) {
            $scope.verBtn = true;
            unidadRepository.getUnidades($scope.empresaActual.emp_idempresa).then(function(result) {
                if (result.data.length > 0) {
                    $scope.listUnidades = result.data;
                    setTimeout(function() {
                        $scope.setTablePaging('tblUnidades');
                        $("#tblUnidades_length").removeClass("dataTables_info").addClass("hide-div");
                        $("#tblUnidades_filter").removeClass("dataTables_info").addClass("pull-left");
                    }, 1);
                } else {
                    alertFactory.info("No se encontraron resultados !!");
                    $scope.listUnidades = [];
                }
            });
        } else {
            $scope.listUnidades = [];
            $scope.verBtn = false;
        }
    };

    $scope.getPesoUni = function() {
        unidadRepository.getPesoUni().then(function(result) {
            $scope.pesos = result.data;            
            // $scope.pesos.unshift({ idPesoUnidad: 0, descpeso: "Seleccioné ..." });
            // $scope.pesoActual = $scope.pesos[0];
        });

    };
    $scope.unidadCapacidad = function(unidad) {
        $scope.pesoActual = unidad;
    };

    $scope.getTipoCarga = function() {
        unidadRepository.getTiposUnidades().then(function(result) {
            $scope.tipos = result.data;
            $scope.tipos.unshift({ Descripcion: "Seleccioné ..." });
            $scope.tipoActual = $scope.tipos[0];
        });

    };

    $scope.getTipoCombustibles = function() {
        unidadRepository.getTiposCombustibles().then(function(result) {
            $scope.tiposC = result.data;
            $scope.tiposC.unshift({ nombre: "Seleccioné ..." });
            $scope.tipoCActual = $scope.tiposC[0];
        });

    };

    $scope.getMarca = function() {
        unidadRepository.getMarcas().then(function(result) {
            $scope.marcas = result.data;
            $scope.marcas.unshift({ descripcion: "Seleccioné ..." });
            $scope.marcaActual = $scope.marcas[0];
        });
    };

    $scope.unidad = function(tipo) {
        $('#modalAddUnidad').modal('hide');
        new Promise(function(resolve, reject) {

            if ($scope.bloquea == false) $scope.cadenaConfirma = "<h4>Está a punto de confirmar  la unidad </h4>" +
                "<div class='row'>" +
                " <div class='col-sm-1'></div><div class='col-sm-6'> " +
                " <dl class='dl-horizontal'> " +
                "     <dt>Unidad:</dt> " +
                "     <dd> " + $scope.marcaActual.descripcion + " " + $scope.modelo + " " + $scope.anio + " </dd> " +
                "     <dt>N° Serie:</dt> " +
                "     <dd> " + $scope.numserie + " </dd> <dd> " +
                "     <dt>Tarjeta Circulacion:</dt> " +
                "     <dd> " + $scope.tarjeta + " </dd> " +
                "     <dt>N° Motor:</dt> " +
                "     <dd> " + $scope.motor + " </dd> " +
                "     <dt>Color:</dt> " +
                "     <dd> " + $scope.color + " </dd> " +
                "     <dt>Placas:</dt> " +
                "     <dd> " + $scope.placas + " </dd> " +
                "     <dt>Tipo Carga:</dt> " +
                "     <dd> " + $scope.tipoActual.Descripcion + " </dd> " +
                "     <dt>Capasidad:</dt> " +
                "     <dd> " + $scope.capacidad + " </dd> " +
                "     <dt>Peso:</dt> " +
                "     <dd> " + $scope.pesoActual.descpeso + " </dd> " +
                "     <dt>m3:</dt> " +
                "     <dd> " + $scope.metroscu + " </dd> " +
                "     <dt>Combustible:</dt> " +
                "     <dd> " + $scope.tipoCActual.nombre + " </dd> " +
                "     <dt>Economico:</dt> " +
                "     <dd> " + $scope.economico + " </dd> " +
                " </dl> " +
                " </div> " +
                " <div class='col-sm-4'> <img src='images/camioneta.JPG'  style='width:100%'/>" +
                " </div> " +
                "</div>" +
                "";
            else $scope.cadenaConfirma = "<h4>Está a punto de eliminar la unidad ¿Desea continuar?</h4>"

            bootbox.confirm({
                title: "¿Desea continuar?",
                message: $scope.cadenaConfirma,
                size: 'large',
                buttons: {
                    confirm: {
                        label: 'Sí',
                        className: 'btn-success'
                    },
                    cancel: {
                        label: 'No',
                        className: 'btn-danger'
                    }
                },
                callback: function(result) {
                    if (result) resolve(1)
                    else {
                        reject(2);
                        $('#modalAddUnidad').modal('show');
                    }
                }
            })
        }).then(function(operacion) {
            new Promise(function(resolve, reject) {
                if ($scope.bloquea == true) $scope.tipo = 0;
                if ($scope.bloquea == false) $scope.tipo = 1;
                var datos = {
                    numserie: $scope.numserie,
                    idMarca: $scope.marcaActual.idMarca,
                    modelo: $scope.modelo,
                    tarjeta: $scope.tarjeta,
                    motor: $scope.motor,
                    color: $scope.color,
                    placas: $scope.placas,
                    idTipoCarga: $scope.tipoActual.idTipoCarga,
                    capacidad: $scope.capacidad,
                    metrosCubicos: $scope.metroscu,
                    idEmpresa: $scope.empresaActual.emp_idempresa,
                    anio: $scope.anio,
                    peso: $scope.pesoActual.idPesoUnidad,
                    combustible: $scope.tipoCActual.idCombustible,
                    idUsuario: $scope.Usuario.idUsuario,
                    economico: $scope.economico

                };


                if ($scope.add == true) {
                    unidadRepository.postCreate(datos).then(function(result) {

                        resolve(result.data);
                    });
                } else {
                    datos.idUnidad = $scope.idUnidad;
                    datos.estatus = $scope.tipo;

                    unidadRepository.postUpdate(datos).then(function(result) {

                        resolve(result.data);
                    });
                }


            }).then(function(respuesta) {

                $scope.limpaValores();

                if (respuesta[0].estatus == 'ok') {
                    $scope.cambioEmpresa();
                    bootbox.alert({
                        title: 'Operacion realizada!!.',
                        message: '<div class="col-sm-12 text-center"><div class="iconoExito"><i class="fa fa-check icon-circle icon-3x"></i></div></div>',
                        size: 'large',
                        callback: function() {
                            $('#modalAddOperador').modal('hide')
                            
                        }
                    });
                   
                    } 
                    else if (respuesta[0].estatus == 'existe'){
                    $scope.cambioEmpresa();
                    bootbox.alert({
                        title: 'La unidad ya se encuentra registrada.',
                        message: '<div class="col-sm-12 text-center"><div class="iconoError"><i class="fa fa-close icon-circle icon-3x"></i></div></div>',
                        size: 'large',
                        callback: function() {
                            $('#modalAddOperador').modal('hide')
                            
                        }
                    });
                    }
                    else {
                    bootbox.alert({
                        title: respuesta.mensaje,
                        message: '<div class="col-sm-12 text-center"><div class="iconoError"><i class="fa fa-close icon-circle icon-3x"></i></div></div>',
                        size: 'large',
                        callback: function() {
                            $('#modalAddOperador').modal('hide')
                        }
                    });
                }
            });
        }); //fin promise     
    };

    $scope.limpaValores = function() {
        $scope.marcaActual.idMarca = "";
        $scope.tipoActual.idTipoCarga = "";
        $scope.tipoCActual.idCombustible = "";
        $scope.marcaActual = $scope.marcas[0];
        $scope.tipoActual = $scope.tipos[0];
        $scope.tipoCActual = $scope.tiposC[0];
        $scope.idUnidad = "";
        $scope.modelo = "";
        $scope.color = "";
        $scope.placas = "";
        $scope.capacidad = "";
        $scope.numserie = "";
        $scope.metroscu = "";
        $scope.anio = "";
        $scope.tarjeta = "";
        $scope.motor = "";
        $scope.economico = "";
    };

    $scope.salir = function() {
         $scope.limpaValores();
        $('#modalAddUnidad').modal('hide');

    };

    $scope.modalUnidad = function(unidad, tipo) {
        $scope.pesoActual = $scope.pesos[0];
        $('#modalAddUnidad').modal('show');
        if (tipo == 1) {
            $scope.add = true;
            $scope.bloquea = false;
            $scope.limpaValores();
            $scope.texto = "Guardar ";
        }
        if (tipo == 2) {
            $scope.add = false;
            $scope.bloquea = false;
            $scope.texto = "Actualizar ";
        } else if (tipo == 3) {
            $scope.add = false;
            $scope.bloquea = true;
            $scope.texto = "Eliminar ";
        }
        if (unidad != null) {
            $scope.marcaActual.idMarca = unidad.idMarca;
            $scope.marcaActual.descripcion = unidad.descripcion;
            $scope.tipoActual.Descripcion = unidad.Tipo;
            $scope.tipoActual.idTipoCarga = unidad.idTipoCarga;
            $scope.idUnidad = unidad.idUnidad;
            $scope.modelo = unidad.modelo;
            $scope.color = unidad.color;
            $scope.placas = unidad.placas;
            $scope.capacidad = unidad.capacidad;
            $scope.numserie = unidad.numeroSerie;
            $scope.metroscu = unidad.metrosCubicos;
            $scope.anio = unidad.anio;
            $scope.pesoActual.descpeso = unidad.descripcionP;
            $scope.pesoActual.idPesoUnidad = unidad.idPesoUnidad;
            $scope.tarjeta = unidad.tarjeta;
            $scope.motor = unidad.motor;
            $scope.tipoCActual.nombre = unidad.combustible;
            $scope.tipoCActual.idCombustible = unidad.idCombustible;
            $scope.economico = unidad.economico;
        }
    };


   $scope.setTablePaging = function(idTable) {
        $('#' + idTable).DataTable().destroy();
        $('#' + idTable + ' thead th').each(function() {
            var titulo = $(this).text()
            $(this).html(titulo + '<br><input type="text" class="filtro-tabla"/>')
        })
        setTimeout(function() {
            var table = $('#' + idTable).DataTable({
                dom: '<"html5buttons"B>lTfgitp',
                order: [0, 'desc'],
                buttons: [{
                    extend: 'copy'
                }, {
                    extend: 'csv'
                }, {
                    extend: 'excel',
                    title: 'ExampleFile'
                }, {
                    extend: 'pdf',
                    title: 'ExampleFile'
                }, {
                    extend: 'print',
                    customize: function(win) {
                        $(win.document.body).addClass('white-bg');
                        $(win.document.body).css('font-size', '7px');
                        $(win.document.body).find('table')
                            .addClass('compact')
                            .css('font-size', 'inherit');
                    }
                }]
            });
            table.columns().every(function() {
                var that = this

                $('input', this.header()).on('keyup change', function() {
                    if (that.search() !== this.value) {
                        that
                            .search(this.value)
                            .draw()
                    }
                })
            })
        }, 100);
    }; //end setTablePaging

});