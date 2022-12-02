import { expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Checkbox } from './Checkbox';

it('should enforce Freebet Checkbox props', async (ctx) => {
    const onchangeSpy = vi.fn();
    render(<Checkbox value={'foo'} name={'bar'} onChange={onchangeSpy} defaultChecked={true} />);
    const guineaPiggy = screen.getByRole('checkbox');

    expect(guineaPiggy).toBeChecked();

    expect(onchangeSpy).not.toHaveBeenCalled();

    await userEvent.click(guineaPiggy);

    expect(guineaPiggy).not.toBeChecked();
    expect(guineaPiggy).toHaveAttribute('value', 'foo');
    expect(guineaPiggy).toHaveAttribute('name', 'bar');
    expect(onchangeSpy).toHaveBeenCalled();
});
