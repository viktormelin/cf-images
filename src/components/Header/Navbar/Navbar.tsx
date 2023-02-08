import { Box, Text, Transition, Burger, Drawer } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useState } from 'react';
import Icon from '@/components/Icon';

const Navbar = () => {
	const desktop = useMediaQuery('(min-width:900px)');
	const [mailHovered, setMailHovered] = useState(false);
	const [open, setOpen] = useState(false);

	return (
		<>
			{!desktop ? (
				<Box component='nav'>
					<Burger
						sx={{
							position: 'fixed',
							zIndex: 99,
							right: '1rem',
							top: '1rem',
						}}
						color='white'
						opened={open}
						onClick={() => setOpen((o) => !o)}
						title='Menu'
					/>
					<Drawer
						withCloseButton={false}
						opened={open}
						onClose={() => setOpen(false)}
						position='right'
						size='full'
						zIndex={10}
						styles={(theme) => ({
							root: {
								height: '100vh',
								width: '100%',
							},
							drawer: {
								backgroundColor: theme.colors.dark[7],
								color: 'white',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							},
							body: {
								height: '100%',
								width: '60%',
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'center',
								gap: '4rem',
							},
						})}
					>
						<Box
							sx={{
								width: '100%',
								display: 'flex',
								flexDirection: 'column',
								gap: '2rem',
								textAlign: 'right',
							}}
						>
							<Text
								sx={(theme) => ({
									transition: 'all 0.2s ease',
									'&:hover': {
										color: theme.colors.blue[5],
									},
								})}
								component='a'
								href='/'
							>
								Home
							</Text>
							<Text
								sx={(theme) => ({
									transition: 'all 0.2s ease',
									'&:hover': {
										color: theme.colors.blue[5],
									},
								})}
								component='a'
								href='/about'
							>
								About Me
							</Text>
							<Text
								sx={(theme) => ({
									transition: 'all 0.2s ease',
									'&:hover': {
										color: theme.colors.blue[5],
									},
								})}
								component='a'
								href='https://www.linkedin.com/in/viktormelin'
							>
								My CV
							</Text>
						</Box>
						<Box
							sx={{
								width: '100%',
								textAlign: 'right',
							}}
						>
							<Text
								sx={(theme) => ({
									transition: 'all 0.2s ease',
									'&:hover': {
										color: theme.colors.blue[5],
									},
								})}
								component='a'
								href='mailto:hello@viktormelin.com'
							>
								hello@viktormelin.com
							</Text>
						</Box>
					</Drawer>
				</Box>
			) : null}
			{desktop ? (
				<Box
					component='nav'
					sx={{
						display: 'grid',
						gridTemplateColumns: '1fr 1fr',
						padding: '2rem 0',
						fontSize: '1.1rem',
					}}
				>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
						}}
					>
						<Text
							sx={(theme) => ({
								transition: 'all 0.2s ease',
								'&:hover': {
									color: theme.colors.blue[5],
								},
							})}
							component='a'
							href='/'
						>
							Home
						</Text>
						<Text
							sx={(theme) => ({
								transition: 'all 0.2s ease',
								'&:hover': {
									color: theme.colors.blue[5],
								},
							})}
							component='a'
							href='/about'
						>
							About Me
						</Text>
						<Text
							sx={(theme) => ({
								transition: 'all 0.2s ease',
								'&:hover': {
									color: theme.colors.blue[5],
								},
							})}
							component='a'
							href='https://www.linkedin.com/in/viktormelin'
						>
							My CV
						</Text>
					</Box>
					<Text
						sx={(theme) => ({
							display: 'flex',
							justifySelf: 'flex-end',
							gap: '0.5rem',
							textAlign: 'right',
							transition: 'all 0.2s ease',
							'&:hover': {
								color: theme.colors.blue[5],
							},
						})}
						component='a'
						href='mailto:hello@viktormelin.com'
						onMouseEnter={() => setMailHovered(true)}
						onMouseLeave={() => setMailHovered(false)}
					>
						<Transition mounted={mailHovered} transition='slide-right' duration={400} timingFunction='ease'>
							{(styles) => (
								<Text style={styles}>
									<Icon icon='mail-fast' />
								</Text>
							)}
						</Transition>
						hello@viktormelin.com
					</Text>
				</Box>
			) : null}
		</>
	);
};

export default Navbar;
