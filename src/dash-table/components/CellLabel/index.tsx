import React, {
    PureComponent
} from 'react';

interface IProps {
    props?: object;
    value: any;
}

export default class CellLabel extends PureComponent<IProps> {
    render() {
        const {
            props,
            value
        } = this.props;

        return (<div {...props}>
            {value}
        </div>);
    }
}