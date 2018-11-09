import React from 'react';

import { ICellFactoryOptions } from 'dash-table/components/Table/props';
import derivedCellWrappers from 'dash-table/derived/cell/wrappers';
import derivedCellInputs from 'dash-table/derived/cell/inputs';
import derivedCellOperations from 'dash-table/derived/cell/operations';
import derivedCellStyles from 'dash-table/derived/cell/wrapperStyles';
import derivedDropdowns from 'dash-table/derived/cell/dropdowns';
import { derivedRelevantCellStyles } from 'dash-table/derived/style';

import { matrixMap3 } from 'core/math/matrixZipMap';
import { arrayMap } from 'core/math/arrayZipMap';
// import Logger from 'core/Logger';

export default class CellFactory {
    private readonly cellInputs = derivedCellInputs();
    private readonly cellOperations = derivedCellOperations();
    private readonly cellDropdowns = derivedDropdowns();

    private get props() {
        return this.options.propsFn();
    }

    private get state() {
        return this.options.stateFn();
    }

    constructor(
        private readonly options: ICellFactoryOptions,
        private readonly cellStyles = derivedCellStyles(),
        private readonly cellWrappers = derivedCellWrappers(options.propsFn().id),
        private readonly relevantStyles = derivedRelevantCellStyles()
    ) { }

    public createCells() {
        const {
            active_cell,
            columns,
            column_conditional_dropdowns,
            column_static_dropdown,
            data,
            dropdown_properties, // legacy
            editable,
            id,
            is_focused,
            row_deletable,
            row_selectable,
            selected_cells,
            selected_rows,
            setProps,
            style_cell,
            style_cell_conditional,
            style_data,
            style_data_conditional,
            viewport,
            // virtualization
        } = this.props;

        const {
            viewport: uiViewport,
            cell
        } = this.state;

        const virtualized = (uiViewport && cell) ?
            {
                data: viewport.data.slice(
                    Math.floor(uiViewport.scrollY / cell.height),
                    Math.ceil((Math.max(uiViewport.height, 376) + uiViewport.scrollY) / cell.height)
                ),
                indices: viewport.indices.slice(
                    Math.floor(uiViewport.scrollY / cell.height),
                    Math.ceil((Math.max(uiViewport.height, 376) + uiViewport.scrollY) / cell.height)
                )
            } :
            {
                data: viewport.data.slice(0, 1),
                indices: viewport.indices.slice(0, 1)
            };

        const operations = this.cellOperations(
            active_cell,
            data,
            virtualized.data,
            virtualized.indices,
            row_selectable,
            row_deletable,
            selected_rows,
            setProps
        );

        const wrappers = this.cellWrappers(
            active_cell,
            columns,
            virtualized.data,
            selected_cells
        );

        const relevantStyles = this.relevantStyles(
            style_cell,
            style_data,
            style_cell_conditional,
            style_data_conditional
        );

        const wrapperStyles = this.cellStyles(
            columns,
            relevantStyles,
            virtualized.data
        );

        const dropdowns = this.cellDropdowns(id)(
            columns,
            virtualized.data,
            virtualized.indices,
            column_conditional_dropdowns,
            column_static_dropdown,
            dropdown_properties
        );

        const inputs = this.cellInputs(
            active_cell,
            columns,
            virtualized.data,
            editable,
            !!is_focused,
            id,
            dropdowns,
            this.options.propsFn
        );

        const cells = matrixMap3(
            wrappers,
            wrapperStyles,
            inputs,
            (w, s, i) => React.cloneElement(w, { children: [i], style: s })
        );

        return arrayMap(
            operations,
            cells,
            (o, c) => Array.prototype.concat(o, c)
        );
    }
}