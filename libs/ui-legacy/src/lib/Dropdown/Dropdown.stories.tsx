import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { Dropdown } from './Dropdown';
import times from 'lodash/times';

const Story: ComponentMeta<typeof Dropdown> = {
    component: Dropdown,
    title: 'Legacy Design System/Freebet/Dropdown',
};
export default Story;

const Template: ComponentStory<typeof Dropdown> = (args) => (
    <Dropdown {...args}>
        {times(3, (id) => (
            <option key={id} value={id}>
                option {id}
            </option>
        ))}
    </Dropdown>
);

export const Default = Template.bind({});
Default.args = {};
