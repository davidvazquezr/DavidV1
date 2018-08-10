registrationModule.controller('despachoController', function($sce, $http, $scope, $rootScope, $location, $timeout, operadorRepository, unidadRepository, alertFactory, rutaRepository, direccionRepository, despachoRepository, filterFactory, userFactory, globalFactory) {

$scope.des=function function_name(argument) {
    var datos = {
                    idDespacho:1,
                    situacion: 2
                }
     despachoRepository.postGnrDespacho(datos).then(function(result) {
                    resolve(result.data);
                });
}

    $scope.despachoAlta = function() {

         $('#modalDetalleDespacho').modal('hide')

        new Promise(function(resolve, reject) {

            $scope.cadenaConfirmaDes = "Está a punto de Iniciar el  Despacho de pedidos "
            bootbox.confirm({
                title: $scope.cadenaConfirmaDes,
                message: "<h4>¿Desea continuar?</h4>",
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
                            $('#modalDetalleDespacho').modal('show');
                         }
                }
            })
        }).then(function(resolve) {


            new Promise(function(resolve, reject) {
                 var datos = {
                    idDespacho: $scope.rutaDetalle.idDespacho,
                    situacion: 2
                }

                despachoRepository.postGnrDespacho(datos).then(function(result) {
                    resolve(result.data);
                });
               
            }).then(function(respuesta) {

                if (respuesta.estatus = 'ok') {
                    $scope.clean();
                    $scope.cambioEmpresa();
                    $scope.limpiaTemporalres();
                  
                    bootbox.alert({
                        title: 'Operacion realizada!!.',
                        message: '<div class="col-sm-12 text-center"><div class="iconoExito"><i class="fa fa-check icon-circle icon-3x"></i></div></div>',
                        size: 'large',
                        callback: function() {
                            $('#modal-panelRuta').modal('hide')
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


    $scope.detalleCot = function(pedido) {

        $scope.direccionEntrega = pedido.dir;
        despachoRepository.getBusquedaPedidoDetalle(pedido.pedidobpro).then(function(result) {

            if (result.data.length > 0) {
                $scope.detalles = result.data;

                var i = 0;
                $scope.subtotal = 0;
                angular.forEach($scope.detalles, function(value, key) {
                    $scope.subtotal += $scope.detalles[i].Precio;
                    i++;
                });
            }

            $('#modalDetalleDespacho').modal('hide');
            $('#modalDetalleCot').modal('show');
        });
    };

    $scope.salirDetalleCot = function() {
        $('#modalDetalleDespacho').modal('show');
        $('#modalDetalleCot').modal('hide');
    };


    $scope.limpiaTemporalres = function() {
        $scope.temp1 = [];
        $scope.temp2 = [];
        $scope.temp3 = [];
        $scope.temp10 = [];
        $scope.temp11 = [];
        $scope.temp13 = [];
        $scope.temp14 = [];
        $scope.flag = false;
        $scope.divsinPedidos = false;
    };



    $scope.salir = function() {


        if( $scope.dirForadd.length > 0 ){

            $scope.temp10 = $scope.direcciones;
            $scope.direcciones = [];
            $('#tblDirecc').DataTable().clear();
            $('#tblDirecc').DataTable().destroy();
            setTimeout(function() {
                $scope.setTablePaging('tblpedidos');
                $("#tblpedidos_length").removeClass("dataTables_info").addClass("hide-div");
                $("#tblpedidos_filter").removeClass("dataTables_info").addClass("pull-left");
            }, 1);

        }

        $('#modalDirecc').modal('hide');
       


    };




    $scope.revisaSeleccion = function() {
        $scope.a = [];
        for (var i = 0; i < $scope.direcciones.length; i++) {
            if ($scope.direcciones[i].seleccionada == false) {
                $scope.a.unshift($scope.direcciones[i]);
            }
        }

        if ($scope.direcciones.length == $scope.a.length) {
            $scope.salir();
            $scope.a = [];

        } else {
            $scope.pasaPedidos();
        }

    };


    $scope.pasaPedidos = function() {

        if ($scope.dirForadd.length > 0) {
            $scope.temp2 = $scope.dirForadd;
        }

        $scope.dirForadd = [];
        $('#tblpedidos').DataTable().clear();
        $('#tblpedidos').DataTable().destroy();


        angular.forEach($scope.direcciones, function(value, key) {

            if (value.seleccionada == true) {
                $scope.dirForadd.unshift(value);
            } else {
                $scope.temp1.unshift(value);
            }
        });

        if ($scope.temp2.length > 0) {
            angular.forEach($scope.temp2, function(value, key) {
                $scope.dirForadd.unshift(value);
            });
            $scope.temp2 = [];
        }

        setTimeout(function() {
            $scope.setTablePaging('tblpedidos');
            $("#tblpedidos_length").removeClass("dataTables_info").addClass("hide-div");
            $("#tblpedidos_filter").removeClass("dataTables_info").addClass("pull-left");
        }, 1);
    };

    $scope.verDirecciones = function() {
        $scope.direcciones = [];
        $('#tblDirecc').DataTable().clear();
        $('#tblDirecc').DataTable().destroy();

        if ($scope.temp10.length > 0) {
            $scope.direcciones = $scope.temp10;
            $scope.temp10 = [];
        } else {
            if ($scope.temp1.length == 0 && $scope.flag == false) {

                despachoRepository.getPedidos($scope.empresaActual.emp_idempresa).then(function(result) {
                    if (result.data.length > 0) {
                        $scope.direcciones = result.data;
                        $scope.flag = true;
                        if ($scope.temp3.length > 0) {
                            angular.forEach($scope.temp3, function(value, key) {
                                value.seleccionada = false;
                                $scope.direcciones.unshift(value);
                            });
                        }

                    } else {
                        $scope.divsinPedidos = true;
                    }

                });

            } else {

                if ($scope.temp1.length == 0) { $scope.divsinPedidos = true; }

                $scope.direcciones = $scope.temp1;
                $scope.temp1 = [];

            }
        }


        if ($scope.temp3.length > 0) {
            angular.forEach($scope.temp3, function(value, key) {
                value.seleccionada = false;
                $scope.direcciones.unshift(value);
            });
        }

        if ($scope.direcciones.length > 0) { $scope.divsinPedidos = false; }
        setTimeout(function() {


            $scope.setTablePaging('tblDirecc');
            $("#tblDirecc_length").removeClass("dataTables_info").addClass("hide-div");
            $("#tblDirecc_filter").removeClass("dataTables_info").addClass("pull-left");
            $('#modalDirecc').modal('show');
            $scope.temp3 = [];
        }, 100);

    };

    $scope.elimina = function(direPedido) {

        console.log(direPedido.pedidobpro)

        $scope.temp4 = [];
        $scope.temp5 = [];

        angular.forEach($scope.dirForadd, function(value, key) {

            if (value.pedidobpro == direPedido.pedidobpro) {
                $scope.temp3.unshift(direPedido);
            } else {
                $scope.temp5.unshift(value);
            }
        });

        $('#tblpedidos').DataTable().clear();
        $('#tblpedidos').DataTable().destroy();

        $scope.dirForadd = $scope.temp5;
        setTimeout(function() {
            $scope.setTablePaging('tblpedidos');
            $("#tblpedidos_length").removeClass("dataTables_info").addClass("hide-div");
            $("#tblpedidos_filter").removeClass("dataTables_info").addClass("pull-left");
        }, 1);
    };


    $scope.editar = function(despacho) {
        $scope.btnVerDespacho = true;
        $scope.btnNewDespacho = false;
        $scope.limpiaTemporalres();
        $scope.edita = true;
        $scope.texto = 'Actualizar';
        $('#tblpedidos').DataTable().clear();
        $('#tblpedidos').DataTable().destroy();

        $scope.idDespacho = despacho.idDespacho;
        $scope.idRuta = despacho.idRuta
        $scope.rutaActual.ruta = despacho.ruta;
        $scope.rutaActual.idRuta = despacho.idRuta;

        $scope.idUnidad = despacho.idUnidad
        $scope.unidad = despacho.unidad
        $scope.idOperador = despacho.idOperador
        $scope.operador = despacho.operador

        //$scope.idOperadorUnidadRuta=despacho.idOperadorUnidadRuta

        direccionRepository.getDireccionesRuta(despacho.idDespacho).then(function(result) {
            $scope.dirForadd = result.data
        });



        setTimeout(function() {
            $scope.setTablePaging('tblpedidos');
            $("#tblpedidos_length").removeClass("dataTables_info").addClass("hide-div");
            $("#tblpedidos_filter").removeClass("dataTables_info").addClass("pull-left");
        }, 1);

        $scope.habilita = true;
        $scope.spanInfo = true;
        $scope.hideListCatRut = false;
        $scope.gridDespachos = false;
        $scope.NDespachos = true;

    };

    $scope.eliminaDespacho = function(despacho) {

        new Promise(function(resolve, reject) {
            $scope.cadenaConfirma = "Está a punto de eliminar el Despacho"

            // bootbox.confirm($scope.cadenaConfirma,
            //     function(result) {
            //         if (result) resolve(1)
            //         else reject(2)
            //     }
            // )
            bootbox.confirm({
                title: $scope.cadenaConfirma,
                message: "<h4>¿Desea continuar?</h4>",
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
                    else reject(2)
                }
            })

        }).then(function() {
            new Promise(function(resolve, reject) {
                var datos = {
                    idDespacho: despacho.idDespacho,
                    idUnidad: despacho.idUnidad,
                    idOperador: despacho.idOperador
                }
                despachoRepository.postDelete(datos).then(function(result) {

                    resolve(result.data);
                    //  $scope.limpiar();
                });

            }).then(function(respuesta) {

                if (respuesta.estatus = 'ok') {
                    $scope.clean();
                    $scope.cambioEmpresa();
                    // bootbox.alert("<h4> Operacion realizada!!. </h4>",
                    //     function() {
                    //         $('#modal-panelRuta').modal('hide')
                    //     });
                    bootbox.alert({
                        title: 'Operacion realizada!!.',
                        message: '<div class="col-sm-12 text-center"><div class="iconoExito"><i class="fa fa-check icon-circle icon-3x"></i></div></div>',
                        size: 'large',
                        callback: function() {
                            $('#modal-panelRuta').modal('hide')
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

    $scope.clean = function() {
        $scope.btnVerDespacho = false;
        $scope.btnNewDespacho = true;
        $scope.spanInfo = false;
        $scope.dirForadd = [];
        $scope.verdir = true;
        $scope.NDespachos = false;
        $scope.texto = 'Crear';
        $scope.habilita = false;
        $scope.edita = false;
        $scope.flag = false;
        $scope.divsinPedidos = false;
    };


    $scope.gnraDespacho = function(tipo) {

        new Promise(function(resolve, reject) {

            $scope.cadenaConfirma = "Está a punto de " + $scope.texto + " el Despacho de pedidos "

            // bootbox.confirm($scope.cadenaConfirma,
            //     function(result) {
            //         if (result) resolve(1)
            //         else reject(2)
            //     }
            // )
            bootbox.confirm({
                title: $scope.cadenaConfirma,
                message: "<h4>¿Desea continuar?</h4>",
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
                    else reject(2)
                }
            })
        }).then(function() {
            new Promise(function(resolve, reject) {
                var datos = {
                    idRuta: $scope.idRuta,
                    idOperador: $scope.idOperador,
                    idUnidad: $scope.idUnidad,
                    direcciones: $scope.dirForadd,
                    //  idOperadorUnidadRuta:$scope.rutaActual.idOperadorUnidadRuta,
                    idEmpresa: $scope.empresaActual.emp_idempresa,
                    idUsuario: $scope.Usuario.idUsuario,
                };


                if ($scope.edita == false) {
                    despachoRepository.postCreate(datos).then(function(result) {

                        resolve(result.data);
                        //  $scope.limpiar();
                    });
                } else {
                    datos.idDespacho = $scope.idDespacho;
                    console.log(datos);
                    despachoRepository.postUpdate(datos).then(function(result) {

                        resolve(result.data);
                        //  $scope.limpiar();
                    });
                }
            }).then(function(respuesta) {

                if (respuesta.estatus = 'ok') {
                    $scope.clean();
                    $scope.cambioEmpresa();
                    $scope.limpiaTemporalres();
                    // bootbox.alert("<h4> Operacion realizada!!. </h4>",
                    //     function() {
                    //         $('#modal-panelRuta').modal('hide')
                    //     });
                    bootbox.alert({
                        title: 'Operacion realizada!!.',
                        message: '<div class="col-sm-12 text-center"><div class="iconoExito"><i class="fa fa-check icon-circle icon-3x"></i></div></div>',
                        size: 'large',
                        callback: function() {
                            $('#modal-panelRuta').modal('hide')
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




    $scope.despacho = function(tipo) {
        $scope.dirForadd = [];
        $scope.btnVerDespacho = true;
        $scope.btnNewDespacho = false;
        $scope.NDespachos = true;
        $scope.gridDespachos = false;
        $scope.texto = 'Crear';
        $scope.habilita = false;
        $scope.spanInfo = false;
        $scope.catalogoRutas();
        $scope.limpiaTemporalres();

    };

    $scope.verDespachos = function() {
        // $scope.gridDespachos=true;
        $scope.btnVerDespacho = false;
        $scope.btnNewDespacho = true;
        $scope.NDespachos = false;
        $scope.gridDespachos = true;
        $scope.limpiaTemporalres();
    };


    $scope.init = function() {
        $scope.clean();
        $scope.limpiaTemporalres();
        $scope.Usuario = userFactory.getUserData();
        $scope.getEmpresas();
    };



    $scope.cambioEmpresa = function() {
        $scope.OperadoresUnidadesRutas = [];
        $('#tblDespachos').DataTable().destroy();
        if ($scope.empresaActual.emp_idempresa > 0) {
            $scope.btnNewDespacho = true;
            $scope.catalogoRutas();

            despachoRepository.getRutas($scope.empresaActual.emp_idempresa).then(function(result) {
                if (result.data.length > 0) {
                    $scope.gridDespachos = true;
                    console.log(result.data)
                    $scope.OperadoresUnidadesRutas = result.data;
                    setTimeout(function() {
                        $scope.setTablePaging('tblDespachos');
                        $("#tblDespachos_length").removeClass("dataTables_info").addClass("hide-div");
                        $("#tblDespachos_filter").removeClass("dataTables_info").addClass("pull-left");

                    }, 1);
                } else $scope.gridDespachos = false;
            });
        } else {
            $scope.btnNewDespacho = false;
            $scope.NDespachos = false;
            $scope.gridDespachos = false;
            $scope.btnVerDespacho = false;

        }
    };

    $scope.getEmpresas = function() {
        filterFactory.getEmpresas($scope.Usuario.idUsuario, $scope.Usuario.rol).then(function(result) {
            if (result.data.length > 0) {

                $scope.empresas = result.data;
                $scope.empresaActual = $scope.empresas[0];

                if (localStorage.getItem('pedEmpresa') !== null) {

                    $scope.pedEmpresa = []

                    $scope.tempPedEmp = localStorage.getItem('pedEmpresa')
                    $scope.pedEmpresa.push(JSON.parse($scope.tempPedEmp))


                    setTimeout(function() {
                        $("#selEmpresas").val($scope.pedEmpresa[0][0].emp_idempresa);
                        $scope.empresaActual = $scope.pedEmpresa[0][0]; //$scope.empresas;

                    }, 100);
                }
            } else {
                alertFactory.success('No se encontraron empresas');
            }
        });
    };

    $scope.catalogoRutas = function() {
        rutaRepository.getRutas($scope.empresaActual.emp_idempresa).then(function(result) {

            if (result.data.length > 0) {
                $scope.rutas = result.data;

                $scope.rutas.unshift({ ruta: "Seleccioné Ruta..." });
                $scope.rutaActual = $scope.rutas[0];
                $scope.hideListCatRut = false;
            } else { $scope.hideListCatRut = true; }

        });
    };

    $scope.cambioPlantillaRuta = function() {
        if ($scope.rutaActual.idRuta > 0) {
            $scope.spanInfo = true;
            $scope.nombreRuta = $scope.rutaActual.nombreRuta;
            $scope.idRuta = $scope.rutaActual.idRuta;
            $scope.operador = $scope.rutaActual.operador;
            $scope.idOperador = $scope.rutaActual.idOperador;
            $scope.unidad = $scope.rutaActual.unidad;
            $scope.idUnidad = $scope.rutaActual.idUnidad;
        } else {
            $scope.spanInfo = false;
            $scope.nombreRuta = "";
            $scope.operador = "";
            $scope.unidad = "";
            //$scope.inputNewRuta = true;
            //$scope.nombreRuta = "";
        }
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
                    $('#modalAddDespacho').modal('hide');
                    $('#modalOperador').modal('show');
                }, 1);
            } else {
                alertFactory.info("No se encontraron resultados !!");
                $scope.listOperadores = [];
            }
        });
    };

    $scope.seleccionaOpe = function(operador) {
        $scope.operador = operador.nombre + " " + operador.apellidoPaterno + " " + operador.apellidoMaterno
        $scope.idOperador = operador.idOperador;
        $('#modalOperador').modal('hide');
        $('#modalAddDespacho').modal('show');
    };

    $scope.getUnidades = function() {
        //$('#tblUnidades').DataTable().destroy();
        $scope.listUnidades = [];

        unidadRepository.getUnidades($scope.empresaActual.emp_idempresa).then(function(result) {
            if (result.data.length > 0) {
                $scope.listUnidades = result.data;

                setTimeout(function() {
                    $scope.setTablePaging('tblUnidades');

                    $("#tblUnidades_length").removeClass("dataTables_info").addClass("hide-div");
                    $("#tblUnidades_filter").removeClass("dataTables_info").addClass("pull-left");
                    $('#modalAddDespacho').modal('hide');
                    $('#modalUnidad').modal('show');
                }, 1);
            } else {
                alertFactory.info("No se encontraron resultados !!");
                $scope.listUnidades = [];
            }
        });
    };

    $scope.seleccionaUni = function(unidad) {
        $scope.unidad = unidad.descripcion + " " + unidad.modelo + " " + unidad.anio;
        $scope.idUnidad = unidad.idUnidad;
        $('#modalAddDespacho').modal('show');
        $('#modalUnidad').modal('hide');
    };


    $scope.ver = function(elementoRuta) {
        $scope.rutaDetalle = elementoRuta;
        console.log($scope.rutaDetalle);
        direccionRepository.getDireccionesRuta($scope.rutaDetalle.idDespacho).then(function(result) {
            console.log(result.data);
            $scope.pedidoDireccionesRuta = result.data;
            $scope.numDirRut = result.data.length;
            $('#modalDetalleDespacho').modal('show');
            
            
        });

    };


    $scope.imprimir = function() {
        $scope.rutaDetalle.numDirRut = $scope.numDirRut;
        $scope.rutaDetalle.pedidos = $scope.pedidoDireccionesRuta;
        var rptStructure = {};
        rptStructure = $scope.rutaDetalle;
        var jsonData = {
            "template": { "name": "despachoRutaRefacciones_rpt" },
            "data": rptStructure
        }

        console.log(rptStructure);

        $scope.generarPDF(jsonData);
    };


    $scope.generarPDF = function(jsonData) {
        new Promise(function(resolve, reject) {
            resolve(jsonData);
        }).then(function(jsonData) {
            despachoRepository.getReportePdf(jsonData).then(function(result) {
                var file = new Blob([result.data], { type: 'application/pdf' });
                var fileURL = URL.createObjectURL(file);
                $scope.rptResumenConciliacion = $sce.trustAsResourceUrl(fileURL);
                window.open($scope.rptResumenConciliacion);
                //    $('#reporteModalPdf').modal('show'); 
            });
        });
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

    $scope.setTablePagingSinFiltro = function(idTable) {        
        $('#' + idTable).DataTable().destroy();
        setTimeout(function() {
            $('#' + idTable).DataTable({
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
        }, 100);
    }; //end setTablePaging




});