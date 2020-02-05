var widgets = require('@jupyter-widgets/base');
var _ = require('lodash');

var ProcoeModel = widgets.DOMWidgetModel.extend({
  defaults: _.extend(widgets.DOMWidgetModel.prototype.defaults(), {
    _model_name: 'ProcoeModel',
    _model_module: 'procoe',
    _model_module_version: '0.1.0',
    _view_name: 'ProcoeView',
    _view_module: 'procoe',
    _view_module_version: '0.1.0'
  })
});

var ProcoeView = widgets.DOMWidgetView.extend({
  render: function() {
    this.renderView();
    this.model.on('change:exercise_program', this.renderView, this);
  },

  renderView: function() {
    var programLines = this.model.get('exercise_program');
    var parsedProgram = this.parseProgram(programLines);
    this.el.appendChild(parsedProgram);

  },

  parseProgram: function(programLines) {
    var parsedProgram = document.createElement('div');
    programLines.forEach((line, i) => {
      var codeLine = document.createElement('div');
      codeLine.setAttribute('style', 'display: flex; flex-direction: row;');
      var firstTextElement = document.createElement('pre');
      firstTextElement.setAttribute('style', '-moz-tab-size: 4; tab-size: 4;');
      firstTextElement.textContent = line[0];
      codeLine.appendChild(firstTextElement);
      console.log(line);
      if (line.length > 1) {
        for (var i = 1; i < line.length; i++) {
          console.log(i);
          var inputElement = document.createElement('INPUT');
          inputElement.setAttribute('type', 'text');
          inputElement.setAttribute('style', 'min-width: 300px; width: fit-content;');
          codeLine.appendChild(inputElement);
          var textElement = document.createElement('pre');
          textElement.setAttribute('style', '-moz-tab-size: 4; tab-size: 4;');
          textElement.textContent = line[i];
          codeLine.appendChild(textElement);
        }
      }
      console.log(codeLine);
      parsedProgram.appendChild(codeLine);
    });

    return parsedProgram;
  }
});

module.exports = {
  ProcoeModel: ProcoeModel,
  ProcoeView: ProcoeView,
}
