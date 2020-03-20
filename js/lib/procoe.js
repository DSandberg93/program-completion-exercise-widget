var widgets = require('@jupyter-widgets/base');
var _ = require('lodash');

var buttonStyle = 'padding: 5px; margin-top: 5px; margin-bottom: 5px; font-size: 18px;';
var inputStyle = 'border-top: none; border-left: none; border-right: none; min-width: 300px; width: fit-content; border-bottom: 1px solid darkgrey; outline: none; ';
var outputStyle = 'margin-top: 20px; margin-bottom: 20px; display: none;';

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
    this.renderExecuteButton();
    this.renderOutputs();
    this.model.on('change:outputs', this.onOutputsChange, this);
  },

  renderProgramView: function() {
    this.programLines = this.model.get('exercise_program');
    var parsedProgram = this.parseProgram(this.programLines);
    this.el.appendChild(parsedProgram);
  },

  renderExecuteButton: function() {
    var executeButton = document.createElement('button');
    executeButton.innerHTML = 'Execute program';
    executeButton.onclick = () => this.rebuildProgram(this.programLines);
    executeButton.setAttribute('style', buttonStyle);
    this.el.appendChild(executeButton);
  },

  renderOutputs: function() {
    var userOutputElement = document.createElement('div');
    userOutputElement.setAttribute('id', 'userOutputElement');
    userOutputElement.setAttribute('style', outputStyle);
    this.el.appendChild(userOutputElement);
    var resultElement = document.createElement('div');
    resultElement.setAttribute('id', 'resultElement');
    resultElement.setAttribute('style', outputStyle);
    this.el.appendChild(resultElement);
    var expectedOutputElement = document.createElement('div');
    expectedOutputElement.setAttribute('id', 'expectedOutputElement');
    expectedOutputElement.setAttribute('style', outputStyle);
    this.el.appendChild(expectedOutputElement);
    var errorElement = document.createElement('div');
    errorElement.setAttribute('id', 'errorElement');
    errorElement.setAttribute('style', outputStyle);
    this.el.appendChild(errorElement);
  },

  onOutputsChange: function() {
    var outputs = this.model.get('outputs');
    console.log(outputs);
    this.renderUserProgramOutput(outputs.user_program);
    this.renderResult(outputs.result);
    this.renderExpectedProgramOutput(outputs.expected_result);
    this.renderError(outputs.error);
  },

  renderUserProgramOutput: function(output) {
    var userOutputElement;
    for (var i = 0; i < this.el.children.length; i++) {
      if (this.el.children[i].id === 'userOutputElement') {
        userOutputElement = this.el.children[i];
      }
    }
    if (typeof output === 'string' && output.length >= 0) {
      userOutputElement.setAttribute('style', 'display: block;');
      userOutputElement.innerHTML = 'Program output: ' + output;
    } else {
      userOutputElement.innerHTML = null;
      userOutputElement.setAttribute('style', 'display: none;');
    }
  },

  renderExpectedProgramOutput: function(output) {
    var expectedOutputElement;
    for (var i = 0; i < this.el.children.length; i++) {
      if (this.el.children[i].id === 'expectedOutputElement') {
        expectedOutputElement = this.el.children[i];
      }
    }
    console.log(output);
    if (typeof output === 'string' && output.length >= 0) {
      expectedOutputElement.setAttribute('style', 'display: block;');
      expectedOutputElement.innerHTML = 'Expected output: ' + output;
    } else {
      expectedOutputElement.innerHTML = null;
      expectedOutputElement.setAttribute('style', 'display: none;');
    }
  },

  renderResult: function(result) {
    var resultElement;
    for (var i = 0; i < this.el.children.length; i++) {
      if (this.el.children[i].id === 'resultElement') {
        resultElement = this.el.children[i];
      }
    }
    if (typeof result === 'boolean') {
      resultElement.setAttribute('style', 'display: block;');
      if (result) {
        resultElement.setAttribute('style', 'color: green;');
        resultElement.innerHTML = 'Your program implementation is correct!!!';
      } else {
        resultElement.setAttribute('style', 'color: red;');
        resultElement.innerHTML = 'Your program implementation is incorrect';
      }
    } else {
      resultElement.innerHTML = null;
      resultElement.setAttribute('style', 'display: none;');
    }
  },

  renderError: function(error) {
    var errorElement;
    for (var i = 0; i < this.el.children.length; i++) {
      if (this.el.children[i].id === 'errorElement') {
        errorElement = this.el.children[i];
      }
    }
    if (typeof error === 'string' && error.length >= 0) {
      errorElement.innerHTML = 'Error: ' + error;
      errorElement.setAttribute('style', 'display: block; color: orange;');
    } else {
      errorElement.innerHTML = null;
      errorElement.setAttribute('style', 'display: none;');
    }
  },

  parseProgram: function(programLines) {
    var parsedProgram = document.createElement('div');
    this.inputList = [];
    programLines.forEach((line, i) => {
      var codeLine = document.createElement('div');
      codeLine.setAttribute('style', 'display: flex; flex-direction: row;');
      var firstTextElement = document.createElement('pre');
      firstTextElement.setAttribute('style', '-moz-tab-size: 4; tab-size: 4;');
      firstTextElement.textContent = line[0];
      codeLine.appendChild(firstTextElement);
      if (line.length > 1) {
        for (var j = 0; j + 1 < line.length; j++) {
          var inputElement = document.createElement('input');
          inputElement.setAttribute('type', 'text');
          inputElement.setAttribute('style', inputStyle);
          codeLine.appendChild(inputElement);
          this.inputList.push(inputElement);
          var textElement = document.createElement('pre');
          textElement.setAttribute('style', '-moz-tab-size: 4; tab-size: 4;');
          textElement.textContent = line[j+1];
          codeLine.appendChild(textElement);
        }
      }
      parsedProgram.appendChild(codeLine);
    });
    return parsedProgram;
  },

  rebuildProgram: function(programLines) {
    var rebuiltProgram = [];
    var inputValueList = [];
    this.inputList.forEach((input) => inputValueList.push(input.value));
    programLines.forEach((line, i) => {
      var rebuiltLine = ''
      if (line.length > 1) {
        rebuiltLine = line[0];
        for (var j = 1; j < line.length; j++) {
          var inputValue = inputValueList.shift();
          if (typeof inputValue !== 'undefined' && typeof inputValue !== 'null') {
            rebuiltLine = rebuiltLine.concat(inputValue);
          } else {
            rebuiltLine = rebuiltLine.concat('');
          }
          rebuiltLine = rebuiltLine.concat(line[j]);
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
