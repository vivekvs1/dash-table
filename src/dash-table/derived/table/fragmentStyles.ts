import * as R from 'ramda';
import { CSSProperties } from 'react';

import {
    IUserInterfaceCell,
    IUserInterfaceViewport,
    IDerivedData
} from 'dash-table/components/Table/props';

export default (
    virtualization: boolean,
    uiCell: IUserInterfaceCell | undefined,
    uiHeaders: IUserInterfaceCell[] | undefined,
    uiViewport: IUserInterfaceViewport | undefined,
    viewport: IDerivedData
): { fragment?: CSSProperties, cell?: CSSProperties}[][] => {
    if (!virtualization || !uiCell || !uiViewport) {
        return [
            [{}, {}],
            [{}, {}]
        ];
    }

    const headersHeight = R.sum(R.map(h => h.height, uiHeaders || []));

    const marginTop = virtualization && uiViewport && uiCell ?
        Math.floor(uiViewport.scrollTop / uiCell.height) * uiCell.height :
        0;

    const cell = {
        marginTop: `${Math.max(marginTop - headersHeight, 0)}px`
    };

    const fragment = {
        height: `${((uiCell && uiCell.height) || 1) * viewport.data.length}px`
    };

    return [
        [{}, {}],
        [{ cell }, { cell, fragment }]
    ];
};