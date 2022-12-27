export const rootMain = {
    stories: [
        //   "../stories/**/*.stories.mdx",
        //   "../stories/!**/!*.stories.@(js|jsx|ts|tsx)"
        '../libs/**/*.stories.@(tsx|mdx)',
        // '../libs/ui-legacy/src/lib/**/*.stories.mdx',
        // '../libs/ui-legacy/src/lib/**/*.stories.tsx'
    ],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-interactions',
        '@storybook/theming',
    ],
    // framework: '@storybook/react',
    core: {
        builder: '@storybook/builder-vite',
    },
    features: {
        storyStoreV7: true,
    },
};

module.exports = rootMain;