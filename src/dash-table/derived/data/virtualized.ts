import * as R from 'ramda';

import { memoizeOneFactory } from 'core/memoizer';
import {
    IDerivedData,
    IUserInterfaceViewport,
    IUserInterfaceCell
} from 'dash-table/components/Table/props';

const getter = (
    virtualization: boolean,
    uiCell: IUserInterfaceCell | undefined,
    uiHeaders: IUserInterfaceCell[] | undefined,
    uiViewport: IUserInterfaceViewport | undefined,
    viewport: IDerivedData
): IDerivedData => {
    if (!virtualization) {
        return viewport;
    }

    if (!uiViewport || !uiCell) {
        return {
            data: viewport.data.slice(0, 1),
            indices: viewport.indices.slice(0, 1)
        };
    }

    const headersHeight = R.sum(R.map(h => h.height, uiHeaders || []));

    const scrollTop = Math.max(uiViewport.scrollTop - headersHeight, 0);

    const start = Math.floor(scrollTop / uiCell.height);
    const end = Math.ceil((uiViewport.height + scrollTop) / uiCell.height);

    return {
        data: viewport.data.slice(start, end),
        indices: viewport.indices.slice(start, end)
    };
};

export default memoizeOneFactory(getter);
