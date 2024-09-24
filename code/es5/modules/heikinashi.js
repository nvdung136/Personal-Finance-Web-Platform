!/**
 * Highstock JS v11.4.7 (2024-08-14)
 *
 * HeikinAshi series type for Highcharts Stock
 *
 * (c) 2010-2024 Karol Kolodziej
 *
 * License: www.highcharts.com/license
 */function(t){"object"==typeof module&&module.exports?(t.default=t,module.exports=t):"function"==typeof define&&define.amd?define("highcharts/modules/heikinashi",["highcharts","highcharts/modules/stock"],function(i){return t(i),t.Highcharts=i,t}):t("undefined"!=typeof Highcharts?Highcharts:void 0)}(function(t){"use strict";var i=t?t._modules:{};function e(i,e,s,n){i.hasOwnProperty(e)||(i[e]=n.apply(null,s),"function"==typeof CustomEvent&&t.win.dispatchEvent(new CustomEvent("HighchartsModuleLoaded",{detail:{path:e,module:i[e]}})))}e(i,"Series/HeikinAshi/HeikinAshiPoint.js",[i["Core/Series/SeriesRegistry.js"]],function(t){var i,e=this&&this.__extends||(i=function(t,e){return(i=Object.setPrototypeOf||({__proto__:[]})instanceof Array&&function(t,i){t.__proto__=i}||function(t,i){for(var e in i)Object.prototype.hasOwnProperty.call(i,e)&&(t[e]=i[e])})(t,e)},function(t,e){if("function"!=typeof e&&null!==e)throw TypeError("Class extends value "+String(e)+" is not a constructor or null");function s(){this.constructor=t}i(t,e),t.prototype=null===e?Object.create(e):(s.prototype=e.prototype,new s)}),s=t.seriesTypes,n=s.candlestick.prototype.pointClass;return s.hlc.prototype.pointClass,function(t){function i(){return null!==t&&t.apply(this,arguments)||this}return e(i,t),i}(n)}),e(i,"Series/HeikinAshi/HeikinAshiSeriesDefaults.js",[],function(){return{dataGrouping:{groupAll:!0}}}),e(i,"Series/HeikinAshi/HeikinAshiSeries.js",[i["Core/Globals.js"],i["Series/HeikinAshi/HeikinAshiPoint.js"],i["Series/HeikinAshi/HeikinAshiSeriesDefaults.js"],i["Core/Series/SeriesRegistry.js"],i["Core/Utilities.js"]],function(t,i,e,s,n){var o,r=this&&this.__extends||(o=function(t,i){return(o=Object.setPrototypeOf||({__proto__:[]})instanceof Array&&function(t,i){t.__proto__=i}||function(t,i){for(var e in i)Object.prototype.hasOwnProperty.call(i,e)&&(t[e]=i[e])})(t,i)},function(t,i){if("function"!=typeof i&&null!==i)throw TypeError("Class extends value "+String(i)+" is not a constructor or null");function e(){this.constructor=t}o(t,i),t.prototype=null===i?Object.create(i):(e.prototype=i.prototype,new e)}),a=t.composed,h=s.seriesTypes.candlestick,u=n.addEvent,p=n.merge,c=n.pushUnique;function l(){this.series.forEach(function(t){t.is("heikinashi")&&(t.heikiashiData.length=0,t.getHeikinashiData())})}function f(){var t=this.points,i=this.heikiashiData,e=this.cropStart||0;this.processedYData.length=0;for(var s=0;s<t.length;s++){var n=t[s],o=i[s+e];n.open=o[0],n.high=o[1],n.low=o[2],n.close=o[3],this.processedYData.push([n.open,n.high,n.low,n.close])}}function y(){this.heikiashiData.length&&(this.heikiashiData.length=0)}var d=function(t){function i(){var i=null!==t&&t.apply(this,arguments)||this;return i.heikiashiData=[],i}return r(i,t),i.compose=function(t,e){h.compose(t),c(a,"HeikinAshi")&&(u(e,"postProcessData",l),u(i,"afterTranslate",f),u(i,"updatedData",y))},i.prototype.getHeikinashiData=function(){var t=this.allGroupedData||this.yData,i=this.heikiashiData;if(!i.length&&t&&t.length){var e=t[0];this.modifyFirstPointValue(e);for(var s=1;s<t.length;s++){var n=t[s],o=i[s-1];this.modifyDataPoint(n,o)}}this.heikiashiData=i},i.prototype.init=function(){t.prototype.init.apply(this,arguments),this.heikiashiData=[]},i.prototype.modifyFirstPointValue=function(t){var i=(t[0]+t[1]+t[2]+t[3])/4,e=(t[0]+t[3])/2;this.heikiashiData.push([i,t[1],t[2],e])},i.prototype.modifyDataPoint=function(t,i){var e=(i[0]+i[3])/2,s=(t[0]+t[1]+t[2]+t[3])/4,n=Math.max(t[1],s,e),o=Math.min(t[2],s,e);this.heikiashiData.push([e,n,o,s])},i.defaultOptions=p(h.defaultOptions,e),i}(h);return d.prototype.pointClass=i,s.registerSeriesType("heikinashi",d),d}),e(i,"masters/modules/heikinashi.src.js",[i["Core/Globals.js"],i["Series/HeikinAshi/HeikinAshiSeries.js"]],function(t,i){return i.compose(t.Series,t.Axis),t})});