registrationModule.controller('rutaController', function($sce, $http, $scope, $rootScope, $location, $timeout, alertFactory, rutaRepository, filterFactory, userFactory, globalFactory, operadorRepository, unidadRepository, direccionRepository) {


    $scope.newRuta = true;
    $scope.gridRutas = false;
    $scope.verdir = false;
    $scope.dirForadd = [];
    $scope.inputNewRuta = true;
    $scope.hideListCatRut = true;
    $scope.editar = false;
    $scope.direcciones = [];
    $scope.direccionesTe = [];
    $scope.seleccionado = [];
    $scope.tipo = 1;
    $scope.texto = "";
    $scope.blqo = false;
    $scope.blqu = false;


    $scope.init = function() {
        $scope.Usuario = userFactory.getUserData();
        $scope.getEmpresas();

    };


    $scope.getEmpresas = function() {
        filterFactory.getEmpresas($scope.Usuario.idUsuario, $scope.Usuario.rol).then(function(result) {
            if (result.data.length > 0) {

                $scope.empresas = result.data;
                $scope.empresaActual = $scope.empresas[0];

                if (localStorage.getItem('pedEmpresa') !== null) {
                    $scope.pedEmpresa = [];
                    $scope.tempPedEmp = localStorage.getItem('pedEmpresa');
                    $scope.pedEmpresa.push(JSON.parse($scope.tempPedEmp));
                    setTimeout(function() {
                        $("#selEmpresas").val($scope.pedEmpresa[0][0].emp_idempresa);
                        $scope.empresaActual = $scope.pedEmpresa[0][0];
                    }, 100);
                }
            } else {
                alertFactory.success('No se encontraron empresas');
                $scope.newRuta = true;
            }
        });
    };


    $scope.cambioEmpresa = function() {
        $scope.rutas = [];
        $('#tblRutas').DataTable().destroy();
        if ($scope.empresaActual.emp_idempresa > 0) {
            $scope.newRuta = false;

            rutaRepository.getRutas($scope.empresaActual.emp_idempresa).then(function(result) {
                if (result.data.length > 0) {
                    $scope.gridRutas = true;
                    $scope.rutas = result.data;
                    setTimeout(function() {
                        $scope.setTablePaging('tblRutas');
                        $("#tblRutas_length").removeClass("dataTables_info").addClass("hide-div");
                        $("#tblRutas_filter").removeClass("dataTables_info").addClass("pull-left");

                    }, 1);
                }
            });
        } else $scope.newRuta = true;
    };


    $scope.verModalRuta = function(ruta, tipo) {

        $('#modalAddRuta').modal('show');

        if (tipo == 1) {
            $scope.add = true;
            $scope.bloquea = false;
            $scope.texto = "Guardar ";

        } else if (tipo == 2) {
            $scope.add = false;
            $scope.bloquea = false;
            $scope.texto = "Actualizar ";
        } else if (tipo == 3) {
            $scope.add = false;
            $scope.bloquea = true;
            $scope.texto = "Eliminar ";
        }
        if (ruta != null) {
            $scope.idRuta = ruta.idRuta;
            $scope.nombreRuta = ruta.ruta;
            $scope.descripcionUni = ruta.unidad;
            $scope.nombreOperador = ruta.operador;
            $scope.descripcion = ruta.descripcion;
            $scope.idUnidad = ruta.idUnidad;
            $scope.idOperador = ruta.idOperador;
            $scope.unidad = ruta.unidad;
        }


    };


    $scope.ruta = function(tipo) {

        new Promise(function(resolve, reject) {

            // if ($scope.bloquea == false) $scope.cadenaConfirma = "<h4>Está a punto de confirmar la nueva ruta ¿Desea continuar?</h4>"
            // else $scope.cadenaConfirma = "<h4>Está a punto de eliminar la ruta ¿Desea continuar?</h4>"

            // bootbox.confirm($scope.cadenaConfirma,
            //     function(result) {
            //         if (result) resolve(1)
            //         else reject(2)
            //     }
            // )
            if ($scope.bloquea == false) $scope.cadenaConfirma = "Está a punto de confirmar la ruta con la siguiente información: <br/><br/>" +
                " <dl class='dl-horizontal'> " +
                "     <dt>Nombre:</dt> " +
                "     <dd> " + $scope.nombreRuta + " </dd> " +
                "     <dt>Descripción:</dt> " +
                "     <dd> " + $scope.descripcion  + " </dd> " +
                "     <dt>Operador:</dt> " +
                "     <dd> " + $scope.nombreOperador + " </dd> " +
                "     <dt>Unidad:</dt> " +
                "     <dd> " + $scope.unidad + " </dd> " +
                " </dl> " +
                "";
            //"<h4>Está a punto de confirmar  al operador <br/>" + $scope.nombre + " " + $scope.apPaterno + " " + $scope.apMaterno + "<br> con el telefono " + $scope.telefono + " ¿Desea continuar?</h4>"
            else $scope.cadenaConfirma = "<h4>Está a punto de eliminar la Ruta " + $scope.nombreRuta + "¿Desea continuar?</h4>"
            $('#modalAddRuta').modal('hide')
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
                    else {reject(2);  $('#modalAddRuta').modal('show');}
                }
            })

        }).then(function() {
            new Promise(function(resolve, reject) {
                if ($scope.bloquea == true) $scope.tipo = 0;

                var datos = {
                    idUsuario: $scope.Usuario.idUsuario,
                    idEmpresa: $scope.empresaActual.emp_idempresa,
                    nombreRuta: $scope.nombreRuta,
                    descripcion: $scope.descripcion,
                    idOperador: $scope.idOperador,
                    idUnidad: $scope.idUnidad,
                };

                if ($scope.add == true) {

                    rutaRepository.postCreate(datos).then(function(result) {

                        resolve(result.data);
                        $scope.limpiar();
                    });
                } else {
                    datos.idRuta = $scope.idRuta;
                    datos.tipo = $scope.tipo;
                    rutaRepository.postUpdate(datos).then(function(result) {
                        resolve(result.data);
                        $scope.limpiar();
                    });
                }


            }).then(function(respuesta) {

                if (respuesta.estatus = 'ok') {
                    // $scope.cambioEmpresa();
                    // bootbox.alert("<h4> Operacion realizada!!. </h4>",
                    //     function() {
                    //         $('#modal-panelRuta').modal('hide')
                    //     });
                    $scope.cambioEmpresa();

                    bootbox.alert({
                        title: 'Operacion realizada!!.',
                        message: '<div class="col-sm-12 text-center"><div class="iconoExito"><i class="fa fa-check icon-circle icon-3x"></i></div></div>',
                        size: 'large',
                        callback: function() {
                            $('#modalAddRuta').modal('hide')
                            //$state.go("user.aprobacion")
                        }
                    });


                } else {
                    bootbox.alert("<h4>" + respuesta.mensaje + " </h4>",
                        function() {
                            $('#modal-panelRuta').modal('hide')

                        });
                }
            });

        }); //fin promise     

    };

    $scope.getOperadores = function() {
        $('#tblOperadores').DataTable().destroy();
        $scope.listOperadores = [];

        operadorRepository.getOperadores($scope.empresaActual.emp_idempresa).then(function(result) {
            if (result.data.length > 0) {
                $scope.listOperadores = result.data;
                setTimeout(function() {
                    $scope.setTablePaging('tblOperadores');

                    $("#tblOperadores_length").removeClass("dataTables_info").addClass("hide-div");
                    $("#tblOperadores_filter").removeClass("dataTables_info").addClass("pull-left");
                    $('#modalAddRuta').modal('hide');
                    $('#modalOperador').modal('show');
                }, 1);
            } else {
                alertFactory.info("No se encontraron resultados !!");
                $scope.listOperadores = [];
            }
        });
    };

    $scope.seleccionaOpe = function(operador) {
        $scope.nombreOperador = operador.nombre + " " + operador.apellidoPaterno + " " + operador.apellidoMaterno
        $scope.telefonoOperador = operador.telefono;
        $scope.idOperador = operador.idOperador;
        $('#modalOperador').modal('hide');
        $('#modalAddRuta').modal('show');
        $scope.blqo = true;
        $("#nombreOperador").removeClass("sinBorde")
    };

    $scope.getUnidades = function() {
        $('#tblUnidades').DataTable().destroy();
        $scope.listUnidades = [];

        unidadRepository.getUnidades($scope.empresaActual.emp_idempresa).then(function(result) {
            if (result.data.length > 0) {
                $scope.listUnidades = result.data;
                console.log($scope.listUnidades)
                setTimeout(function() {
                    $scope.setTablePaging('tblUnidades');

                    $("#tblUnidades_length").removeClass("dataTables_info").addClass("hide-div");
                    $("#tblUnidades_filter").removeClass("dataTables_info").addClass("pull-left");
                    $('#modalAddRuta').modal('hide');
                    $('#modalUnidad').modal('show');
                }, 1);
            } else {
                alertFactory.info("No se encontraron resultados !!");
                $scope.listUnidades = [];
            }
        });
    };

    $scope.seleccionaUni = function(unidad) {
        console.log(unidad)
        $scope.descripcionUni = unidad.descripcion;
        $scope.modelo = unidad.modelo;
        $scope.color = unidad.color;
        $scope.placas = unidad.placas;
        $scope.Tipo = unidad.Tipo;
        $scope.capacidad = unidad.capacidad;
        $scope.metrosCubicos = unidad.metrosCubicos;
        $scope.idUnidad = unidad.idUnidad;
        $scope.unidad = unidad.descripcion + ' ' + unidad.modelo + ' ' + unidad.anio;
        $('#modalAddRuta').modal('show');
        $('#modalUnidad').modal('hide');
        $scope.blqu = true;
        $("#unidad").removeClass("sinBorde")
    };

    $scope.catalogoRutas = function() {
        rutaRepository.getCatalogoRutas($scope.empresaActual.emp_idempresa).then(function(result) {

            if (result.data.length > 0) {
                $scope.rutas = result.data;
                $scope.rutas.unshift({ nombreRuta: "Seleccioné Ruta..." });
                $scope.rutaActual = $scope.rutas[0];
                $scope.hideListCatRut = false;
            } else { $scope.hideListCatRut = true; }
        });
    };

    $scope.cambioPlantillaRuta = function() {
        if ($scope.rutaActual.idRuta > 0) {
            $scope.inputNewRuta = false;
            $scope.nombreRuta = $scope.rutaActual.nombreRuta;
        } else {
            $scope.inputNewRuta = true;
            $scope.nombreRuta = "";
        }
    };


    $scope.limpiar = function() {

        $scope.nombreRuta = "";
        $scope.descripcionUni = "";
        $scope.nombreOperador = "";
        $scope.descripcion = "";
        $scope.lengthDirSell = "";
        $scope.modelo = "";
        $scope.direcciones = [];
        $scope.verdir = false;
        $scope.dirForadd = [];
        $scope.blqo = false;
        $scope.blqu = false;
        $("#nombreOperador").addClass("sinBorde")
        $("#unidad").addClass("sinBorde")

    };


    $scope.salirOpe = function() {
        $('#modalOperador').modal('hide');
        $('#modalAddRuta').modal('show');
    };

    $scope.salirUni = function() {
        $('#modalUnidad').modal('hide');
        $('#modalAddRuta').modal('show');
    };

    $scope.salir = function() {
        $scope.limpiar();
        $('#modalAddRuta').modal('hide');

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
                        $(win.document.body).css('font-size', '10px');
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