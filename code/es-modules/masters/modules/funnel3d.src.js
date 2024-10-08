/**
 * @license Highcharts JS v11.4.7 (2024-08-14)
 * @module highcharts/modules/funnel3d
 * @requires highcharts
 * @requires highcharts/highcharts-3d
 * @requires highcharts/modules/cylinder
 *
 * Highcharts funnel module
 *
 * (c) 2010-2024 Kacper Madej
 *
 * License: www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import Funnel3DSeries from '../../Series/Funnel3D/Funnel3DSeries.js';
import RendererRegistry from '../../Core/Renderer/RendererRegistry.js';
Funnel3DSeries.compose(RendererRegistry.getRendererType());
export default Highcharts;
