import { DropdownComponent } from '@features/feature-freebets';

export const Dropdown: DropdownComponent = ({ children, ...props }) => {
    return <select {...props}>{children}</select>;
};
