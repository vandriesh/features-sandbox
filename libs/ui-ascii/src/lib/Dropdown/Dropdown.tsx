import { DropdownComponent } from '@features/feature-freebets';
import isUndefined from 'lodash/isUndefined';

export const Dropdown: DropdownComponent = ({ children, defaultValue, items, ...props }) => {
    if (!isUndefined(defaultValue)) {
        return (
            <>
                `[ ${defaultValue.amount} | ${defaultValue.friendlyDescription?.substring(0, 10)}...]`
            </>
        );
    }

    const [first] = items;

    if (!isUndefined(first)) {
        return (
            <>
                `[ ${first.amount} | ${first.friendlyDescription?.substring(0, 10)}...]`
            </>
        );
    }

    return <>`[]`</>;
};
