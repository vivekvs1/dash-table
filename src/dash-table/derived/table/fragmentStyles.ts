import { CSSProperties } from 'react';

import {
    IUserInterfaceCell,
    IUserInterfaceViewport,
    IDerivedData
} from 'dash-table/components/Table/props';

export default (
    virtualization: boolean,
    uiCell: IUserInterfaceCell | undefined,
    uiViewport: IUserInterfaceViewport | undefined,
    viewport: IDerivedData
): { fragment?: CSSProperties, cell?: CSSProperties}[][] => {
    if (!virtualization || !uiCell || !uiViewport) {
        return [
            [{}, {}],
            [{}, {}]
        ];
    }

    const marginTop = virtualization && uiViewport && uiCell ?
        Math.floor(uiViewport.scrollTop / uiCell.height) * uiCell.height :
        0;

    const cell = {
        marginTop: `${marginTop}px`
    };

    const fragment = {
        height: `${((uiCell && uiCell.height) || 1) * viewport.data.length}px`
    };

    return [
        [{}, {}],
        [{ cell }, { cell, fragment }]
    ];
};