sap.ui.define([
    "sap/ui/core/routing/Router",
    "sap/m/routing/RouteMatchedHandler"
], function (Router, RouteMatchedHandler) {
    "use strict";

    return Router.extend("zbrlogu000001.MaxionRouter", {
        constructor : function() {
            sap.ui.core.routing.Router.apply(this, arguments);
            this._oRouteMatchedHandler = new sap.m.routing.RouteMatchedHandler(this);
        },
        destroy : function() {
            sap.ui.core.routing.Router.prototype.destroy.apply(this, arguments);
            this._oRouteMatchedHandler.destroy();
        }
    });
});