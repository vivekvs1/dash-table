import dash
from dash.dependencies import Input, Output, State

import dash_html_components as html
import dash_table

import pandas as pd
df = pd.read_csv('https://github.com/plotly/datasets/raw/master/26k-consumer-complaints.csv')
df = df.values

app = dash.Dash()
app.css.config.serve_locally = True
app.scripts.config.serve_locally = True

app.layout = html.Div([
    dash_table.Table(
        id='table',
        dataframe=[],
        virtualization='be',
        virtualization_settings={
            'displayedPages': 1,
            'currentPage': 0,
            'pageSize': 500
        },
        columns=[
            {'id': 0, 'name': 'Complaint ID'},
            {'id': 1, 'name': 'Product'},
            {'id': 2, 'name': 'Sub-product'},
            {'id': 3, 'name': 'Issue'},
            {'id': 4, 'name': 'Sub-issue'},
            {'id': 5, 'name': 'State'},
            {'id': 6, 'name': 'ZIP'},
            {'id': 7, 'name': 'code'},
            {'id': 8, 'name': 'Date received'},
            {'id': 9, 'name': 'Date sent to company'},
            {'id': 10, 'name': 'Company'},
            {'id': 11, 'name': 'Company response'},
            {'id': 12, 'name': 'Timely response?'},
            {'id': 13, 'name': 'Consumer disputed?'}
        ],
        editable=True
    )
])

@app.callback(
    Output('table', 'dataframe'),
    [Input('table', 'virtualization_settings')]
)
def updateDataframe(virtualization_settings):
    print virtualization_settings

    currentPage = virtualization_settings['currentPage']
    displayedPages = virtualization_settings['displayedPages']
    pageSize = virtualization_settings['pageSize']

    startIndex = currentPage * pageSize
    endIndex = startIndex + displayedPages * pageSize
    print str(startIndex) + ',' + str(endIndex)

    return df[startIndex:endIndex]

if __name__ == '__main__':
    app.run_server(debug=True)