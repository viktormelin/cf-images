import Head from 'next/head';
import { Box, Text, Button, ActionIcon, Divider } from '@mantine/core';
import { Fragment, useState } from 'react';
import UploadModal from '@/components/Modals/UploadModal/UploadModal';
import Navbar from '@/components/Navbar/Navbar';
import type { Images, APIKey, User } from '@prisma/client';
import prisma from '@/lib/prisma';
import type { GetServerSideProps } from 'next';
import Header from '@/components/Profile/Header';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import Icon from '@/components/Icon';

interface LocalResponse {
	images: Images[];
	keys: APIKey[];
	remaining: {
		remainingSize: number;
		remainingImages: number;
	};
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const sessionToken = context.req.cookies['next-auth.session-token'];

	if (!sessionToken) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	const session = await prisma.session.findUnique({ where: { sessionToken } });

	if (session) {
		const user = await prisma.user.findUnique({
			where: { id: session.userId },
		});

		if (user) {
			return {
				props: {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					user: JSON.parse(JSON.stringify(user)),
				},
			};
		}
	}

	return {
		props: {},
	};
};

export default function Images({
	user,
}: {
	user: User & {
		images: Images[];
		keys: APIKey[];
	};
}) {
	const [isOpen, setIsOpen] = useState(false);
	const queryClient = useQueryClient();

	const toggleUploadModal = () => {
		setIsOpen(true);
	};

	const createAPIKey = async () => {
		return await fetch(`/api/keys/create`, { method: 'POST' });
	};

	const deleteAPIKey = async (key: APIKey) => {
		return await fetch(`/api/keys/delete?key=${key.id}`, { method: 'DELETE' });
	};

	const getUserData = async () => {
		const response = await fetch(`/api/user`, { method: 'GET' });

		if (response.status === 200) {
			return (await response.json()) as LocalResponse;
		} else {
			return console.error(response.status, response.statusText);
		}
	};

	const { isLoading, isError, data, error } = useQuery(['images', 'keys'], getUserData);
	const createMutation = useMutation(createAPIKey, {
		onSuccess: () => queryClient.invalidateQueries(['images', 'keys']),
	});
	const deleteMutation = useMutation(deleteAPIKey, {
		onSuccess: () => queryClient.invalidateQueries(['images', 'keys']),
	});

	return (
		<>
			<Head>
				<title>Dixxel Images - Upload images and easily share them</title>
				<meta charSet='UTF-8' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<meta name='description' content='A service where you can easily upload, share and manage images.' />
				{/* <link rel='icon' href='/favicon.ico' /> */}
				<link rel='icon' type='image/png' href='/cf-wrapper-logo-transparent.png' />

				<meta property='og:url' content='https://images.dixxel.io/' />
				<meta property='og:type' content='website' />
				<meta property='og:title' content='Dixxel Images - Upload images and easily share them' />
				<meta property='og:description' content='A service where you can easily upload, share and manage images.' />

				<meta name='twitter:card' content='summary_large_image' />
				<meta property='twitter:domain' content='images.dixxel.io' />
				<meta property='twitter:url' content='https://images.dixxel.io/' />
				<meta name='twitter:title' content='Dixxel Images - Upload images and easily share them' />
				<meta name='twitter:description' content='A service where you can easily upload, share and manage images.' />
			</Head>
			<Box
				sx={{
					height: '100vh',
					width: '100%',
					backgroundImage: 'linear-gradient(to bottom, rgb(38, 38, 38, 0.9) 10%, rgb(13, 13, 13))',
				}}
			>
				<Box
					component='main'
					sx={{
						height: '100%',
						margin: '0 auto',
						maxWidth: '1200px',
						display: 'flex',
						flexDirection: 'column',
						position: 'relative',
					}}
				>
					<Navbar toggleUploadModal={toggleUploadModal} />
					<Box
						sx={{
							height: '100%',
							width: '100%',
							marginTop: '10rem',
						}}
					>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								gap: '1rem',
								width: '100%',
							}}
						>
							<Header user={user} images={data?.images} remaining={data?.remaining} />
							<Box
								sx={(theme) => ({
									display: 'flex',
									flexDirection: 'column',
									padding: '1rem',
									backgroundColor: theme.colors.dark[5],
									borderRadius: '0.25rem',
								})}
							>
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
									}}
								>
									<Text component='h2'>API Keys</Text>
									<Button
										onClick={() => createMutation.mutate()}
										disabled={data?.keys.length === 1}
										color='green'
										variant='subtle'
									>
										Create API Key
									</Button>
								</Box>
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'column',
										gap: '0.5rem',
										marginTop: '1rem',
									}}
								>
									{data?.keys.map((key) => (
										<Fragment key={key.id}>
											<Divider />
											<Box
												sx={{
													display: 'flex',
													justifyContent: 'space-between',
													alignItems: 'center',
												}}
											>
												<Text>{key.id}</Text>
												<ActionIcon color='red' variant='light' size='lg' onClick={() => deleteMutation.mutate(key)}>
													<Icon icon='trash' />
												</ActionIcon>
											</Box>
										</Fragment>
									))}
								</Box>
							</Box>
						</Box>
					</Box>

					<UploadModal isOpen={isOpen} setIsOpen={setIsOpen} />
					<Box component='footer'></Box>
				</Box>
			</Box>
		</>
	);
}
