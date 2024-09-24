!/**
 * Highstock JS v11.4.7 (2024-08-14)
 *
 * Indicator series type for Highstock
 *
 * (c) 2010-2024 Rafal Sebestjanski
 *
 * License: www.highcharts.com/license
 */function(e){"object"==typeof module&&module.exports?(e.default=e,module.exports=e):"function"==typeof define&&define.amd?define("highcharts/indicators/disparity-index",["highcharts","highcharts/modules/stock"],function(t){return e(t),e.Highcharts=t,e}):e("undefined"!=typeof Highcharts?Highcharts:void 0)}(function(e){"use strict";var t=e?e._modules:{};function a(t,a,i,s){t.hasOwnProperty(a)||(t[a]=s.apply(null,i),"function"==typeof CustomEvent&&e.win.dispatchEvent(new CustomEvent("HighchartsModuleLoaded",{detail:{path:a,module:t[a]}})))}a(t,"Stock/Indicators/DisparityIndex/DisparityIndexIndicator.js",[t["Core/Series/SeriesRegistry.js"],t["Core/Utilities.js"]],function(e,t){let{sma:a}=e.seriesTypes,{correctFloat:i,defined:s,extend:r,isArray:n,merge:o}=t;class d extends a{init(){let t=arguments,i=t[1].params,s=i&&i.average?i.average:void 0;this.averageIndicator=e.seriesTypes[s]||a,this.averageIndicator.prototype.init.apply(this,t)}calculateDisparityIndex(e,t){return i(e-t)/t*100}getValues(e,t){let a=t.index,i=e.xData,r=e.yData,o=r?r.length:0,d=[],p=[],u=[],l=this.averageIndicator,c=n(r[0]),h=l.prototype.getValues(e,t),y=h.yData,g=i.indexOf(h.xData[0]);if(y&&0!==y.length&&s(a)&&!(r.length<=g)){for(let e=g;e<o;e++){let t=this.calculateDisparityIndex(c?r[e][a]:r[e],y[e-g]);d.push([i[e],t]),p.push(i[e]),u.push(t)}return{values:d,xData:p,yData:u}}}}return d.defaultOptions=o(a.defaultOptions,{params:{average:"sma",index:3},marker:{enabled:!1},dataGrouping:{approximation:"averages"}}),r(d.prototype,{nameBase:"Disparity Index",nameComponents:["period","average"]}),e.registerSeriesType("disparityindex",d),d}),a(t,"masters/indicators/disparity-index.src.js",[t["Core/Globals.js"]],function(e){return e})});