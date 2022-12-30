import type { StoryFn, Meta } from '@storybook/react';
import { Checkbox } from './Checkbox';

const Story: Meta<typeof Checkbox> = {
    component: Checkbox,
    title: 'ASCII Design System/Freebet/Checkbox',
    argTypes: {
        defaultChecked: {
            options: ['true', 'false'],
            control: { type: 'checkbox' },
        },
    },
};
export default Story;

const Template: StoryFn<typeof Checkbox> = (args) => <Checkbox {...args} />;

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
