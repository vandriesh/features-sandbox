import { ChangeEvent } from 'react';
import * as FreebetUI from './index';

export function FreeBetContainer(): JSX.Element | null {
    const toggleFreebet = (e: ChangeEvent<HTMLInputElement>) => {
        console.log('toggleFreebet', e.currentTarget.value, e.currentTarget.checked);
    };

    const selectFreebet = (e: ChangeEvent<HTMLSelectElement>) => {
        console.log('selectFreebet', e.currentTarget.value);
    };
    return (
        <div>
            <FreebetUI.Checkbox onChange={toggleFreebet}>Freebet $</FreebetUI.Checkbox>
            <FreebetUI.Dropdown onChange={selectFreebet}>
                <option>$ 1000</option>
            </FreebetUI.Dropdown>
        </div>
    );
}
