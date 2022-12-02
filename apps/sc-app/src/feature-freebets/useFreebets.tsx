import isEmpty from 'lodash/isEmpty';
import keys from 'lodash/keys';
import omit from 'lodash/omit';
import filter from 'lodash/filter';
import isUndefined from 'lodash/isUndefined';
import includes from 'lodash/includes';
import { createContext, PropsWithChildren, useCallback, useContext, useReducer } from 'react';
import { find, get, has } from 'lodash';

export interface Freebet {
    id: number;
    amount: number;
    promotionId: string;
    friendlyDescription: string;
    expiryDate: string;
}

type FreebetId = Freebet['id'];
type LinkedEntityId = string;
type AppliedFreebets = Record<FreebetId, LinkedEntityId>;
type LinkedEntities = Record<LinkedEntityId, FreebetId>;

interface FreebetsState {
    linkedEntities: LinkedEntities;
    appliedFreebets: AppliedFreebets;
    availableFreebets: Freebet[];
    freebets: Freebet[];
    timestamp: number;
}
interface FreebetPare {
    linkedEntityId: string;
    freebetId: FreebetId;
}
interface FreebetsContent {
    state: FreebetsState;
    setFreebets: (freebets: Freebet[]) => void;
    inUse: (linkedEntityId: LinkedEntityId) => boolean;
    getFreebet: (linkedEntityId: LinkedEntityId) => Freebet | undefined;
    getFirstAvailable: () => Freebet;
    removeFreebet: (payload: FreebetPare) => void;
    applyFreebet: (payload: FreebetPare) => void;
}

export const FreebetsContext = createContext(undefined);

type ApplyFreebetAction = { type: 'ApplyFreebet'; linkedEntityId: string; freebetId: FreebetId };
type RemoveFreebetAction = { type: 'RemoveFreebet'; linkedEntityId: string; freebetId: FreebetId };
type SetFreebetAction = { type: 'SetFreebets'; freebets: Freebet[] };

type Actions = ApplyFreebetAction | RemoveFreebetAction | SetFreebetAction;

const excludeSelected = (items: any[], dictionary: AppliedFreebets) => {
    if (isEmpty(dictionary)) {
        return items;
    }
    const usedFreebets = keys(dictionary);

    return filter(items, ({ id }) => !includes(usedFreebets, `${id}`));
};

function freebetReducer(state: FreebetsState, action: Actions): FreebetsState {
    switch (action.type) {
        case 'SetFreebets': {
            return {
                freebets: action.freebets,
                availableFreebets: action.freebets,
                appliedFreebets: {},
                linkedEntities: {},
                timestamp: Date.now(),
            };
        }
        case 'ApplyFreebet': {
            const appliedFreebets = {
                ...state.appliedFreebets,
                [action.freebetId]: action.linkedEntityId,
            };
            const linkedEntities = {
                ...state.linkedEntities,
                [action.linkedEntityId]: action.freebetId,
                timestamp: Date.now(),
            };
            return {
                ...state,
                linkedEntities,
                appliedFreebets,
                availableFreebets: excludeSelected(state.freebets, appliedFreebets),
                timestamp: Date.now(),
            };
        }
        case 'RemoveFreebet': {
            const appliedFreebets = omit(state.appliedFreebets, action.freebetId);
            const linkedEntities = omit(state.linkedEntities, action.linkedEntityId);
            return {
                ...state,
                appliedFreebets,
                linkedEntities,
                availableFreebets: excludeSelected(state.freebets, appliedFreebets),
                timestamp: Date.now(),
            };
        }
        default:
            throw `Unknown action ${JSON.stringify(action)}`;
    }
}

const initState: FreebetsState = {
    linkedEntities: {},
    appliedFreebets: {},
    availableFreebets: [],
    freebets: [],
    timestamp: Date.now(),
};

interface OwnProps {
    freebets: Freebet[];
}

export function FreebetsProvider({ freebets, ...props }: PropsWithChildren<OwnProps & any>) {
    const [state, dispatch] = useReducer(freebetReducer, { ...initState, availableFreebets: freebets, freebets });
    const inUse = useCallback(
        (linkedEntity: LinkedEntityId): boolean => has(state, `linkedEntities[${linkedEntity}]`),
        [state.timestamp],
    );

    const getFreebet = useCallback(
        (linedEntityId: LinkedEntityId): Freebet | undefined => {
            if (isEmpty(state.linkedEntities)) {
                return;
            }

            const freebetId = state.linkedEntities[linedEntityId];

            return find(state.freebets, { id: freebetId });
        },
        [state.timestamp],
    );

    const removeFreebet = useCallback(
        (payload: FreebetPare) => dispatch({ type: 'RemoveFreebet', ...payload }),
        [state.timestamp],
    );

    const applyFreebet = useCallback(
        (payload: FreebetPare) =>
            dispatch({
                type: 'ApplyFreebet',
                ...payload,
            }),
        [state.timestamp],
    );

    const setFreebets = useCallback(
        (freebets: Freebet[]) => {
            dispatch({ type: 'SetFreebets', freebets });
        },
        [state.timestamp],
    );

    const getFirstAvailable = useCallback(() => {
        const firstAvailable = get(state, 'availableFreebets.0');

        if (!isUndefined(firstAvailable)) {
            return firstAvailable;
        }

        return get(state, 'freebets.0');
    }, [state.timestamp]);

    const value: FreebetsContent = {
        state,
        applyFreebet,
        inUse,
        getFreebet,
        getFirstAvailable,
        setFreebets,
        removeFreebet,
    };

    return <FreebetsContext.Provider value={value} {...props} />;
}

export function useFreebets(): FreebetsContent {
    const pubSubContext = useContext(FreebetsContext);

    if (pubSubContext === undefined) {
        throw new Error(`useFreebets must be used within a FreebetsProvider`);
    }

    return pubSubContext;
}
