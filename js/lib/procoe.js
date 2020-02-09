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
  inputList: [],
  programLines: [],
  render: function() {
    this.renderProgramView();
    this.model.on('change:user_program_result', this.renderUserResult, this);
    this.model.on('change:solution_program_result', this.renderSolutionResult, this);
    this.renderExecuteButton();
  },

  renderProgramView: function() {
    this.programLines = this.model.get('exercise_program');
    this.programLines.forEach(() => this.inputList.push([]));
    var parsedProgram = this.parseProgram(this.programLines);
    this.el.appendChild(parsedProgram);
  },

  renderExecuteButton: function() {
    var executeButton = document.createElement('button');
    executeButton.innerHTML = 'Execute program';
    executeButton.onclick = () => this.rebuildProgram(this.programLines);
    this.el.appendChild(executeButton);
  },

  renderUserResult: function() {
    var userResultElement = document.getElementById('userResultElement');
    if (!userResultElement) {
      userResultElement = document.createElement('div');
      userResultElement.setAttribute('id', 'userResultElement');
      this.el.appendChild(userResultElement);
    }
    userResultElement.innerHTML = this.model.get('user_program_result');
    console.log(this.model.get('user_program_result'));
  },

  renderSolutionResult: function() {
    var solutionResultElement = document.getElementById('solutionResultElement');
    if (!solutionResultElement) {
      solutionResultElement = document.createElement('div');
      solutionResultElement.setAttribute('id', 'solutionResultElement');
      this.el.appendChild(solutionResultElement);
    }
    solutionResultElement.innerHTML = this.model.get('solution_program_result');
    console.log(this.model.get('solution_program_result'));
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
      if (line.length > 1) {
        for (var j = 1; j < line.length; j++) {
          var inputElement = document.createElement('INPUT');
          inputElement.setAttribute('type', 'text');
          inputElement.setAttribute('style', 'min-width: 300px; width: fit-content;');
          codeLine.appendChild(inputElement);
          this.inputList[i].push(inputElement);
          var textElement = document.createElement('pre');
          textElement.setAttribute('style', '-moz-tab-size: 4; tab-size: 4;');
          textElement.textContent = line[j];
          codeLine.appendChild(textElement);
        }
      }
      if (codeLine.textContent.length > 0) {
        parsedProgram.appendChild(codeLine);
      }
    });

    return parsedProgram;
  },

  rebuildProgram: function(programLines) {
    var rebuiltProgram = [];
    programLines.forEach((line, i) => {
      var rebuiltLine = ''
      if (line.length > 1) {
        for (var j = 0; j < line.length - 1; j++) {
          rebuiltLine = rebuiltLine.concat(line[j]);
          rebuiltLine = rebuiltLine.concat(this.inputList[i][j].value);
        }
      } else {
        rebuiltLine = rebuiltLine.concat(line);
      }
      rebuiltLine = rebuiltLine.concat('\n');
      if (rebuiltLine.length > 0 && rebuiltLine !== '\n') {
        rebuiltProgram.push(rebuiltLine);
      }
    });
    this.model.set('user_program', rebuiltProgram);
    this.model.save_changes();
  }
});

module.exports = {
  ProcoeModel: ProcoeModel,
  ProcoeView: ProcoeView,
}
