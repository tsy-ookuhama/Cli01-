sap.ui.define([ 
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"zbrlogu000001/model/formatter",
	"sap/ui/core/format/DateFormat",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function (
	BaseController,
	JSONModel,
	History,
	formatter, 
	DateFormat, 
	Filter, 
	FilterOperator,
	MessageToast,
	MessageBox
) {
	"use strict";

	return BaseController.extend("zbrlogu000001.controller.Object", {

		formatter: formatter,
		
		onDisplay: function(oEvent) {
			var currentItem = this.getOwnerComponent().getModel("currentItem");
			this.getView().setModel(currentItem);
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
		    var target = router.getTarget("object");
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
		onNavBack : function() {
			var sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getRouter().navTo("worklist", {}, true);
			}
		},

		onPressConfirm : function() {
			var currentItem = this.getOwnerComponent().getModel("currentItem");
			var oModel = new sap.ui.model.json.JSONModel;

			if (currentItem === undefined) {
				MessageToast.show("Informe a Ordem de frete");
				return;
			}
			
            var commentOrder = this.getView().byId("commentOrder").getValue();
			
			var oUrl = 
				"/sap/opu/odata/sap/ZBRLOG_COCKPITPORTARIA_ACTION_SRV/Action(IpEventCode='Z02',IpTorid='"
				+ currentItem.oData.Ordem +
			    "',IpUnidGerencial='" + currentItem.oData.Werks + "',IpText='" + commentOrder + "')";
			
			var aData = jQuery.ajax({
				type: "GET",
				url: oUrl,
				dataType: "json",
				async: false,
				success: function(data, textStatus, jqXHR) {
					oModel.setData(data);
					MessageToast.show("Confirmação da Entrada sendo processada", {
						duration: 100000
					});
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
			});
			setTimeout(this.onNavBack(), 100000);
			return;
		},

		onPressRefuse : function() {
			var currentItem = this.getOwnerComponent().getModel("currentItem");
			var oModel = new sap.ui.model.json.JSONModel;

			if (currentItem === undefined) {
				MessageToast.show("Informe a Ordem de frete");
				return;
			}

            var commentOrder = this.getView().byId("commentOrder").getValue();
			
			var oUrl = 
				"/sap/opu/odata/sap/ZBRLOG_COCKPITPORTARIA_ACTION_SRV/Action(IpEventCode='Z03',IpTorid='" 
				+ currentItem.oData.Ordem +  
			    "',IpUnidGerencial='" + currentItem.oData.Werks + "',IpText='" + commentOrder + "')";
			
			var aData = jQuery.ajax({
				type: "GET",
				url: oUrl,
				dataType: "json",
				async: false,
				success: function(data, textStatus, jqXHR) {
					oModel.setData(data);
					MessageToast.show("Confirmação da Recusa sendo processada", {
						duration: 100000
					});
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
			});
			setTimeout(this.onNavBack(), 100000);
			return;
		},
		
		onPost : function(oEvent) {
			var sValue = oEvent.getParameter("value");
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
	});

});