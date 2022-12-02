import { ChangeEvent } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { pick, times } from 'lodash';

import { Dropdown } from './Dropdown';

it('should enforce Freebet Dropdown props', async (ctx) => {
    const helperSpy = vi.fn();
    const proxySpy = vi
        .fn()
        .mockImplementation((e: ChangeEvent<HTMLSelectElement>) => helperSpy(pick(e, 'currentTarget.value')));

    render(
        <Dropdown name="baz" onChange={proxySpy} value="2">
            {times(3, (id) => (
                <option key={id} value={id}>
                    option {id}
                </option>
            ))}
        </Dropdown>,
    );
    const guineaPiggy = screen.getByRole('combobox');

    expect(guineaPiggy).toHaveValue('2');

    expect(proxySpy).not.toHaveBeenCalled();

    await userEvent.selectOptions(guineaPiggy, ['option 0']);

    expect(helperSpy).toHaveBeenCalledWith(expect.objectContaining({ currentTarget: { value: '0' } }));
});
