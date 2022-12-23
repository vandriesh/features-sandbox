interface OwnProps extends Partial<Pick<HTMLInputElement, 'defaultValue' | 'name'>> {}

export function Stake(props: OwnProps): JSX.Element {
    return <input {...props} style={{ width: '50px', backgroundColor: 'darkorange', color: 'darkgrey' }} readOnly />;
}
