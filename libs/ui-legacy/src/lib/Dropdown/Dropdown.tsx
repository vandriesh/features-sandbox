import { DropdownComponent } from '@features/feature-freebets';
import isUndefined from 'lodash/isUndefined';
import map from 'lodash/map';

export const Dropdown: DropdownComponent = ({ children, defaultValue, items, ...props }) => {
    return (
        <select {...props}>
            {!isUndefined(defaultValue) && (
                <option defaultValue={defaultValue.id}>
                    {defaultValue.amount} | {defaultValue?.friendlyDescription}
                </option>
            )}
            {map(items, (fbet) => (
                <option key={fbet.id} value={fbet.id}>
                    {fbet.amount} | {fbet?.friendlyDescription}
                </option>
            ))}
        </select>
    );
};
