!/**
 * Highstock JS v11.4.7 (2024-08-14)
 *
 * HeikinAshi series type for Highcharts Stock
 *
 * (c) 2010-2024 Karol Kolodziej
 *
 * License: www.highcharts.com/license
 */function(i){"object"==typeof module&&module.exports?(i.default=i,module.exports=i):"function"==typeof define&&define.amd?define("highcharts/modules/heikinashi",["highcharts","highcharts/modules/stock"],function(e){return i(e),i.Highcharts=e,i}):i("undefined"!=typeof Highcharts?Highcharts:void 0)}(function(i){"use strict";var e=i?i._modules:{};function s(e,s,t,a){e.hasOwnProperty(s)||(e[s]=a.apply(null,t),"function"==typeof CustomEvent&&i.win.dispatchEvent(new CustomEvent("HighchartsModuleLoaded",{detail:{path:s,module:e[s]}})))}s(e,"Series/HeikinAshi/HeikinAshiPoint.js",[e["Core/Series/SeriesRegistry.js"]],function(i){let{candlestick:{prototype:{pointClass:e}},hlc:{prototype:{pointClass:s}}}=i.seriesTypes;return class extends e{}}),s(e,"Series/HeikinAshi/HeikinAshiSeriesDefaults.js",[],function(){return{dataGrouping:{groupAll:!0}}}),s(e,"Series/HeikinAshi/HeikinAshiSeries.js",[e["Core/Globals.js"],e["Series/HeikinAshi/HeikinAshiPoint.js"],e["Series/HeikinAshi/HeikinAshiSeriesDefaults.js"],e["Core/Series/SeriesRegistry.js"],e["Core/Utilities.js"]],function(i,e,s,t,a){let{composed:h}=i,{candlestick:n}=t.seriesTypes,{addEvent:o,merge:r,pushUnique:l}=a;function u(){this.series.forEach(i=>{i.is("heikinashi")&&(i.heikiashiData.length=0,i.getHeikinashiData())})}function p(){let i=this.points,e=this.heikiashiData,s=this.cropStart||0;this.processedYData.length=0;for(let t=0;t<i.length;t++){let a=i[t],h=e[t+s];a.open=h[0],a.high=h[1],a.low=h[2],a.close=h[3],this.processedYData.push([a.open,a.high,a.low,a.close])}}function c(){this.heikiashiData.length&&(this.heikiashiData.length=0)}class d extends n{constructor(){super(...arguments),this.heikiashiData=[]}static compose(i,e){n.compose(i),l(h,"HeikinAshi")&&(o(e,"postProcessData",u),o(d,"afterTranslate",p),o(d,"updatedData",c))}getHeikinashiData(){let i=this.allGroupedData||this.yData,e=this.heikiashiData;if(!e.length&&i&&i.length){let s=i[0];this.modifyFirstPointValue(s);for(let s=1;s<i.length;s++){let t=i[s],a=e[s-1];this.modifyDataPoint(t,a)}}this.heikiashiData=e}init(){super.init.apply(this,arguments),this.heikiashiData=[]}modifyFirstPointValue(i){let e=(i[0]+i[1]+i[2]+i[3])/4,s=(i[0]+i[3])/2;this.heikiashiData.push([e,i[1],i[2],s])}modifyDataPoint(i,e){let s=(e[0]+e[3])/2,t=(i[0]+i[1]+i[2]+i[3])/4,a=Math.max(i[1],t,s),h=Math.min(i[2],t,s);this.heikiashiData.push([s,a,h,t])}}return d.defaultOptions=r(n.defaultOptions,s),d.prototype.pointClass=e,t.registerSeriesType("heikinashi",d),d}),s(e,"masters/modules/heikinashi.src.js",[e["Core/Globals.js"],e["Series/HeikinAshi/HeikinAshiSeries.js"]],function(i,e){return e.compose(i.Series,i.Axis),i})});