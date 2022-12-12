import { ChangeEvent, PropsWithChildren } from 'react';

interface OwnProps extends Partial<Pick<HTMLInputElement, 'value' | 'name' | 'defaultChecked'>> {
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function Checkbox({ children, ...props }: PropsWithChildren<OwnProps>): JSX.Element {
    return (
        <label>
            <input type="checkbox" {...props} />
            {children}
        </label>
    );
}
