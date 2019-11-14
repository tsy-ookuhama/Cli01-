sap.ui.define([
	"zbrlogu000001/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/ColumnListItem",
	"sap/m/Label",
	"sap/m/Token",
	"sap/m/MessageToast"
], function (BaseController, JSONModel, ColumnListItem, Label, Token, MessageToast) {
	"use strict";
	return BaseController.extend("zbrlogu000001.controller.Parameters", {
		/**
		* Called when a controller is instantiated and its View controls (if available) are already created.
		* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		* @memberOf valuehelpdialogf4.main
		*/
			getZModel: function(){
				// Return model based in OData Service
				return new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZBRLOG_SH_WERKS_SRV/");
			},

			getModel: function(){
				// Return model based in OData Service
				return new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZBRLOG_COCKPIT_PORTARIA_SRV/");
			},
			
			onInit: function() {
				
				var oModel = this.getModel();
				
				this.setParametrosGerais();

			},

		/**
		* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		* (NOT before the first rendering! onInit() is used for that one!).
		* @memberOf valuehelpdialogf4.main
		*/
//			onBeforeRendering: function() {
		//
//			},

		/**
		* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		* This hook is the same one that SAPUI5 controls get after being rendered.
		* @memberOf valuehelpdialogf4.main
		*/
//			onAfterRendering: function() {
		//
//			},

		/**
		* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		* @memberOf valuehelpdialogf4.main
		*/

			onPress: function (oEvent) {
				
				if(sap.ui.getCore().hasModel()) {
				var oModel = sap.ui.getCore().getModel();
				oModel.setData(null);
				}
				
				var parameters = this.getParametrosGerais();
				var _pdias = parameters.oData.diasLimite;
				var pdias = parseInt(_pdias);
				var guid = parameters.oData.guid;
				
				if(this.getView().byId("idInput").getTokens().length === 0) {
					MessageToast.show("Informe a planta");
					return;
				}
				
				var index = this.getView().byId("idInput").getTokens().length - 1;
				
                var _werks = this.getView().byId("idInput").getTokens()[index].getKey();
                var _dataDe = this.getView().byId("dataDe").getDateValue();
                var _dataAte = this.getView().byId("dataAte").getDateValue();
                // busca a data limite baseado na data inicial + no parametro da TVARV
                var limiteData = new Date();
                limiteData.setDate(_dataDe.getDate() + pdias); // Adiciona pdias dias    
                //
				if (_dataDe !== null && _dataAte !== null && _dataDe <= _dataAte){
					if (_dataAte <= limiteData){
						var oViewModel = new JSONModel({
							werks : _werks,
							dataDe : this.getView().byId("dataDe").getDateValue(),
							dataAte: this.getView().byId("dataAte").getDateValue(),
							guid: guid
						});
					} else {
 						MessageToast.show("Intervalo de datas superior a " + pdias + " dias");
 						return;
					};
					this.setParameters(oViewModel);
					this.getRouter().navTo("worklist");
				} else {
					if (_dataDe === null || _dataAte == null) {
						MessageToast.show("Forneça datas válidas")
					} else {
 						MessageToast.show("A data final deve ser maior que a data inicial")
					}
					
				}
			},
			
			handleF4Planta: function(){
				var oInput = this.getView().byId("idInput");
				//oInput.removeAllTokens();
				
				if(!this._oValueHelpDialog){
					this._oValueHelpDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog("", {
						supportMultiselect: false,
						supportRanges: true,
						key: "Werks",
						descriptionKey: "Name1",
						ok: function(oEvent){
							var aTokens = oEvent.getParameter("tokens");
							oInput.setTokens(aTokens);
							this.close();
						},
						cancel: function(){
							this.close();
						}
					});
				}

				// Bind
				// Criando as colunas 
				var oColModel = new sap.ui.model.json.JSONModel();
				oColModel.setData({
					cols: [
							{label: "id Planta", template: "Werks"},
							{label: "Nome da Planta", template: "Name1"}
						  ]
				});
				
				var oTable = this._oValueHelpDialog.getTable();
				oTable.setModel(oColModel, "columns")
				
				//Binding da tabela
				//var oRowModel = new sap.ui.model.json.JSONModel("model/mock.json");
				//oTable.setModel(oRowModel);
				oTable.setModel(this.getZModel());
				oTable.bindRows("/HT001wSet");
				
				this._oValueHelpDialog.setRangeKeyFields([
					{label: "id Planta", key: "Werks"}, 
					{label: "Nome da Planta", key: "Name1"}]);

				this._oValueHelpDialog.open();
			},
	   }
	);
});