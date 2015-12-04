/** @jsx React.DOM */
var _ = require('underscore');
var React = require('react');
var PanelSwitcher = require('./PanelSwitcher');

function toArray(args){
    args = _.toArray(args);
    if (args.length == 1 && _.isArray(args[0])) {
        args = _.toArray(args[0]);
    }
    return args;
}

var MenuMixin = {
    _renderMenuItems : function(key){
        return (        
            <ul className="list-group" key={key}>
                {_.map(arguments, function(val) {
                    return <li className="list-group-item">{val}</li>
                })}
            </ul>
        );
    },
    _renderMenuPanel : function(options){
        var key = options.key || _.uniqueId('menu-');
        
        var heading = options.heading;
        var headingPanel = !!heading ? <div key={key + '-heading'} className="panel-heading">{heading}</div> : null;
        
        var body = options.view;
        var bodyPanel = !!body ? <div key={key + '-body'} className="panel-body">{body}</div> : null;  
        return (
             <div className="panel" key={key}>
                 {headingPanel}
                 {bodyPanel}
             </div>
        );
    },
    _renderMenuPanelGroup : function(){
        var args = toArray(arguments);
        var ref = args.shift();
        var className = "panel-group " + ref;
        return (<div className={className} key={ref} ref={ref}>{args}</div>);
    },
    _renderMenuPanels : function(){
        var panels = toArray(arguments);
        return (
            <PanelSwitcher
                className="container"
                key="panels"
                ref="panels"
                onPanelUpdate={this.props.onPanelUpdate}>
                {panels}
            </PanelSwitcher>
       );
    },
    _toggleMenuPanel : function(panelKey, ev) {
        if (ev) {
            ev.preventDefault();
            ev.stopPropagation();
        }
        return this.refs.panels.activate(panelKey);
    },
    _renderMenuRef : function(labelKey, panelKey, view) {
        return (
           <a href="#" onClick={_.bind(this._toggleMenuPanel, this, panelKey)}
               key={panelKey}>
               <i className="chevron-right pull-right"/>
               {this._getLabel(labelKey)}
               {view}
           </a>
        );
    },
    _renderMenuReturnRef : function(key, labelKey){
        key = key || 'main';
        labelKey  = labelKey || 'search.panel.button.return';
        return this._renderMenuItems(
            <a href="#" className="return" onClick={_.bind(this._toggleMenuPanel, this, key)}
                key={key}>
                <i className="chevron-left pull-left"/>
                {this._getLabel(labelKey)}
            </a>
        );
    },
};

module.exports = MenuMixin;
