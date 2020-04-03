var widgets = require('@jupyter-widgets/base');
var _ = require('lodash');

// See example.py for the kernel counterpart to this file.


// Custom Model. Custom widgets models must at least provide default values
// for model attributes, including
//
//  - `_view_name`
//  - `_view_module`
//  - `_view_module_version`
//
//  - `_model_name`
//  - `_model_module`
//  - `_model_module_version`
//
//  when different from the base class.

// When serialiazing the entire widget state for embedding, only values that
// differ from the defaults will be specified.
var HelloModel = widgets.DOMWidgetModel.extend({
    defaults: _.extend(widgets.DOMWidgetModel.prototype.defaults(), {
        _model_name : 'HelloModel',
        _view_name : 'HelloView',
        _model_module : 'procoe',
        _view_module : 'procoe',
        _model_module_version : '1.0.0',
        _view_module_version : '1.0.0'
    })
});


// Custom View. Renders the widget model.
var HelloView = widgets.DOMWidgetView.extend({
    // Defines how the widget gets rendered into the DOM
    render: function() {
        this.value_changed();

        // Observe changes in the value traitlet in Python, and define
        // a custom callback.
        this.model.on('change:value', this.value_changed, this);
    },

    value_changed: function() {
        var codeLines = this.model.get('value');
        console.log(codeLines);
        codeLines.forEach((line, i) => {
          var inputElement = document.createElement('INPUT');
          inputElement.setAttribute('type', 'text');
          inputElement.setAttribute('class', 'inputElement');
          var codeLine = document.createElement('pre');
          codeLine.setAttribute('style', '-moz-tab-size: 4; tab-size: 4;');
          codeLine.textContent = line;
          inputElement.setAttribute('id', `input${i}`);
          codeLine.appendChild(inputElement);
          this.el.appendChild(codeLine);
        });


        var button = document.createElement('button');
        button.textContent = 'button';
        button.addEventListener('click', function() {
          var inputs = document.getElementsByClassName('inputElement');
          for (var i = 0; i < inputs.length; i++) {
            console.log(inputs[i].value);
          }
        });
        this.el.appendChild(button);

    }
});


module.exports = {
    HelloModel: HelloModel,
    HelloView: HelloView
};
