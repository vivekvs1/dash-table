import * as R from 'ramda';

import { memoizeOneFactory } from 'core/memoizer';

import {
    Data,
    Datum,
    VisibleColumns,
    ColumnId,
    Indices,
    IColumnDropdown,
    IConditionalColumnDropdown,
    IDropdownProperties,
    DropdownValues
} from 'dash-table/components/Table/props';
import SyntaxTree from 'core/syntax-tree';
import memoizerCache from 'core/memoizerCache';
import { IConditionalDropdown } from 'dash-table/components/CellDropdown/types';

const mapData = R.addIndex<Datum, (DropdownValues | undefined)[]>(R.map);

const getter = (
    cache: (k1: ColumnId, k2: number) => (q1: string, q2: Datum) => boolean,
    columns: VisibleColumns,
    data: Data,
    indices: Indices,
    columnConditionalDropdown: IConditionalColumnDropdown[],
    columnStaticDropdown: IColumnDropdown[],
    dropdown_properties: IDropdownProperties
): (DropdownValues | undefined)[][] => mapData((datum, rowIndex) => R.map(column => {
    const realIndex = indices[rowIndex];

    let legacyDropdown = (
        (
            dropdown_properties &&
            dropdown_properties[column.id] &&
            (
                dropdown_properties[column.id].length > realIndex ?
                    dropdown_properties[column.id][realIndex] :
                    null
            )
        ) || column
    ).options;

    const conditional = columnConditionalDropdown.find((cs: any) => cs.id === column.id);
    const base = columnStaticDropdown.find((ss: any) => ss.id === column.id);

    const conditionalDropdowns = (conditional && conditional.dropdowns) || [];
    const staticDropdown = legacyDropdown || (base && base.dropdown);

    const dropdowns = [
        ...(staticDropdown ? [staticDropdown] : []),
        ...R.map(
            ([cd]) => cd.dropdown,
            R.filter(
                ([cd, i]) => cache(column.id, i)(cd.condition, datum),
                R.addIndex<IConditionalDropdown, [IConditionalDropdown, number]>(R.map)(
                    (cd, i) => [cd, i],
                    conditionalDropdowns
                ))
        )
    ];

    return dropdowns.length ? dropdowns.slice(-1)[0] : undefined;
}, columns), data);

const getterFactory = memoizeOneFactory(getter);

const decoratedGetter = (_id: string): ((
    columns: VisibleColumns,
    data: Data,
    indices: Indices,
    columnConditionalDropdown: any,
    columnStaticDropdown: any,
    dropdown_properties: any
) => (DropdownValues | undefined)[][]) => {
    const cache = memoizerCache<[ColumnId, number]>()((query: string, datum: Datum) => new SyntaxTree(query).evaluate(datum));

    return getterFactory().bind(undefined, cache.get);
};

export default memoizeOneFactory(decoratedGetter);
