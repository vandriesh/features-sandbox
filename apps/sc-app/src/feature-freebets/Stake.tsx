import { PropsWithChildren } from 'react';

interface OwnProps extends Partial<Pick<HTMLInputElement, 'value' | 'name' | 'readOnly'>> {}

export function Stake(props: PropsWithChildren<OwnProps>): JSX.Element {
    return <input {...props} style={{ width: '50px', backgroundColor: 'darkorange', color: 'darkgrey' }} />;
}
