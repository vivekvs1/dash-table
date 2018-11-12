import { memoizeOneFactory } from 'core/memoizer';
import {
    IDerivedData,
    IUserInterfaceViewport,
    IUserInterfaceCell
} from 'dash-table/components/Table/props';

const getter = (
    uiCell: IUserInterfaceCell | undefined,
    uiViewport: IUserInterfaceViewport | undefined,
    viewport: IDerivedData
): IDerivedData => {
    return (uiViewport && uiCell) ?
        {
            data: viewport.data.slice(
                Math.floor(uiViewport.scrollTop / uiCell.height),
                Math.ceil((Math.max(uiViewport.height, 376) + uiViewport.scrollTop) / uiCell.height)
            ),
            indices: viewport.indices.slice(
                Math.floor(uiViewport.scrollTop / uiCell.height),
                Math.ceil((Math.max(uiViewport.height, 376) + uiViewport.scrollTop) / uiCell.height)
            )
        } :
        {
            data: viewport.data.slice(0, 1),
            indices: viewport.indices.slice(0, 1)
        };
};

export default memoizeOneFactory(getter);
