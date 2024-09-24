!/**
 * Highstock JS v11.4.7 (2024-08-14)
 *
 * Indicator series type for Highcharts Stock
 *
 * (c) 2010-2024 Karol Kolodziej
 *
 * License: www.highcharts.com/license
 */function(e){"object"==typeof module&&module.exports?(e.default=e,module.exports=e):"function"==typeof define&&define.amd?define("highcharts/indicators/obv",["highcharts","highcharts/modules/stock"],function(t){return e(t),e.Highcharts=t,e}):e("undefined"!=typeof Highcharts?Highcharts:void 0)}(function(e){"use strict";var t=e?e._modules:{};function s(t,s,o,i){t.hasOwnProperty(s)||(t[s]=i.apply(null,o),"function"==typeof CustomEvent&&e.win.dispatchEvent(new CustomEvent("HighchartsModuleLoaded",{detail:{path:s,module:t[s]}})))}s(t,"Stock/Indicators/OBV/OBVIndicator.js",[t["Core/Series/SeriesRegistry.js"],t["Core/Utilities.js"]],function(e,t){let{sma:s}=e.seriesTypes,{isNumber:o,error:i,extend:r,merge:n}=t;class a extends s{getValues(e,t){let s=e.chart.get(t.volumeSeriesID),r=e.xData,n=e.yData,a=[],u=[],d=[],l=!o(n[0]),c=[],h=1,p=0,f=0,m=0,v=0,y;if(s)for(y=s.yData,c=[r[0],p],m=l?n[0][3]:n[0],a.push(c),u.push(r[0]),d.push(c[1]);h<n.length;h++)f=(v=l?n[h][3]:n[h])>m?p+y[h]:v===m?p:p-y[h],c=[r[h],f],p=f,m=v,a.push(c),u.push(r[h]),d.push(c[1]);else{i("Series "+t.volumeSeriesID+" not found! Check `volumeSeriesID`.",!0,e.chart);return}return{values:a,xData:u,yData:d}}}return a.defaultOptions=n(s.defaultOptions,{marker:{enabled:!1},params:{index:void 0,period:void 0,volumeSeriesID:"volume"},tooltip:{valueDecimals:0}}),r(a.prototype,{nameComponents:void 0}),e.registerSeriesType("obv",a),a}),s(t,"masters/indicators/obv.src.js",[t["Core/Globals.js"]],function(e){return e})});