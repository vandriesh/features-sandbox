import { addons } from '@storybook/addons';
import legacyTheme from './legacyTheme';

addons.setConfig({ theme: legacyTheme });

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}