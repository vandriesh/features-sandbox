import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { Checkbox } from './Checkbox';

const Story: ComponentMeta<typeof Checkbox> = {
    component: Checkbox,
    title: 'Legacy Design System/Freebet/Checkbox',
};
export default Story;

const Template: ComponentStory<typeof Checkbox> = (args) => <Checkbox {...args} />;

export const Default = Template.bind({

});
Default.args = {
    children: 'a label',
};

export const Checked = Template.bind({});
Checked.args = {
    ...Default.args,
    defaultChecked: true
};
