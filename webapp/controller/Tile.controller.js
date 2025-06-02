sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/core/mvc/Controller"
], function (
    MessageToast, Controller
) {
    "use strict";

    return Controller.extend("peotile.controller.Tile", {

        onInit: function () {

            this.setMetricInfo();

        },
        onPress: function () {
            MessageToast.show("Pressed");
        },
        setMetricInfo: async function () {
            let oResponse,sHeartbeatDate,iMetric;
            const sAppId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            const sPath = jQuery.sap.getModulePath(sAppId);
            // const sUrl = sPath + "/Metrics/calm-metrics/v1/metrics?version=V1&provider=hm&dimensions=metricName&resolution=5Mi&metrics=measure:value&serviceId=f4f201f5-e0ca-4aaa-a4c1-68eca019935c&format=protobuf-json&metricId=7a50c214-260c-30d5-8fe1-f60f9c5bac32"
            const sUrl = sPath + "/Metrics/calm-metrics/v1/metrics?version=V1&provider=hm&dimensions=metricName&resolution=5Mi&metrics=measure:value&serviceId=fa4b4022-eb68-4a91-adb6-5d644309a7cc&format=protobuf-json&metricId=7a50c214-260c-30d5-8fe1-f60f9c5bac32"

            try {

                oResponse = await this._callMetricSrv(sUrl);
                sHeartbeatDate = this._getHeartbeatDate(oResponse);
                iMetric = this._getHeartbeatValue(oResponse);

            } catch (error) {

            }

            const oGenericTile = this.byId("idTileMetricHealty");
            oGenericTile.setSubheader(sHeartbeatDate);

            const oHarveyBallMicroChartItem = this.byId("idTileHarveyBallMicroChartItem");

            if (iMetric === 0) {
                oHarveyBallMicroChartItem.setColor("Good");
            } else {
                oHarveyBallMicroChartItem.setColor("Error");
            }

        },
        _callMetricSrv: function (sUrl) {
            return new Promise((fnResolve, fnReject) => {

                $.get({
                    url: sUrl,
                    crossDomain: true,
                    dataType: "json",
                    async: false,
                    success: oData => fnResolve(oData),
                    error: oError => fnReject(oError),
                });

            });
        },

        _getHeartbeatDate: function (oResponse) {

            const timeUnixNano =
                oResponse?.resourceMetrics?.[0]?.scopeMetrics?.[0]?.metrics?.find(
                    m => m.name === "ABAP.System.Heartbeat"
                )?.gauge?.dataPoints?.[0]?.timeUnixNano;

            if (!timeUnixNano) return null;

            const timestampMs = Number(timeUnixNano) / 1e6;
            const date = new Date(timestampMs);

            // Build ISO-like string: YYYY-MM-DD HH:mm
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
            const day = String(date.getDate()).padStart(2, '0');
            const hour = String(date.getHours()).padStart(2, '0');
            const minute = String(date.getMinutes()).padStart(2, '0');

            return `${year}-${month}-${day} ${hour}:${minute}`;
        },

        _getHeartbeatValue: function (oResponse) {

            const iValue =
                oResponse?.resourceMetrics?.[0]?.scopeMetrics?.[0]?.metrics?.find(
                    m => m.name === "ABAP.System.Heartbeat"
                )?.gauge?.dataPoints?.[0]?.asDouble;

            return iValue;
        }
    });
});