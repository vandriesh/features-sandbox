import { ChangeEvent, FC, PropsWithChildren, useEffect, useState } from 'react';
import isUndefined from 'lodash/isUndefined';

import { Freebet, useFreebets } from '@features/feature-freebets';
import get from 'lodash/get';
import map from 'lodash/map';

interface CheckboxProps extends Partial<Pick<HTMLInputElement, 'value' | 'name' | 'defaultChecked'>> {
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

interface DropdownProps extends Partial<Pick<HTMLSelectElement, 'value' | 'name'>> {
    onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
}

export type DropdownComponent = (props: PropsWithChildren<DropdownProps>) => JSX.Element;
export type CheckboxComponent = (props: PropsWithChildren<CheckboxProps>) => JSX.Element;

interface FreeBetProps {
    linkedEntityId: string;
    UI: {
        Checkbox: CheckboxComponent;
        Dropdown: DropdownComponent;
    };
}

export function FreeBetContainer(props: FreeBetProps): JSX.Element | null {
    const { linkedEntityId, UI } = props;
    const { state, removeFreebet, applyFreebet, getFreebet, inUse } = useFreebets();
    const selectedFreebet = getFreebet(linkedEntityId);
    const [freebet, setFreebet] = useState<Freebet | undefined>(get(state, 'availableFreebets.0'));
    const usesFreebet = inUse(linkedEntityId);
    const toggleFreebet = (e: ChangeEvent<HTMLInputElement>) => {
        if (isUndefined(freebet)) {
            return;
        }

        if (e.target.checked) {
            applyFreebet({ freebetId: freebet.id, linkedEntityId: linkedEntityId });
        } else {
            removeFreebet({ freebetId: freebet.id, linkedEntityId: linkedEntityId });
        }
    };

    const selectFreebet = (e: ChangeEvent<HTMLSelectElement>) => {
        console.log('selectFreebet', e.currentTarget.value);
    };

    useEffect(() => {
        return () => {
            if (!isUndefined(selectedFreebet)) {
                removeFreebet({ freebetId: selectedFreebet.id, linkedEntityId: linkedEntityId });
            }
        };
    }, [selectedFreebet?.id]);

    useEffect(() => {
        if (!isUndefined(selectedFreebet)) {
            return;
        }
        setFreebet(get(state, 'availableFreebets.0'));
    }, [state.timestamp]);

    if (isUndefined(freebet)) {
        return null;
    }

    return (
        <div>
            <UI.Checkbox
                onChange={toggleFreebet}
                defaultChecked={usesFreebet}
                name={`freebet-for-${linkedEntityId}`}
                value={`${freebet?.id}`}
            >
                Freebet $
            </UI.Checkbox>
            <UI.Dropdown onChange={selectFreebet}>
                {!isUndefined(selectedFreebet) && (
                    <option defaultValue={selectedFreebet.id}>
                        {selectedFreebet.amount} | {selectedFreebet?.friendlyDescription}
                    </option>
                )}
                {map(state.availableFreebets, (fbet) => (
                    <option key={fbet.id} value={fbet.id}>
                        {fbet.amount} | {fbet?.friendlyDescription}
                    </option>
                ))}
            </UI.Dropdown>
        </div>
    );
}
