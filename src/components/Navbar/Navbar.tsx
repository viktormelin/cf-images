import { Box, Burger, useMantineTheme, Transition, Button } from '@mantine/core';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

const Navbar: React.FC<{ toggleUploadModal: () => void }> = ({ toggleUploadModal }) => {
	const theme = useMantineTheme();
	const { data: session, status } = useSession();

	const [navOpen, setNavOpen] = useState(false);

	return (
		<Transition mounted={status === 'authenticated'} transition='fade' duration={400} timingFunction='ease'>
			{(styles) => (
				<Box
					style={styles}
					component='nav'
					sx={{
						position: 'absolute',
						display: 'flex',
						alignItems: 'center',
						padding: '1rem 0',
					}}
				>
					<Burger
						opened={navOpen}
						onClick={() => setNavOpen((o) => !o)}
						styles={{
							root: {
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								backgroundColor: theme.colors.blue[5],
								width: '4rem',
								height: '4rem',
								borderRadius: '100%',
								marginRight: '2rem',
							},
						}}
					/>

					<Transition mounted={navOpen} transition='scale-x' duration={400} timingFunction='ease'>
						{(styles) => (
							<Box
								style={styles}
								sx={{
									display: 'flex',
									alignItems: 'center',
									gap: '1rem',
								}}
							>
								<Button variant='subtle' onClick={toggleUploadModal}>
									Upload
								</Button>
								<Button variant='subtle' component='a' href='/images'>
									My Images
								</Button>
								<Button variant='subtle' component='a' href='/profile'>
									Profile
								</Button>
								<Button variant='subtle' onClick={() => signOut()}>
									Logout
								</Button>
							</Box>
						)}
					</Transition>
				</Box>
			)}
		</Transition>
	);
};

export default Navbar;
