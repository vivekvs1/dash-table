import * as R from 'ramda';
import React from 'react';

import {arrayMap} from 'core/math/arrayZipMap';
import {matrixMap3} from 'core/math/matrixZipMap';

import {ControlledTableProps} from 'dash-table/components/Table/props';
import derivedHeaderContent from 'dash-table/derived/header/content';
import getHeaderRows from 'dash-table/derived/header/headerRows';
import getIndices from 'dash-table/derived/header/indices';
import getLabels from 'dash-table/derived/header/labels';
import derivedHeaderOperations from 'dash-table/derived/header/operations';
import derivedHeaderWrappers from 'dash-table/derived/header/wrappers';
import {derivedRelevantHeaderStyles} from 'dash-table/derived/style';
import derivedHeaderStyles from 'dash-table/derived/header/wrapperStyles';
import {
    derivedVerticalEdges,
    derivedHorizontalEdges,
} from 'dash-table/derived/edges/cell';

export default class HeaderFactory {
    private readonly headerContent = derivedHeaderContent();
    private readonly headerOperations = derivedHeaderOperations();
    private readonly headerStyles = derivedHeaderStyles();
    private readonly headerWrappers = derivedHeaderWrappers();
    private readonly relevantStyles = derivedRelevantHeaderStyles();
    private readonly verticalEdges = derivedVerticalEdges();
    private readonly horizontalEdges = derivedHorizontalEdges();

    private get props() {
        return this.propsFn();
    }

    constructor(private readonly propsFn: () => ControlledTableProps) {}

    public createHeaders() {
        const props = this.props;

        let {
            columns,
            merge_duplicate_headers,
            pagination_mode,
            row_deletable,
            row_selectable,
            setProps,
            sorting,
            sorting_settings,
            sorting_type,
            style_cell,
            style_cell_conditional,
            style_header,
            style_header_conditional,
        } = props;

        const headerRows = getHeaderRows(columns);

        const labels = getLabels(columns, headerRows);
        const indices = getIndices(columns, labels, merge_duplicate_headers);

        const labelsAndIndices = R.zip(labels, indices);

        const relevantStyles = this.relevantStyles(
            style_cell,
            style_header,
            style_cell_conditional,
            style_header_conditional
        );

        const borderStyles = R.map(style => {
            return {
                ...style,
                style: R.pick(
                    [
                        'border',
                        'borderTop',
                        'borderRight',
                        'borderBottom',
                        'borderLeft',
                    ],
                    style.style
                ),
            };
        }, relevantStyles);

        const relevantStylesWithoutBorders = R.map(style => {
            return {
                ...style,
                style: R.omit(
                    [
                        'border',
                        'borderTop',
                        'borderRight',
                        'borderBottom',
                        'borderLeft',
                    ],
                    style.style
                ),
            };
        }, relevantStyles);

        const vertical_edges_matrix = this.verticalEdges(
            columns,
            R.range(0, headerRows),
            borderStyles,
            {rows: 0, columns: 0}
        );
        const horizontal_edges_matrix = this.horizontalEdges(
            columns,
            R.range(0, headerRows),
            borderStyles,
            {rows: 0, columns: 0}
        );

        const operations = this.headerOperations(
            headerRows,
            row_selectable,
            row_deletable,
            vertical_edges_matrix,
            horizontal_edges_matrix
        );

        const wrapperStyles = this.headerStyles(
            columns,
            headerRows,
            relevantStylesWithoutBorders,
            vertical_edges_matrix,
            horizontal_edges_matrix
        );

        const wrappers = this.headerWrappers(
            columns,
            labelsAndIndices,
            merge_duplicate_headers
        );

        const content = this.headerContent(
            columns,
            labelsAndIndices,
            sorting,
            sorting_type,
            sorting_settings,
            pagination_mode,
            setProps,
            props
        );

        const headers = matrixMap3(
            wrappers,
            wrapperStyles,
            content,
            (w, s, c) => React.cloneElement(w, {children: [c], style: s})
        );

        return arrayMap(operations, headers, (o, h) =>
            Array.prototype.concat(o, h)
        );
    }
}
