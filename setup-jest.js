import $ from 'jquery';
global.$ = global.jQuery = $;
global.jQuery = $;
global.$.fn.modal = jest.fn(() => $());
global.$.fn.carousel = jest.fn(() => $());
global.$.fn.tooltip = jest.fn(() => $());

