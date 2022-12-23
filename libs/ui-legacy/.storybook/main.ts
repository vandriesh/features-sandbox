const rootMain = require('../../../.storybook/main');

module.exports = {
    ...rootMain,
    core: { ...rootMain.core, builder: '@storybook/builder-vite' },
    stories: [...rootMain.stories, '../src/lib/**/*.stories.mdx', '../src/lib/**/*.stories.tsx'],
    addons: [...rootMain.addons, '@nrwl/react/plugins/storybook'],
};
