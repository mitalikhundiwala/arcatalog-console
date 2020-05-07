import { Global, css } from '@emotion/core';
import { withTheme } from 'emotion-theming';

const GlobalStyles = withTheme(({ theme }) => (
    <Global
        styles={css`
            html,
            body {
                background-color: ${theme.colors.gray[50]};
            }
        `}
    ></Global>
));

export default GlobalStyles;
