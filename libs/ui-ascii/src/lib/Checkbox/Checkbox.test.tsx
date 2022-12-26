import { expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Checkbox } from './Checkbox';

it('should enforce Freebet Checkbox props', async () => {
    const onchangeSpy = vi.fn().mockImplementation(() => {
        console.log('clicked!');
    });
    render(
        <Checkbox value={'foo'} name={'bar'} onChange={onchangeSpy} defaultChecked={true}>
            foo
        </Checkbox>,
    );
    let guineaPiggy = screen.getByText('[x] foo');

    expect(guineaPiggy).toBeTruthy();

    expect(onchangeSpy).not.toHaveBeenCalled();

    await userEvent.click(guineaPiggy);

    //guineaPiggy = screen.getByText('[ ] foo');
    expect(onchangeSpy).toHaveBeenCalled();
});
