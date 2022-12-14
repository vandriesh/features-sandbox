import styled from '@emotion/styled';

/* eslint-disable-next-line */
export interface FeatureFreebetsProps {}

const StyledFeatureFreebets = styled.div`
    color: pink;
`;

export function FeatureFreebets(props: FeatureFreebetsProps) {
    return (
        <StyledFeatureFreebets>
            <h1>Welcome to FeatureFreebets!</h1>
        </StyledFeatureFreebets>
    );
}

export default FeatureFreebets;
