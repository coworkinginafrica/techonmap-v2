var revalidator = require('revalidator');
var Mosaic = require('mosaic-commons');
var _ = require('underscore');
var FormValidator = require('./FormValidator');
var DomUtils = require('./DomUtils');

var BootstrapFormValidator = FormValidator.extend(DomUtils, {

    initialize : function(schema) {
        FormValidator.prototype.initialize.apply(this, arguments);
    },

    validateForm : function(form) {
        var fields = this.extractFields(form);
        var info = this.validateFields(fields);

        var errClass = 'has-error';
        var formGroups = form.querySelectorAll('.form-group');
        _.each(formGroups, function(g) {
            this._removeClass(g, errClass);
        }, this);
        var alerts = form.querySelectorAll('.alert');
        _.each(alerts, function(a) {
            a.parentNode.removeChild(a);
        });

        if (info.result.valid)
            return info;

        var focused = false;
        _.each(info.result.errors, function(err) {
            var property = err.property;
            var field = fields[property];
            var formGroup = this._getFormGroup(field);
            this._addClass(formGroup, errClass);
            if (!focused) {
                field.focus();
                field.scrollIntoView(true);
                focused = true;
            }

            var div = document.createElement('div');
            this._addClass(div, 'alert alert-warning');
            div.innerHTML = err.message;

            field.parentNode.insertBefore(div, field.nextSibling)
        }, this);

        return info;
    },

    _getFormGroup : function(f) {
        var result;
        while (!result && f) {
            if (this._hasClass(f, 'form-group')) {
                result = f;
            }
            f = f.parentElement;
        }
        return result;
    }

});

module.exports = BootstrapFormValidator;