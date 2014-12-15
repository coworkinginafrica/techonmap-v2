/**
 * @jsx React.DOM
 */
'use strict';
var _ = require('underscore');
var React = require('react');
var Mosaic = require('mosaic-commons');
var DomUtils = require('../utils/DomUtils');
var I18NMixin = require('../utils/I18NMixin');
var PopupPanel = require('../utils/PopupPanel.jsx');
var ContentPopupMixin = require('../utils/ContentPopupMixin');

var ExportConfigPanel = React.createClass({
    displayName: "ExportConfigPanel",
    mixins : [I18NMixin],
    componentWillMount : function(){
        this.props.events.on('preview', this._showPreview, this);
    },
    componentWillUnmount : function(){
        this.props.events.off('preview', this._showPreview, this);
    },
    getApp : function() {
        return this.props.app;
    },
    _newState : function(options){
        return _.extend({
            width: 1024,
            height: 800,
            embedMode : 'embed-full' 
        }, this.state, options);
    },
    _getExportUrl : function(){
        var embedMode = this.state.embedMode;
        var useQuery = false;
        var url = this.props.app.nav.getExportUrl({
            embedMode : embedMode,
            useQuery : useQuery
        });
        url = encodeURI(url);
        return url;
    },
    _showPreview : function(ev){
        var width = this.state.width;
        var height = this.state.height;
        var url = this._getExportUrl(); 
        var wnd = window.open(url,'name',
                'height=' + (height) + 'px,width=' + (width) + 'px');
    },
    getInitialState : function(){
        return this._newState();
    },
    _renderCode : function(){
        var url = this._getExportUrl();
        var width = this.state.width;
        var height = this.state.height;
        return '<iframe ' + 
                'width="' + width + '" ' + 
                'height="' + height + '" ' +
                'src="' + url + '" ' + 
                'frameborder="0">' + 
                '</iframe>';
    },
    getWidth : function(){
        return this.state.width;
    },
    getHeight : function(){
        return this.state.height;
    },
    _updateLayout : function(fullView, ev) {
        var f = this.refs.fullView.getDOMNode();
        var s = this.refs.shortView.getDOMNode();
        var param;
        if (fullView) {
            DomUtils._addClass(f, 'embed-type-active');
            DomUtils._removeClass(s, 'embed-type-active');
            param = 'embed-full';
        } else {
            DomUtils._addClass(s, 'embed-type-active');
            DomUtils._removeClass(f, 'embed-type-active');
            param = 'embed-readonly';
        }
        this.setState(this._newState({embedMode : param }));
    },
    _updateWidth : function(ev) {
        var width = parseInt(ev.target.value) || this.state.width;
        this.setState(this._newState({ width : width }));
        ev.preventDefault();
        ev.stopPropagation();
    },
    _updateHeight : function(ev) {
        var height = parseInt(ev.target.value) || this.state.height;
        this.setState(this._newState({ height : height }));
        ev.preventDefault();
        ev.stopPropagation();
    },
    _onBlur : function(key, minValue, ev) {
        var value = parseInt(ev.target.value) || minValue; 
        var newValue = Math.max(value, minValue);
        if (value != newValue) {
            var options = {};
            options[key] = newValue;
            this.setState(this._newState(options));
        }
    },
    _onTextareaChange : function(){
        this.setState(this._newState());
    },
    _selectTextareaContent : function(ev){
        if (!this.isMounted())
            return ;
        var elm = ev.target;
        setTimeout(function() {
            var len = elm.value.length;
            DomUtils._selectText(elm, 0, len);
        }, 10);
    },
    render : function(){
        return (
           <div>
                <div className="configuration-zone">
                        <h3>{this._getLabel("dialog.export.title.style")}</h3>
                        <div className="row">
                            <div className="col-xs-6">
                                <a href="#"
                                    ref="shortView"
                                    className="embed-type embed-readonly embed-type-active"
                                    onClick={_.bind(this._updateLayout, this, false)}>
                                    {this._getLabel('dialog.export.label.nomenu')}
                                </a>
                            </div>
                            <div className="col-xs-6">
                                <a href="#"
                                    className="embed-type embed-full"
                                    ref="fullView"
                                    onClick={_.bind(this._updateLayout, this, true)}>
                                    {this._getLabel('dialog.export.label.withmenu')}
                                </a>
                            </div>
                        </div>
                        <h3>{this._getLabel("dialog.export.title.size")}</h3>
                        <div className="row">
                            <div className="col-xs-6 form-inline">
                                <label className="">{this._getLabel("dialog.export.label.width")}</label>
                                <input
                                    type="text"
                                    className="embed-width"
                                    onChange={this._updateWidth}
                                    onBlur={_.bind(this._onBlur, this, 'width', 770)}
                                    value={this.state.width} />
                            </div>
                            <div className="col-xs-6">
                                <label className="">{this._getLabel("dialog.export.label.height")}</label>
                                <input
                                    type="text"
                                    className="embed-height"
                                    onBlur={_.bind(this._onBlur, this, 'height', 400)}
                                    onChange={this._updateHeight}
                                    value={this.state.height}/>
                            </div>
                        </div>
                </div>
                <div className="active-zone">
                    <h3>{this._getLabel("dialog.export.title.code")}</h3>
                    <div className="row">
                        <div className="col-xs-12">
                            <textarea className="code embed"
                                value={this._renderCode()}
                                onChange={this._onTextareaChange}
                                onFocus={this._selectTextareaContent}/>
                        </div>
                    </div>
                </div>
           </div>                
        );
    }
});

var ExportPopup = Mosaic.Class.extend(I18NMixin, ContentPopupMixin, {
    initialize : function(options){
        this.setOptions(options);
    },
    getApp : function() {
        return this.options.app;
    },
    open : function() {
        var title = (
            <span>
                <i className="icon icon-export"></i>
                {this._getLabel('dialog.export.title')}
            </span>
        );
        var app = this.getApp();
        var events = new Mosaic.Events();
        this._panel = (<ExportConfigPanel app={app} events={events}/>);
        var that = this;
        var footerElm = (
           <div>
               <div className="row">
                   <div className="col-xs-6">
                       <button type="button" className="btn btn-primary"
                           onClick={function() { events.fire('export-csv'); }}>
                           {this._getLabel('dialog.export.btn.csv')}
                       </button> 
                   </div>
                   <div className="col-xs-6">
                       <button type="button" className="btn btn-primary"
                           onClick={function() { events.fire('export-json'); }}>
                           {this._getLabel('dialog.export.btn.json')}
                       </button>        
                   </div>
               </div>
           </div>
        );
        PopupPanel.openPopup({
            title : title,
            body : this._panel,
            footer : footerElm
        });

    },
 
});

module.exports = ExportPopup;
