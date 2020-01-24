var plugin = require('./index');
var base = require('@jupyter-widgets/base');

module.exports = {
  id: 'procoe',
  requires: [base.IJupyterWidgetRegistry],
  activate: function(app, widgets) {
      widgets.registerWidget({
          name: 'procoe',
          version: plugin.version,
          exports: plugin
      });
  },
  autoStart: true
};

