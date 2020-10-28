program-completion-exercise-widget
===============================

A custom widget for solving program completion exercises in Python

Installation
------------

<strike>
To install use pip:

    $ pip install procoe
    $ jupyter nbextension enable --py --sys-prefix procoe
</strike>

This widget is currently not available for installation as a package using pip. Please use development installation for now.

To install for jupyterlab

    $ jupyter labextension install procoe

For a development installation (requires npm),

    $ git clone https://github.com//program-completion-exercise-widget.git
    $ cd program-completion-exercise-widget
    $ pip install -e .
    $ jupyter nbextension install --py --symlink --sys-prefix procoe
    $ jupyter nbextension enable --py --sys-prefix procoe
    $ jupyter labextension install js

When actively developing your extension, build Jupyter Lab with the command:

    $ jupyter lab --watch

This take a minute or so to get started, but then allows you to hot-reload your javascript extension.
To see a change, save your javascript, watch the terminal for an update.

Note on first `jupyter lab --watch`, you may need to touch a file to get Jupyter Lab to open.

