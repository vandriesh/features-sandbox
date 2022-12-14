import { render } from '@testing-library/react';

import FeatureFreebets from './feature-freebets';

describe('FeatureFreebets', () => {
    it('should render successfully', () => {
        const { baseElement } = render(<FeatureFreebets />);
        expect(baseElement).toBeTruthy();
    });
});
