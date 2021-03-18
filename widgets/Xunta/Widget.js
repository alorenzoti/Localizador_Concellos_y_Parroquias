define(['dojo/_base/declare', 'jimu/BaseWidget', "esri/tasks/QueryTask", "esri/tasks/query", "dojo/_base/lang", "esri/SpatialReference", "esri/graphic", "esri/symbols/SimpleFillSymbol", "esri/Color", "esri/symbols/SimpleLineSymbol"], function (declare, BaseWidget, QueryTask, Query, lang, SpatialReference, Graphic, SimpleFillSymbol, Color, SimpleLineSymbol) {
      //To create a widget, you need to derive from BaseWidget.
      return declare([BaseWidget], {

            // Custom widget code goes here

            baseClass: 'xunta',
            // this property is set by the framework when widget is loaded.
            // name: 'Xunta',
            // add additional properties here

            //methods to communication with app container:
            postCreate: function postCreate() {
                  this.inherited(arguments);
                  console.log('Xunta::postCreate');
            },
            cargaConcellos: function cargaConcellos() {

                  var codigoProvincia = this.selectProvincia.value;
                  if (codigoProvincia == -1) return;

                  this.selectConcellos.innerHTML = "";

                  var queryTask = new QueryTask(this.config.concellosService);

                  var query = new Query();
                  query.returnGeometry = false;
                  query.outFields = ["CODCONC", "CONCELLO"];
                  query.orderByFields = ["CONCELLO"];
                  query.where = "CODPROV =" + codigoProvincia;

                  queryTask.execute(query, lang.hitch(this, function (results) {
                        var opt = document.createElement("option");
                        opt.value = -1;
                        opt.text = "Seleccione concello";
                        this.selectConcellos.add(opt);
                        for (var i = 0; i < results.features.length; i++) {
                              opt = document.createElement("option");
                              opt.value = results.features[i].attributes.CODCONC;
                              opt.text = results.features[i].attributes.CONCELLO;
                              this.selectConcellos.add(opt);
                        }
                  }));
            },
            cargaParroquias: function cargaParroquias() {
                  var codigoConcello = this.selectConcellos.value;
                  if (codigoConcello == -1) return;

                  this.selectParroquias.innerHTML = "";

                  var queryTask = new QueryTask(this.config.parroquiasService);

                  var query = new Query();
                  query.returnGeometry = false;
                  query.outFields = ["CODPARRO", "PARROQUIA"];
                  query.orderByFields = ["PARROQUIA"];
                  query.where = "CODCONC =" + codigoConcello;

                  queryTask.execute(query, lang.hitch(this, function (results) {
                        var opt = document.createElement("option");
                        opt.value = -1;
                        opt.text = "Seleccione parroquia";
                        this.selectParroquias.add(opt);

                        for (var i = 0; i < results.features.length; i++) {
                              opt = document.createElement("option");
                              opt.value = results.features[i].attributes.CODPARRO;
                              opt.text = results.features[i].attributes.PARROQUIA;
                              this.selectParroquias.add(opt);
                        }
                  }));
            },
            zoomConcello: function zoomConcello() {
                  var codigoConcello = this.selectConcellos.value;
                  if (codigoConcello == -1) return;

                  var queryTask = new QueryTask(this.config.concellosService);

                  var query = new Query();
                  query.returnGeometry = true;
                  query.outFields = ["CODCONC", "CONCELLO"];
                  query.orderByFields = ["CONCELLO"];
                  query.where = "CODCONC =" + codigoConcello;
                  query.outSpatialReference = new SpatialReference(102100);
                  queryTask.execute(query, lang.hitch(this, function (results) {
                        if (results.features.length > 0) {
                              var geom = results.features[0].geometry;
                              this.map.graphics.clear();
                              this.map.graphics.add(new Graphic(geom, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([1, 1, 1]), 2), new Color([1, 1, 1, 0.25]))));
                              this.map.setExtent(geom.getExtent(), true);
                        }
                  }));
            },
            zoomParroquia: function zoomParroquia() {
                  var codigoParroquia = this.selectParroquias.value;
                  if (codigoParroquia == -1) return;

                  var queryTask = new QueryTask(this.config.parroquiasService);

                  var query = new Query();
                  query.returnGeometry = true;
                  query.outFields = ["CODPARRO ", "PARROQUIA "];
                  query.orderByFields = ["PARROQUIA"];
                  query.where = "CODPARRO =" + codigoParroquia;
                  query.outSpatialReference = new SpatialReference(102100);
                  queryTask.execute(query, lang.hitch(this, function (results) {
                        if (results.features.length > 0) {
                              var geom = results.features[0].geometry;
                              this.map.graphics.clear();
                              this.map.graphics.add(new Graphic(geom, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([100, 100, 100]), 2), new Color([100, 100, 100, 0.25]))));
                              this.map.setExtent(geom.getExtent(), true);
                        }
                  }));
            }
      });
});
//# sourceMappingURL=Widget.js.map
