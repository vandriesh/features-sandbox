import styled from '@emotion/styled';

/* eslint-disable-next-line */
export interface UiLegacyProps {}

const StyledUiLegacy = styled.div`
    color: pink;
`;

export function UiLegacy(props: UiLegacyProps) {
    return (
        <StyledUiLegacy>
            <h1>Welcome to UiLegacy!</h1>
        </StyledUiLegacy>
    );
}

export default UiLegacy;
