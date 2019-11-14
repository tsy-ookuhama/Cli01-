var pDataDe, pDataAte;
 
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/m/library"
], function (Controller, UIComponent, mobileLibrary) {
	"use strict";
	
    return Controller.extend("zbrlogu000001.controller.BaseController", {
    	
    	getParameters : function() {
    		return this.getOwnerComponent().getModel("parameters");
    	},
    	
    	setParameters : function(oViewModel) {
    		
			this.getOwnerComponent().setModel(oViewModel, "parameters");
			
    	},
    	
    	getParametrosGerais : function() {
    		
    		return this.getOwnerComponent().getModel("ParametrosGerais");
    		
    	},
    	
    	setParametrosGerais : function() {
    		
    		var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZBRLOG_COCKPIT_PORTARIA_SRV/");
    		
    		var comp = this.getOwnerComponent();
    		
    		oModel.read("/Parans", {
				success: function(data, response) {
					
					var oViewModel = new sap.ui.model.json.JSONModel({
						diasLimite : data.results[0].PDiaslimite,
						guid : data.results[0].EvGuid22
					});
					
					comp.setModel(oViewModel, "ParametrosGerais");

				},
				error: function(data){
					console.log("Erro");
				}
			});
    		
    		
    	},
    	
    	/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter : function () {
			return UIComponent.getRouterFor(this);
		},
		
		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel : function (sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel : function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle : function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		/**
		 * Event handler when the share by E-Mail button has been clicked
		 * @public
		 */
		onShareEmailPress : function () {
			var oViewModel = (this.getModel("objectView") || this.getModel("worklistView"));
			mobileLibrary.URLHelper.triggerEmail(
				null,
				oViewModel.getProperty("/shareSendEmailSubject"),
				oViewModel.getProperty("/shareSendEmailMessage")
			);
		}

	});

});