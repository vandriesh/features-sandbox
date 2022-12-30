import { CheckboxComponent } from '@features/feature-freebets';
import { ChangeEvent } from 'react';

export const Checkbox: CheckboxComponent = ({ children, onChange = () => {}, defaultChecked, ...props }) => {
    const toggle = (checked: boolean) => {
        onChange({ target: { value: props.value, checked } } as ChangeEvent<HTMLInputElement>);
    };

    if (defaultChecked) {
        return (
            <span {...props} onClick={() => toggle(false)} style={{color: 'white'}}>
                [x] {children}
            </span>
        );
    }

    return (
        <span {...props} onClick={() => toggle(true)} style={{color: 'white'}}>
            [ ] {children}
        </span>
    );
};
