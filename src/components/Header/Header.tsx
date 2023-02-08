import { Box, Text } from '@mantine/core';
import Navbar from './Navbar';
import { useMediaQuery } from '@mantine/hooks';

const Header = () => {
	const desktop = useMediaQuery('(min-width:900px)');

	return (
		<Box
			component='header'
			sx={{
				height: desktop ? '40%' : '80vh',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: desktop ? 'space-between' : 'center',
			}}
		>
			<Navbar />
			<Box
				component='section'
				sx={{
					fontSize: '1.1rem',
				}}
			>
				<Text
					component='h1'
					sx={{
						fontFamily: 'Source Serif Pro, serif',
						fontSize: '2.5rem',
						fontWeight: 'bold',
						marginBottom: '1rem',
					}}
				>
					Hello.
				</Text>
				<Text>I&apos;m Viktor, a frontend developer in the making, currently studying at Medieinstitutet.</Text>
				<Text>
					Connect with me on{' '}
					<Text
						sx={(theme) => ({
							color: theme.colors.blue[5],
						})}
						component='a'
						href='https://www.linkedin.com/in/viktormelin'
					>
						LinkedIn
					</Text>{' '}
					or see some of my previous work on{' '}
					<Text
						sx={(theme) => ({
							color: theme.colors.blue[5],
						})}
						component='a'
						href='https://github.com/viktormelin'
					>
						GitHub
					</Text>
					.
				</Text>
			</Box>
		</Box>
	);
};

export default Header;
