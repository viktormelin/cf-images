import { Box, Button, Text } from '@mantine/core';
import { signIn, useSession } from 'next-auth/react';

const Header: React.FC<{ setIsOpen: (state: boolean) => void }> = ({ setIsOpen }) => {
	const { data: session } = useSession();
	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'flex-start',
				justifyContent: 'center',
				flexDirection: 'column',
			}}
		>
			<Text component='h1' sx={{ fontSize: '1.5rem' }}>
				Upload images and easily share them
			</Text>
			{!session ? (
				<Text component='p' inline>
					<Text
						inline
						component='a'
						sx={(theme) => ({
							color: theme.colors.blue[5],
							cursor: 'pointer',
						})}
						onClick={() => signIn('discord')}
					>
						Continue with Discord
					</Text>{' '}
					to get access to the uploader
				</Text>
			) : null}
			<Box>
				<Button mt={20} disabled={!session} onClick={() => setIsOpen(true)}>
					Upload Images
				</Button>
			</Box>
		</Box>
	);
};

export default Header;
