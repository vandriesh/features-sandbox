import { PropsWithChildren } from 'react';

interface OwnProps extends Partial<Pick<HTMLInputElement, 'value' | 'name' | 'readOnly'>> {}

export function Stake(props: PropsWithChildren<OwnProps>): JSX.Element {
    return (
        <span style={{ textAlign: 'right', width: '75px', backgroundColor: 'darkorange', color: 'white' }}>
            [{props.value}]
        </span>
    );
}
