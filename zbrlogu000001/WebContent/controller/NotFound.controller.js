sap.ui.define([ 
	"./BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("zbrlogu000001.controller.NotFound", {

		/**
		 * Navigates to the worklist when the link is pressed
		 * @public
		 */
		onLinkPressed : function () {
			this.getRouter().navTo("worklist");
		}

	});

});