import { CheckboxComponent } from '@features/feature-freebets';
import { ChangeEvent } from 'react';
import { S_Span } from './styled';

export const Checkbox: CheckboxComponent = ({ children, onChange = () => {}, defaultChecked, ...props }) => {
    const toggle = (checked: boolean) => {
        onChange({ target: { value: props.value, checked } } as ChangeEvent<HTMLInputElement>);
    };

    if (defaultChecked) {
        return (
            <S_Span {...props} onClick={() => toggle(false)}>
                [x] {children}
            </S_Span>
        );
    }

    return (
        <S_Span {...props} onClick={() => toggle(true)}>
            [ ] {children}
        </S_Span>
    );
};
