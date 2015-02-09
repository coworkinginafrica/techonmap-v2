/** @jsx React.DOM */
var _ = require('underscore');
var React = require('react');
var PaginatedListView = require('mosaic-core').React.PaginatedListView;

var AppViewMixin = require('../AppViewMixin');

var ListView = React.createClass({
    displayName : 'SearchResultsListView',

    mixins : [ AppViewMixin ],

    /** Renders this view */
    render : function() {
        var app = this.getApp();
        var results = app.res.getResources();
        var activeResourceId = app.res.getSelectedResourceId()
                || this._prevActiveResourceId;
        var focusedIdx;
        if (activeResourceId !== undefined) {
            focusedIdx = app.res.getResourcePosition(activeResourceId);
            this._prevActiveResourceId = activeResourceId;
        }
        var pageSize = 15;
        return (
            <PaginatedListView
                className="list-group search-results-list" 
                paginationClassName="pagination pagination-sm" 
                pageSize={pageSize}
                index={focusedIdx}
                getItemsNumber={this._getItemsNumber}
                renderItems={this._renderItems}
            />
        );
    },

    // -----------------------------------------------------------------------
    // Methods used by the scroller

    _getItemsNumber : function() {
        var app = this.getApp();
        var result = app.res.getResourceNumber();
        return result;
    },

    // -----------------------------------------------------------------------
    // React livecycle event handlers

    componentWillMount : function() {
        var store = this._getStore();
        store.addSelectListener(this._updateState, this);
    },

    componentDidMount : function(){
        this.setState({});
    },
    
    componentWillUnmount : function() {
        var store = this._getStore();
        store.removeSelectListener(this._updateState, this);
    },

    // -----------------------------------------------------------------------
    // Private methods

    /** Returns the underlying store (module). */
    _getStore : function() {
        return this.props.app.res;
    },

    /** Creates and returns a new internal state for this view. */
    _newState : function(options) {
        var app = this.props.app;
        var resources = app.res.getResources();
        var focusedIndex = app.res.getSelectedResourcePos();
        return {
            resources : resources,
            focusedIndex : focusedIndex
        }
    },

    /** Renders items starting from the specified position. */
    _renderItems : function(params) {
        var items = [];
        var resources = this.state.resources;
        var len = Math.min(params.index + params.length, resources.length);
        for (var i = params.index; i < len; i++) {
             var view = this._renderItem(resources[i], i);
            items.push(view);
        }
        return items;
    },

    /** Renders an individual resources for the list */
    _renderItem : function(resource, pos) {
        var app = this.props.app;
        var type = app.res.getResourceType(resource);
        var view = app.viewManager.newView('listItem', type, {
            app : app,
            resource : resource,
            pos : pos,
            onClick : function() {
                var id = app.res.getResourceId(resource);
                app.res.selectResource({
                    resourceId : id
                });
            }
        });
        var result = view;
        return result;
    },

});

module.exports = ListView;
