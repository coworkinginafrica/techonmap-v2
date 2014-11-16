/** @jsx React.DOM */
var _ = require('underscore');
var React = require('react');
var DomUtils = require('./utils/DomUtils');
var PanelSizeTracker = require('./utils/PanelSizeTracker');
var MapView = require('./map/MapView.jsx');
var ListView = require('./list/ListView.jsx');
var SearchResultsInfoView = require('./SearchResultsInfoView.jsx');

module.exports = React.createClass({
    displayName : 'MiddleZoneView',
    mixins : [ DomUtils ],
    _onClick : function(ev){
        ev.preventDefault();
        ev.stopPropagation();
    },
    componentWillMount : function(){
        this._updateMapViewport = _.debounce(this._updateMapViewport, 100);  
        this._addResizeListener(this._updateMapViewport, this);
    },
    componentDidMount : function(){
        this._updateMapViewport();
    },
    componentDidUpdate : function(){
        this._updateMapViewport();
    },
    componentWillUnmount : function(){
        this._removeResizeListener(this._updateMapViewport, this);
    },
    render : function() {
        var app = this.props.app;
        return (
            <div className={this.props.className}>
                <MapView app={app} className="map" ref="map" />
                <div className="search-results" ref="searchPanel">
                    <SearchResultsInfoView app={app} className="stats"/>
                    <ListView app={app} />
                </div>
            </div>
        );
    },
    
    _updateMapViewport : function(){
        var mapPanel = this.refs.map;
        var mapPanelElm = mapPanel.getDOMNode();
        var mapPanelBox = mapPanelElm.getBoundingClientRect();
        
        var searchPanel = this.refs.searchPanel;
        var searchPanelElm = searchPanel.getDOMNode();
        var searchPanelBox = searchPanelElm.getBoundingClientRect();
        
        var topLeft = [0, 0];
        var bottomRight = [searchPanelBox.left - mapPanelBox.left, 
                           mapPanelBox.bottom];
        var focusPos = [bottomRight[0] / 2, bottomRight[1] * 2 / 3];
        this.refs.map.setViewport(topLeft, bottomRight, focusPos);
    }
});
