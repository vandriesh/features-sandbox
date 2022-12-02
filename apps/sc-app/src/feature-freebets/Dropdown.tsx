import { ChangeEvent, PropsWithChildren } from 'react';

interface OwnProps extends Partial<Pick<HTMLSelectElement, 'value' | 'name'>> {
    onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
}

export function Dropdown({ children, ...props }: PropsWithChildren<OwnProps>): JSX.Element {
    return <select {...props}>{children}</select>;
}
