sap.ui.define([
    "sap/m/MessageBox",
    "sap/ui/core/mvc/Controller"
], function (
    MessageBox, Controller
) {
    "use strict";

    return Controller.extend("peotile.controller.Tile", {

        onInit: function () {

        },
        onPress: function () {
            MessageBox.information("Pressed");
        }
    });
});