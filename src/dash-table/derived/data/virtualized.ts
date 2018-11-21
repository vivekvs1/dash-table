import * as R from 'ramda';

import { memoizeOneFactory } from 'core/memoizer';
import {
    IDerivedData,
    IUserInterfaceViewport,
    IUserInterfaceCell,
    IVirtualizedDerivedData
} from 'dash-table/components/Table/props';

const getter = (
    virtualization: boolean,
    uiCell: IUserInterfaceCell | undefined,
    uiHeaders: IUserInterfaceCell[] | undefined,
    uiViewport: IUserInterfaceViewport | undefined,
    viewport: IDerivedData
): IVirtualizedDerivedData => {
    if (!virtualization) {
        return {
            ...viewport,
            offset: {
                rows: 0,
                columns: 0
            }
        };
    }

    if (!uiViewport || !uiCell) {
        return {
            data: viewport.data.slice(0, 1),
            indices: viewport.indices.slice(0, 1),
            offset: {
                rows: 0,
                columns: 0
            }
        };
    }

    const headersHeight = R.sum(R.map(h => h.height, uiHeaders || []));

    const scrollTop = Math.max(uiViewport.scrollTop - headersHeight, 0);

    const start = Math.floor(scrollTop / uiCell.height);
    const end = Math.ceil((uiViewport.height + scrollTop) / uiCell.height);

    return {
        data: viewport.data.slice(start, end),
        indices: viewport.indices.slice(start, end),
        offset: {
            rows: start,
            columns: 0
        }
    };
};

export default memoizeOneFactory(getter);
