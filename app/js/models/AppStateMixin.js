var _ = require('underscore');

module.exports = {

    getAppState : function() {
        var app = this.options.app;
        return app.state;
    },

    _updateAppState : function(path, value) {
        var state = this.getAppState();
        function visit(p, obj) {
            if (_.isArray(obj)) {
                state.setValues(p, obj);
            } else if (_.isObject(obj)) {
                _.each(obj, function(val, key) {
                    visit(p + '.' + key, val);
                });
            } else {
                state.setValue(p, obj);
            }
        }
        visit(path, value);
    },

    _getAppState : function(path) {
        var state = this.getAppState();
        return state.getValue(path);
    },

    /** Returns the current language */
    getLanguage : function(){ return this.options.app.getLanguage(); },
    getDefaultLanguage : function(){ return this.options.app.getDefaultLanguage(); },
    setLanguage : function(languageKey){ this.options.app.setLanguage(languageKey); }

};
