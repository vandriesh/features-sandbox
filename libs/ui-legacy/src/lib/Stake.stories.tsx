import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { Stake } from './Stake';

const Story: ComponentMeta<typeof Stake> = {
    component: Stake,
    title: 'Legacy Design System/Freebet/Stake',
};
export default Story;

const Template: ComponentStory<typeof Stake> = (args) => <Stake {...args} />;

export const Default = Template.bind({});
Default.args = {
    defaultValue: '5000',
};
