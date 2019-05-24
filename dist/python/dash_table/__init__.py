from __future__ import print_function as _

import os as _os
import sys as _sys
import json

import dash as _dash

# noinspection PyUnresolvedReferences
from ._imports_ import *
from ._imports_ import __all__

from .version import __version__

if not hasattr(_dash, 'development'):
    print('Dash was not successfully imported. '
          'Make sure you don\'t have a file '
          'named \n"dash.py" in your current directory.', file=_sys.stderr)
    _sys.exit(1)

_js_dist = [
    {
        'relative_package_path': 'data_table.js',
        'external_url': (
            'https://unpkg.com/dash-table@{}/dash_table/data_table.js'
        ).format(__version__),
        'namespace': 'dash_table'
    },
    {
        'relative_package_path': 'data_table.js.map',
        'external_url': (
            'https://unpkg.com/dash-table@{}/dash_table/data_table.js.map'
        ).format(__version__),
        'namespace': 'dash_table',
        'dynamic': True
    }
]

_css_dist = []

for _component in __all__:
    setattr(locals()[_component], '_js_dist', _js_dist)
    setattr(locals()[_component], '_css_dist', _css_dist)
