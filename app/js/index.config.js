var URL = require('url');
var currentUrl = URL.parse(window.location.href, true);
module.exports = {
    baseUrl : './',
    contentBaseUrl : './data/content/',
    contentSaveUrl : './xwiki/bin/view/mobo/Saver?id=',
    contactApiUrl : './xwiki/bin/view/mobo/Mailer',
    //contactApiUrl : './api/mail',
    //userInfoApiUrl : './api/auth/user',
    //logoutApiUrl : './api/logout',
    userInfoApiUrl : './xwiki/bin/view/mobo/User',
    logoutApiUrl : './xwiki/bin/logout/XWiki/XWikiLogout?xredirect=%2Fxwiki%2Fbin%2Fview%2Fmobo%2FUser',
    searchServiceUrl : './service/organizations',
    exportFields : 'data/export.fields.json',
    messages : './data/messages.json',
    //dataUrl : './data/data.json',
    dataUrl : './xwiki/bin/view/mobo/Api',
    dataFieldsUrl : './data/data.fields.json',
    categoriesUrl : './data/categories.json',
    zonesUrl : './data/zones.json',
    mode : currentUrl.query.mode,
    siteUrl : currentUrl.protocol + '//' + currentUrl.host
            + currentUrl.pathname,
    header : toBoolean(currentUrl.query.header, true),
    containers : {
        main : document.querySelector('body')
    },
    map : {
        // Paris:
        // NE 49.04694, 2.63791
        // SW 48.658291, 2.08679
//        bbox : [ [2, 50], [3, 48] ],
        center : [ 6, 44 ],
        // tilesUrl :
        // 'http://{s}.tiles.mapbox.com/v3/ubimix.in6p41ic/{z}/{x}/{y}.png',
        // tilesUrl : '/tiles/{z}/{x}/{y}.png',
        // tilesUrl : 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        // tilesUrl : 'http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png',
        // tilesUrl : 'http://techonmap.ubimix.com/tiles/{z}/{x}/{y}.png',
        tilesUrl : 'http://{s}.tiles.mapbox.com/v3/ubimix.kgopg33n/{z}/{x}/{y}.png',
        tilesAttribution : {
            prefix : false,
            position : 'bottomleft',
            text : 'Données cartographiques &copy; <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a>',
        },
        zoom : 8,
        maxZoom : 16,
        minZoom : 7,
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
