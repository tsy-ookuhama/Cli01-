sap.ui.define([ 
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"sap/m/ColumnListItem",
	"sap/m/Label",
	"sap/m/Token",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/odata/ODataModel",
	"sap/ui/core/format/DateFormat"
], function (
	BaseController,
	JSONModel,
	History, ColumnListItem, Label, Token, Controller, ODataModel,
	DateFormat
) {
	"use strict";

	return BaseController.extend("zbrlogu000001.controller.ObjectOF4", {

		getCfopModel: function(){
			// Return model based in OData Service
			return new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZBRLOG_COCKPIT_PORTARIA_SRV/");
		},
		
		onDisplay: function(oEvent) {
			var currentItem = this.getOwnerComponent().getModel("currentItem");
			this.getView().setModel(currentItem);

			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var iOriginalBusyDelay,
				oViewModel = new JSONModel({
					busy : true,
					delay : 0
				});

			var currentItem = this.getOwnerComponent().getModel("currentItem");
			this.getView().setModel(currentItem);
			
			var CFOPdata = new sap.ui.model.json.JSONModel;
			
			var urlCfop = "/sap/opu/odata/sap/ZBRLOG_COCKPIT_PORTARIA_SRV/CFOPs?$filter=Torid eq '" + currentItem.oData.Ordem + "'";
			var aCfopData = jQuery.ajax({
				type: "GET",
				url: urlCfop,
				dataType: "json",
				async: false,
				success: function(data, textStatus, jqXHR) {
					CFOPdata.setData(data);
				},
				error: function(e,jqXHR,textStatus,err,data) {
					console.log(e);
					console.log(jqXHR);
					console.log(textStatus);
					console.log(err);
					console.log(data);
					MessageToast.show("Erro no Processamento", {
						duration: 100000
					});
				}

			})
			
			var CFOPTable = this.byId("cfopTable");
			CFOPTable.setModel(CFOPdata);
// Notas fiscais
			var NFSdata = new sap.ui.model.json.JSONModel;
			
			var urlNfs = "/sap/opu/odata/sap/ZBRLOG_COCKPIT_PORTARIA_SRV/NFs?$filter=Torid eq '" + currentItem.oData.Ordem + "'";
			var aNfsData = jQuery.ajax({
				type: "GET",
				url: urlNfs,
				dataType: "json",
				async: false,
				success: function(data, textStatus, jqXHR) {
					NFSdata.setData(data);
				},
				error: function(e,jqXHR,textStatus,err,data) {
					console.log(e);
					console.log(jqXHR);
					console.log(textStatus);
					console.log(err);
					console.log(data);
					MessageToast.show("Erro no Processamento", {
						duration: 100000
					});
				}
			})
			
			var NFSTable = this.byId("nfsTable");
			NFSTable.setModel(NFSdata);

		},
		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit : function () {
		    var router = this.getOwnerComponent().getRouter();
		    var target = router.getTarget("objectOF4");
		    target.attachDisplay(this.onDisplay, this);

			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var iOriginalBusyDelay,
				oViewModel = new JSONModel({
					busy : true,
					delay : 0
				});

			var currentItem = this.getOwnerComponent().getModel("currentItem");
			this.getView().setModel(currentItem);
						
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */


		/**
		 * Event handler  for navigating back.
		 * It there is a history entry we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the worklist route.
		 * @public
		 */
		onPressImprimir : function() {
			window.print();
		},
		
		onPressImprimir2 : function() {
			var currentItem = this.getOwnerComponent().getModel("currentItem");

			var CFOPdata = new sap.ui.model.json.JSONModel;
			// CFOP			
						var urlCfop = "/sap/opu/odata/sap/ZBRLOG_COCKPIT_PORTARIA_SRV/CFOPs?$filter=Torid eq '" + currentItem.oData.Ordem + "'";
						var aCfopData = jQuery.ajax({
							type: "GET",
							url: urlCfop,
							dataType: "json",
							async: false,
							success: function(data, textStatus, jqXHR) {
								CFOPdata.setData(data);
							},
							error: function(e,jqXHR,textStatus,err,data) {
								console.log(e);
								console.log(jqXHR);
								console.log(textStatus);
								console.log(err);
								console.log(data);
								MessageToast.show("Erro no Processamento", {
									duration: 100000
								});
							}

						})
						
						var CFOPTable = this.byId("cfopTable");
						CFOPTable.setModel(CFOPdata);
			// Notas fiscais
						var NFSdata = new sap.ui.model.json.JSONModel;
						
						var urlNfs = "/sap/opu/odata/sap/ZBRLOG_COCKPIT_PORTARIA_SRV/NFs?$filter=Torid eq '" + currentItem.oData.Ordem + "'";
						var aNfsData = jQuery.ajax({
							type: "GET",
							url: urlNfs,
							dataType: "json",
							async: false,
							success: function(data, textStatus, jqXHR) {
								NFSdata.setData(data);
							},
							error: function(e,jqXHR,textStatus,err,data) {
								console.log(e);
								console.log(jqXHR);
								console.log(textStatus);
								console.log(err);
								console.log(data);
								MessageToast.show("Erro no Processamento", {
									duration: 100000
								});
							}
						})

			
			var i;
			var header = '<center><h3>Cockpit Portaria</h3></center><hr><left><h2>Ordem de Frete: '
			             + currentItem.oData.Ordem +'</h2></left><hr><br>'
			             + '<left><h3>Detalhes da Ordem de Frete</h3></left><hr>'
			             + 'Cliente: '+ currentItem.oData.Cliente +'<br>'
			             + 'Transportadora: '+ currentItem.oData.Transportador +'<br>'
			             + 'Motorista: '+ currentItem.oData.Motorista + ' ' + currentItem.oData.BpName +'<br>'
			             + 'Placa: '+ currentItem.oData.Placa + ' ' + currentItem.oData.PlacaUf +'<br><br><br>'
			             + '<left><h3>Movimentação Interna</h3></left><hr>'
			             + 'Entrada do veículo: '+ currentItem.oData.Z02ChangedOned +'<br>'
			             + 'Usuário checkin: '+ currentItem.oData.Z02ChangedBy +'<br>'
			             + 'Saída do veículo: '+ currentItem.oData.Z04ChangedOned +'<br>'
			             + 'Usuário checkout: '+ currentItem.oData.Z04ChangedBy +'<br>';
			//CFOP
			var tableCfop = '<table width="100%">'
				          + '<tr>'
				          + '<th align="left">CFOP</th>'
				          + '<th align="left">Descrição CFOP</th>'
				          + '</tr>';
            for(i=0;i<CFOPdata.oData.d.results.length ; i++){
			    tableCfop+= '<tr>'
                +'<td>'+CFOPdata.oData.d.results[i].Cfop   +'</td>'				
                +'<td>'+CFOPdata.oData.d.results[i].Cfotxt +'</td>'
                +'</tr>';		
            };
			tableCfop+= '</table>' ;
			//NFs
			var tableNfs = '<table width="100%">'
				         + '<tr>'
				         + '<th align="left">Nota Fiscal</th>'
				         + '<th align="left">ASN Relevante</th>'
				         + '<th align="left">ASN Enviado</th>'
				         + '<th align="left">ASN Data</th>'
				         + '</tr>';
            for(i=0;i<aNfsData.responseJSON.d.results.length ; i++){
    			tableNfs+= '<tr>'
				 + '<td>'+ aNfsData.responseJSON.d.results[i].Nfenum         + '</td>'				
				 + '<td>'+ aNfsData.responseJSON.d.results[i].AsnRelevante   + '</td>'				
				 + '<td>'+ aNfsData.responseJSON.d.results[i].AsnEnviado     + '</td>'				
				 + '<td>'+ aNfsData.responseJSON.d.results[i].AsnDatahoratxt + '</td>'
				 + '</tr>';				
            };
		    tableNfs+= '</table>' ;

		    var ctrlString = "width500px,height=600px";
			var wind = window.open("","PrintWindow",ctrlString);
			
			wind.document.write(header+'<br>'+tableCfop+'<br>'+tableNfs);
			wind.print();
//			wind.close();
		},

		onNavBack : function() {
			var sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getRouter().navTo("worklist", {}, true);
			}
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched : function (oEvent) {
			var sObjectId =  oEvent.getParameter("arguments").objectId;
			//this.getModel().metadataLoaded().then( function() {
			//	var sObjectPath = this.getModel().createKey("Ordens", {
			//		Ordemfrete :  sObjectId
			//	});
			//	this._bindView("/" + sObjectPath);
			//}.bind(this));
		},

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound
		 * @private
		 */
		_bindView : function (sObjectPath) {
			var oViewModel = this.getModel("objectView"),
				oDataModel = this.getModel();

			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						oDataModel.metadataLoaded().then(function () {
							// Busy indicator on view should only be set if metadata is loaded,
							// otherwise there may be two busy indications next to each other on the
							// screen. This happens because route matched handler already calls '_bindView'
							// while metadata is loaded.
							oViewModel.setProperty("/busy", true);
						});
					},
					dataReceived: function () {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},

		_onBindingChange : function () {
			var oView = this.getView(),
				oViewModel = this.getModel("objectView"),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("objectNotFound");
				return;
			}

			var oResourceBundle = this.getResourceBundle(),
				oObject = oView.getBindingContext().getObject(),
				sObjectId = oObject.Ordemfrete,
				sObjectName = oObject.Ordemfrete;

			oViewModel.setProperty("/busy", false);
			oViewModel.setProperty("/shareSendEmailSubject",
			oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage",
			oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
	         // Update the comments in the list
	         var oList = this.byId("idCommentsList");
	         var oBinding = oList.getBinding("items");
	         oBinding.filter(new Filter("Ordemfrete", FilterOperator.EQ, sObjectId));
	      },
	      /**
	      * Updates the model with the user comments on Products.
	      * @function
	      * @param {sap.ui.base.Event} oEvent object of the user input
	      */
	      onPost: function (oEvent) {
	         var oFormat = DateFormat.getDateTimeInstance({style: "medium"});
	         var sDate = oFormat.format(new Date());
	         var oObject = this.getView().getBindingContext().getObject();
	         var sValue = oEvent.getParameter("value");
	         var oEntry = {
	        		 Ordemfrete: oObject.Ordemfrete,
	             type: "Comment",
	             date: sDate,
	             comment: sValue
	         };
	         // update model
	         var oFeedbackModel = this.getModel("productFeedback");
	         var aEntries = oFeedbackModel.getData().productComments;
	         aEntries.push(oEntry);
	         oFeedbackModel.setData({
	            productComments : aEntries
	         });
	      }
	});

});