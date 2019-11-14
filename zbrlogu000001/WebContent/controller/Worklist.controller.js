sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"zbrlogu000001/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, JSONModel, formatter, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("zbrlogu000001.controller.Worklist", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */
		
		onDisplay: function(oEvent) {
			var sTitle,
			oTable = this.byId("table"),
			oViewModel = this.getModel("worklistView"),
			iTotalItems = oEvent.getParameter("total");
		
		var reason = oEvent.getParameters("reason").reason;
		var aFilter   = [];
		var filtroZ01 = [];
		var filtroZ02 = [];
		var filtroZ04 = [];
		
		filtroZ01.push(new Filter("EventCode", FilterOperator.EQ, "Z01"));
		filtroZ02.push(new Filter("EventCode", FilterOperator.EQ, "Z02"));
		filtroZ04.push(new Filter("EventCode", FilterOperator.EQ, "Z04"));
		
		//if(reason != "Filter") {
			
			var parameters = this.getParameters();
			
			// build filter array
			aFilter.push(new Filter("Werks", FilterOperator.EQ, parameters.oData.werks));
			filtroZ01.push(new Filter("Werks", FilterOperator.EQ, parameters.oData.werks));
			filtroZ02.push(new Filter("Werks", FilterOperator.EQ, parameters.oData.werks));
			filtroZ04.push(new Filter("Werks", FilterOperator.EQ, parameters.oData.werks));
			
			if(parameters.oData.dataDe != null) {
				aFilter.push(new Filter("Erdat", FilterOperator.BT, parameters.oData.dataDe, parameters.oData.dataAte));
				filtroZ01.push(new Filter("Erdat", FilterOperator.BT, parameters.oData.dataDe, parameters.oData.dataAte));
				filtroZ02.push(new Filter("Erdat", FilterOperator.BT, parameters.oData.dataDe, parameters.oData.dataAte));
				filtroZ04.push(new Filter("Erdat", FilterOperator.BT, parameters.oData.dataDe, parameters.oData.dataAte));
			}

			// filter binding
			var oBinding = oTable.getBinding("items");
			oBinding.filter(aFilter);				

			// only update the counter if the length is final and
			// the table is not empty
			//if (iTotalItems > 0) { // && oTable.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
				// Get the count for all the products and set the value to 'countAll' property
				this.getModel().read("/Ordens/$count", {
					success: function (oData) {
						oViewModel.setProperty("/countAll", oData);
					},
					filters: aFilter
				});
				// read the count for the naoChegaram filter
				this.getModel().read("/Ordens/$count", {
					success: function (oData) {
						oViewModel.setProperty("/naoChegaram", oData);
					},
					filters: filtroZ01
				});
				// read the count for the naPlanta filter
				this.getModel().read("/Ordens/$count", {
					success: function(oData){
						oViewModel.setProperty("/naPlanta", oData);
					},
					filters: filtroZ02
				});  
				// read the count for the despachados filter
				this.getModel().read("/Ordens/$count", { 
					success: function(oData){
						oViewModel.setProperty("/despachados", oData);
					},
					filters: filtroZ04
				});
			//} else {
			//	sTitle = this.getResourceBundle().getText("worklistTableTitle");
			//}
			this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
			
		
		},      

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit : function () {
			
		    var router = this.getOwnerComponent().getRouter();
		    var target = router.getTarget("worklist");
		    target.attachDisplay(this.onDisplay, this);
		
			var oViewModel,
				iOriginalBusyDelay,
				oTable = this.byId("table");

			// Put down worklist table's original value for busy indicator delay,
			// so it can be restored later on. Busy handling on the table is
			// taken care of by the table itself.
			iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
			this._oTable = oTable
			// keeps the search state
			this._aTableSearchState = [];

			// Model used to manipulate control states
			oViewModel = new JSONModel({
				worklistTableTitle : this.getResourceBundle().getText("worklistTableTitle"),
				shareOnJamTitle: this.getResourceBundle().getText("worklistTitle"),
				shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
				shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
				tableNoDataText : this.getResourceBundle().getText("tableNoDataText"),
				tableBusyDelay : 0,
				naoChegaram: 0,
				naPlanta: 0,
				despachados: 0,
				outros: 0,
				countAll: 0
			});
			this.setModel(oViewModel, "worklistView");
			// Create an object of filters
			this._mFilters = {
				"naoChegaram": [new Filter("EventCode", "EQ", "Z01")],
				"naPlanta": [new Filter("EventCode", "EQ", "Z02")],
				"despachados": [new Filter("EventCode", "EQ", "Z04")],
				"all": []
			};


			// Make sure, busy indication is showing immediately so there is no
			// break after the busy indication for loading the view's meta data is
			// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
			//oTable.attachEventOnce("updateFinished", function(){
				// Restore original busy indicator delay for worklist's table
			//	oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
			//});
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */
		
		onUpdateStarted: function(oEvent) {
			
			//alert(oEvent.getSource().toString());
			
		},

		/**
		 * Triggered by the table's 'updateFinished' event: after new table
		 * data is available, this handler method updates the table counter.
		 * This should only happen if the update was successful, which is
		 * why this handler is attached to 'updateFinished' and not to the
		 * table's list binding's 'dataReceived' method.
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onUpdateFinished : function (oEvent) {
			// update the worklist's object counter after the table update
			var sTitle,
				oTable = oEvent.getSource(),
				oViewModel = this.getModel("worklistView"),
				iTotalItems = oEvent.getParameter("total");
			
			var reason = oEvent.getParameters("reason").reason;
			
			var aFilter = [];
			var filtroZ01 = [];
			var filtroZ02 = [];
			var filtroZ04 = [];
			
			filtroZ01.push(new Filter("EventCode", FilterOperator.EQ, "Z01"));
			filtroZ02.push(new Filter("EventCode", FilterOperator.EQ, "Z02"));
			filtroZ04.push(new Filter("EventCode", FilterOperator.EQ, "Z04"));
			
			if(reason != "Filter") {
				
				var parameters = this.getParameters();
				
				// build filter array
				aFilter.push(new Filter("Werks", FilterOperator.EQ, parameters.oData.werks));
				filtroZ01.push(new Filter("Werks", FilterOperator.EQ, parameters.oData.werks));
				filtroZ02.push(new Filter("Werks", FilterOperator.EQ, parameters.oData.werks));
				filtroZ04.push(new Filter("Werks", FilterOperator.EQ, parameters.oData.werks));
				
				if(parameters.oData.dataDe != null) {
					aFilter.push(new Filter("Erdat", FilterOperator.BT, parameters.oData.dataDe, parameters.oData.dataAte));
					filtroZ01.push(new Filter("Erdat", FilterOperator.BT, parameters.oData.dataDe, parameters.oData.dataAte));
					filtroZ02.push(new Filter("Erdat", FilterOperator.BT, parameters.oData.dataDe, parameters.oData.dataAte));
					filtroZ04.push(new Filter("Erdat", FilterOperator.BT, parameters.oData.dataDe, parameters.oData.dataAte));
				}

				// filter binding
				var oBinding = oTable.getBinding("items");
				oBinding.filter(aFilter);				

				// only update the counter if the length is final and
				// the table is not empty
				//if (iTotalItems > 0) { // && oTable.getBinding("items").isLengthFinal()) {
					sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
					// Get the count for all the products and set the value to 'countAll' property
					this.getModel().read("/Ordens/$count", {
						success: function (oData) {
							oViewModel.setProperty("/countAll", oData);
						},
						filters: aFilter
					});
					// read the count for the naoChegaram filter
					this.getModel().read("/Ordens/$count", {
						success: function (oData) {
							oViewModel.setProperty("/naoChegaram", oData);
						},
						filters: filtroZ01
					});
					// read the count for the naPlanta filter
					this.getModel().read("/Ordens/$count", {
						success: function(oData){
							oViewModel.setProperty("/naPlanta", oData);
						},
						filters: filtroZ02
					});  
					// read the count for the despachados filter
					this.getModel().read("/Ordens/$count", { 
						success: function(oData){
							oViewModel.setProperty("/despachados", oData);
						},
						filters: filtroZ04
					});
				//} else {
				//	sTitle = this.getResourceBundle().getText("worklistTableTitle");
				//}
				this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
				
			}

		},

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onPress : function (oEvent) {
			//var router = "/Ordens/15";
			//this.getRouter().navTo();
			// The source is the list item that got pressed
			this._showObject(oEvent.getSource());
		},

		/**
		 * Event handler for navigating back.
		 * We navigate back in the browser history
		 * @public
		 */
		
		onNavBack : function() {
			history.go(-1);
		},


		onSearch : function (oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				// Search field's 'refresh' button has been pressed.
				// This is visible if you select any master list item.
				// In this case no new search is triggered, we only
				// refresh the list binding.
				this.onRefresh();
			} else {
				var aTableSearchState = [];
				var sQuery = oEvent.getParameter("query");

				if (sQuery && sQuery.length > 0) {
					aTableSearchState = [new Filter("Ordemfrete", FilterOperator.Contains, sQuery)];
				}
				this._applySearch(aTableSearchState);
			}

		},

		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @public
		 */
		onRefresh : function () {
			var oTable = this.byId("table");
			oTable.getBinding("items").refresh();
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Shows the selected item on the object page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */
		_showObject : function (oItem) {
			var ordemFrete = oItem.getBindingContext().getProperty("Ordemfrete");
			var evento = oItem.getBindingContext().getProperty("EventCode");
			var parameters = this.getParameters();

			var oViewModel = new JSONModel({
				Placa: oItem.getBindingContext().getProperty("Placa"),
				PlacaUf: oItem.getBindingContext().getProperty("PlacaUf"),
				EventCode: oItem.getBindingContext().getProperty("EventCode"),
				Ordem: oItem.getBindingContext().getProperty("Ordemfrete"),
				Cliente: oItem.getBindingContext().getProperty("Cliente"),
				Transportador: oItem.getBindingContext().getProperty("Transportador"),
				Motorista: oItem.getBindingContext().getProperty("Motorista"),
				BpName: oItem.getBindingContext().getProperty("BpName"),
				Usuario: oItem.getBindingContext().getProperty("Usuario"),
				UserId: sap.ushell.Container.getService("UserInfo").getId(),
				Z01ChangedOned: oItem.getBindingContext().getProperty("Z01ChangedOned"),
				Z01ChangedBy: oItem.getBindingContext().getProperty("Z01ChangedBy"),
				Z02ChangedOned: oItem.getBindingContext().getProperty("Z02ChangedOned"),
				Z02ChangedBy: oItem.getBindingContext().getProperty("Z02ChangedBy"),
				Z04ChangedOned: oItem.getBindingContext().getProperty("Z04ChangedOned"),
				Z04ChangedBy: oItem.getBindingContext().getProperty("Z04ChangedBy"),
				Werks: parameters.oData.werks
			});

			this.getOwnerComponent().setModel(oViewModel, "currentItem");
			
			switch(oItem.getBindingContext().getProperty("EventCode")) {
			case "Z01": 
				this.getRouter().navTo("object", {
					objectId: ordemFrete
				});
			break;
			case "Z02": 
				this.getRouter().navTo("objectOF2", {
					objectId: ordemFrete
				});
			break;
			case "Z04": 
				this.getRouter().navTo("objectOF4", {
					objectId: ordemFrete
				});
			break;
			};
		},

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
		 * @private
		 */
		_applySearch: function(aTableSearchState) {

			var oTable = this.byId("table"),
				oViewModel = this.getModel("worklistView");
			oTable.getBinding("items").filter(aTableSearchState, "Application");
			// changes the noDataText of the list in case there are no filter results
			if (aTableSearchState.length !== 0) {
				oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
			}
		},
		/**
		 * Event handler when a filter tab gets pressed
		 * @param {sap.ui.base.Event} oEvent the filter tab event
		 * @public
		 */
		onQuickFilter: function(oEvent) {

			var oBinding = this._oTable.getBinding("items"),
				sKey = oEvent.getParameter("selectedKey");
	
			var parameters = this.getParameters();
			
			// build filter array
			var aFilter = this._mFilters[sKey];
			aFilter.push(new Filter("Werks", FilterOperator.EQ, parameters.oData.werks));
			
			if(parameters.oData.dataDe != null) {
				aFilter.push(new Filter("Erdat", FilterOperator.BT, parameters.oData.dataDe, parameters.oData.dataAte));
			}
			
			oBinding.filter(aFilter);
		}

	});

});