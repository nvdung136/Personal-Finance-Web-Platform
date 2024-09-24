!/**
 * Highstock JS v11.4.7 (2024-08-14)
 *
 * Indicator series type for Highcharts Stock
 *
 * (c) 2010-2024 Paweł Fus
 *
 * License: www.highcharts.com/license
 */function(t){"object"==typeof module&&module.exports?(t.default=t,module.exports=t):"function"==typeof define&&define.amd?define("highcharts/indicators/price-envelopes",["highcharts","highcharts/modules/stock"],function(e){return t(e),t.Highcharts=e,t}):t("undefined"!=typeof Highcharts?Highcharts:void 0)}(function(t){"use strict";var e=t?t._modules:{};function o(e,o,i,s){e.hasOwnProperty(o)||(e[o]=s.apply(null,i),"function"==typeof CustomEvent&&t.win.dispatchEvent(new CustomEvent("HighchartsModuleLoaded",{detail:{path:o,module:e[o]}})))}o(e,"Stock/Indicators/MultipleLinesComposition.js",[e["Core/Series/SeriesRegistry.js"],e["Core/Utilities.js"]],function(t,e){var o;let{sma:{prototype:i}}=t.seriesTypes,{defined:s,error:n,merge:a}=e;return function(t){let e=["bottomLine"],o=["top","bottom"],r=["top"];function p(t){return"plot"+t.charAt(0).toUpperCase()+t.slice(1)}function l(t,e){let o=[];return(t.pointArrayMap||[]).forEach(t=>{t!==e&&o.push(p(t))}),o}function h(){let t=this,e=t.pointValKey,o=t.linesApiNames,r=t.areaLinesNames,h=t.points,c=t.options,d=t.graph,u={options:{gapSize:c.gapSize}},m=[],f=l(t,e),y=h.length,g;if(f.forEach((t,e)=>{for(m[e]=[];y--;)g=h[y],m[e].push({x:g.x,plotX:g.plotX,plotY:g[t],isNull:!s(g[t])});y=h.length}),t.userOptions.fillColor&&r.length){let e=m[f.indexOf(p(r[0]))],o=1===r.length?h:m[f.indexOf(p(r[1]))],s=t.color;t.points=o,t.nextPoints=e,t.color=t.userOptions.fillColor,t.options=a(h,u),t.graph=t.area,t.fillGraph=!0,i.drawGraph.call(t),t.area=t.graph,delete t.nextPoints,delete t.fillGraph,t.color=s}o.forEach((e,o)=>{m[o]?(t.points=m[o],c[e]?t.options=a(c[e].styles,u):n('Error: "There is no '+e+' in DOCS options declared. Check if linesApiNames are consistent with your DOCS line names."'),t.graph=t["graph"+e],i.drawGraph.call(t),t["graph"+e]=t.graph):n('Error: "'+e+" doesn't have equivalent in pointArrayMap. To many elements in linesApiNames relative to pointArrayMap.\"")}),t.points=h,t.options=c,t.graph=d,i.drawGraph.call(t)}function c(t){let e,o=[],s=[];if(t=t||this.points,this.fillGraph&&this.nextPoints){if((e=i.getGraphPath.call(this,this.nextPoints))&&e.length){e[0][0]="L",o=i.getGraphPath.call(this,t),s=e.slice(0,o.length);for(let t=s.length-1;t>=0;t--)o.push(s[t])}}else o=i.getGraphPath.apply(this,arguments);return o}function d(t){let e=[];return(this.pointArrayMap||[]).forEach(o=>{e.push(t[o])}),e}function u(){let t=this.pointArrayMap,e=[],o;e=l(this),i.translate.apply(this,arguments),this.points.forEach(i=>{t.forEach((t,s)=>{o=i[t],this.dataModify&&(o=this.dataModify.modifyValue(o)),null!==o&&(i[e[s]]=this.yAxis.toPixels(o,!0))})})}t.compose=function(t){let i=t.prototype;return i.linesApiNames=i.linesApiNames||e.slice(),i.pointArrayMap=i.pointArrayMap||o.slice(),i.pointValKey=i.pointValKey||"top",i.areaLinesNames=i.areaLinesNames||r.slice(),i.drawGraph=h,i.getGraphPath=c,i.toYData=d,i.translate=u,t}}(o||(o={})),o}),o(e,"Stock/Indicators/PriceEnvelopes/PriceEnvelopesIndicator.js",[e["Stock/Indicators/MultipleLinesComposition.js"],e["Core/Series/SeriesRegistry.js"],e["Core/Utilities.js"]],function(t,e,o){let{sma:i}=e.seriesTypes,{extend:s,isArray:n,merge:a}=o;class r extends i{init(){super.init.apply(this,arguments),this.options=a({topLine:{styles:{lineColor:this.color}},bottomLine:{styles:{lineColor:this.color}}},this.options)}getValues(t,e){let o,i,s,a,r,p,l,h;let c=e.period,d=e.topBand,u=e.bottomBand,m=t.xData,f=t.yData,y=f?f.length:0,g=[],b=[],x=[];if(!(m.length<c)&&n(f[0])&&4===f[0].length){for(h=c;h<=y;h++)r=m.slice(h-c,h),p=f.slice(h-c,h),a=(l=super.getValues({xData:r,yData:p},e)).xData[0],i=(o=l.yData[0])*(1+d),s=o*(1-u),g.push([a,i,o,s]),b.push(a),x.push([i,o,s]);return{values:g,xData:b,yData:x}}}}return r.defaultOptions=a(i.defaultOptions,{marker:{enabled:!1},tooltip:{pointFormat:'<span style="color:{point.color}">●</span><b> {series.name}</b><br/>Top: {point.top}<br/>Middle: {point.middle}<br/>Bottom: {point.bottom}<br/>'},params:{period:20,topBand:.1,bottomBand:.1},bottomLine:{styles:{lineWidth:1,lineColor:void 0}},topLine:{styles:{lineWidth:1}},dataGrouping:{approximation:"averages"}}),s(r.prototype,{areaLinesNames:["top","bottom"],linesApiNames:["topLine","bottomLine"],nameComponents:["period","topBand","bottomBand"],nameBase:"Price envelopes",pointArrayMap:["top","middle","bottom"],parallelArrays:["x","y","top","bottom"],pointValKey:"middle"}),t.compose(r),e.registerSeriesType("priceenvelopes",r),r}),o(e,"masters/indicators/price-envelopes.src.js",[e["Core/Globals.js"]],function(t){return t})});