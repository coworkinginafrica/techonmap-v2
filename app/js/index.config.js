var URL = require('url');
var currentUrl = URL.parse(window.location.href, true);
module.exports = {
    baseUrl : './',
    contentBaseUrl : './data/content/',
    contentSaveUrl : './api/resources/',
    contactApiUrl : './api/mail',
    userInfoApiUrl : './api/auth/user',
    logoutApiUrl : './api/logout',
    searchServiceUrl : './service/organizations',
    exportFields : 'data/export.fields.json',
    messages : './data/messages.json',
    dataUrl : './data/data.json',
    dataFieldsUrl : './data/data.fields.json',
    categoriesUrl : './data/categories.json',
    zonesUrl : './data/zones.json',
    mode : currentUrl.query.mode,
    header : toBoolean(currentUrl.query.header, true),
    containers : {
        main : document.querySelector('body')
    },
    map : {
        center : [ 2.33185, 48.86246 ],
        // tilesUrl :
        // 'http://{s}.tiles.mapbox.com/v3/ubimix.in6p41ic/{z}/{x}/{y}.png',
        // tilesUrl : '/tiles/{z}/{x}/{y}.png',
        // tilesUrl : 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        // tilesUrl : 'http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png',
        // tilesUrl : 'http://techonmap.ubimix.com/tiles/{z}/{x}/{y}.png',
        tilesUrl : 'http://{s}.tiles.mapbox.com/v3/ubimix.kgopg33n/{z}/{x}/{y}.png',
        tilesAttribution : '&copy; <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a> contributors',
        zoom : 10,
        maxZoom : 16,
        minZoom : 10,
        attribution : '',
        zoomControl : false,
        attributionControl : false
    }
};

function toBoolean(str, def) {
    if (!str || str === undefined)
        return def;
    str += '';
    str = str.toLowerCase();
    return (str == 'true' || str == 'ok' || str == 'yes' || str == '1');
}
