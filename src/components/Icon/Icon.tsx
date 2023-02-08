import { Text } from '@mantine/core';

const Icon = ({ icon, size, color }: { icon: string; size?: string; color?: string }) => {
	const iconClass = `ti ti-${icon}`;
	const pxSize = size ?? 20;

	return (
		<Text
			sx={{
				fontSize: `${pxSize}px`,
				color: color,
			}}
		>
			<i className={iconClass}></i>
		</Text>
	);
};

export default Icon;
