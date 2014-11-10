/**
 * @jsx React.DOM
 */

'use strict';
var _ = require('underscore');
var React = require('react');
var L = require('leaflet');
var Mosaic = require('mosaic-commons');

var MapViewport = Mosaic.Leaflet.MapViewport;

/**
 * This class is responsible for creation of a map and showing data on it.
 */
module.exports = React.createClass({
    displayName : 'MapView',

    _getApp : function() {
        return this.props.app;
    },

    /** Initializes this component. */
    componentWillMount : function() {
        var timeout = 50;
        this._onZoomEnd = _.debounce(this._onZoomEnd, timeout);
        this._updateZoomLevel = _.debounce(this._updateZoomLevel, timeout);
    },

    /** Main rendering method of this class. */
    render : function() {
        var app = this._getApp();
        var mapOptions = {};
        return (Mosaic.Leaflet.ReactMap({
            id : this.props.id,
            className : this.props.className,
            app : this.props.app,
            options : mapOptions,
            onMapAdd : this._onMapAdd,
            onMapRemove : this._onMapRemove
        }));
    },

    /** Sets a new viewport bounding box for this map. */
    setViewport : function(tl, br) {
        if (this._viewport) {
            var bounds = L.bounds(tl, br);
            this._viewport.setViewport(bounds);
        }
    },

    /**
     * This method is called by the Mosaic.Leaflet.ReactMap to notify that the
     * map was attached to the DOM.
     */
    _onMapAdd : function(map) {
        this._map = map;
        map.on('click', function(e) {
            console.log(map.getZoom() + ':[' + e.latlng.lng + ',' +
                    e.latlng.lat + ']');
        });
        this._viewport = new MapViewport({
            map : map
        });
        this._registerLayers(map);
        this._registerHandlers(map);
        this._updateLayersVisibility();
    },
    /**
     * This method is called by the Mosaic.Leaflet.ReactMap to notify that the
     * map component was removed.
     */
    _onMapRemove : function(map) {
        this._removeHandlers(map);
        this._removeLayers(map);
        delete this._map;
        delete this._viewport;
    },

    // -------------------------------------------------------------------

    /**
     * Registers handlers (listeners) responsible for marker redrawing and
     * selected item highlighting.
     */
    _registerHandlers : function(map) {
        var app = this._getApp();
        app.map.addMapChangeListener(this._updateZoomLevel, this);
        map.on('zoomend', this._onZoomEnd, this);
    },

    /**
     * Removes handlers (listeners) responsible for marker redrawing and
     * selected item highlighting.
     */
    _removeHandlers : function(map) {
        var app = this._getApp();
        map.off('zoomend', this._onZoomEnd, this);
        app.map.removeMapChangeListener(this._updateZoomLevel, this);
    },

    // -------------------------------------------------------------------

    /** Adds new layers to the map */
    _registerLayers : function(map) {
        var that = this;
        var app = that.props.app;
        var mapOptions = app.map.getMapOptions();
        that._layers = {};
        that._layers.tiles = this._newTilesLayer(mapOptions.tilesUrl,
                mapOptions.tilesAttribution);
        // Add all layers to the map
        _.each(this._layers, function(layer) {
            map.addLayer(layer);
        }, this);

    },

    /** Removes all layers from the map */
    _removeLayers : function(map) {
        _.each(this._layers, function(layer) {
            map.removeLayer(layer);
        }, this);
        delete this._layers;
    },

    /** Creates and returns background tiles layer */
    _newTilesLayer : function(tilesUrl, attribution) {
        var app = this.options.app;
        var mapOptions = app.map.getMapOptions();
        var maxZoom = mapOptions.maxZoom;
        var minZoom = mapOptions.minZoom;
        var tilesLayer = L.tileLayer(tilesUrl, {
            attribution : attribution,
            maxZoom : maxZoom,
            minZoom : minZoom,
            zIndex : this.options.zIndex || 0
        });
        return tilesLayer;
    },

    // -------------------------------------------------------------------

    /**
     * This method is called when the user changes the zoom level.
     */
    _onZoomEnd : function() {
        var app = this._getApp();
        app.map.changeMapZoom({
            zoom : this._map.getZoom()
        });
        this._updateLayersVisibility();
    },

    /**
     * Handles notifications about zoom changes requests and changes the zoom
     * level on the map.
     */
    _updateZoomLevel : function() {
        var app = this._getApp();
        var zoom = app.map.getMapZoomLevel();
        var oldZoom = this._map.getZoom();
        if (zoom != oldZoom) {
            this._map.setZoom(zoom);
        }
    },

    /**
     * Changes visibility of individual layers depending on the current zoom
     * level.
     */
    _updateLayersVisibility : function() {
        var that = this;
        if (!that._map)
            return;
        var zoom = that._map.getZoom();
        _.each(this._layers, function(layer) {
            if (!layer.updateLayerVisibility) {
                return;
            }
            layer.updateLayerVisibility();
        }, this);
    },

});
