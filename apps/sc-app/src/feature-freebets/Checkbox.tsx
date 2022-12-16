import { CheckboxComponent } from '@features/feature-freebets';

export const Checkbox : CheckboxComponent = ({ children, ...props }) => {
    return (
        <label>
            <input type="checkbox" { ...props } />
            { children }
        </label>
    );
}
