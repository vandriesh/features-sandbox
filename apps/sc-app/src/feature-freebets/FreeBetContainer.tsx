import { ChangeEvent, useEffect, useState } from 'react';
import isUndefined from 'lodash/isUndefined';

import { Freebet, useFreebets } from './useFreebets';
import get from 'lodash/get';
import map from 'lodash/map';
import * as FreebetUI from './index';

interface FreeBetProps {
    linkedEntityId: string;
}

export function FreeBetContainer(props: FreeBetProps): JSX.Element | null {
    const {linkedEntityId} = props;
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
            <FreebetUI.Checkbox
                onChange={toggleFreebet}
                defaultChecked={usesFreebet}
                name={`freebet-for-${linkedEntityId}`}
                value={`${freebet?.id}`}
            >
                Freebet $
            </FreebetUI.Checkbox>
            <FreebetUI.Dropdown onChange={selectFreebet}>
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
            </FreebetUI.Dropdown>
        </div>
    );
}
