import { render } from '@testing-library/react';

import UiLegacy from './ui-legacy';

describe('UiLegacy', () => {
    it('should render successfully', () => {
        const { baseElement } = render(<UiLegacy />);
        expect(baseElement).toBeTruthy();
    });
});
