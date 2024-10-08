/**
 * @license Highcharts Gantt JS v11.4.7 (2024-08-14)
 * @module highcharts/modules/current-date-indicator
 * @requires highcharts
 *
 * CurrentDateIndicator
 *
 * (c) 2010-2024 Lars A. V. Cabrera
 *
 * License: www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import CurrentDateIndication from '../../Extensions/CurrentDateIndication.js';
const G = Highcharts;
CurrentDateIndication.compose(G.Axis, G.PlotLineOrBand);
export default Highcharts;
