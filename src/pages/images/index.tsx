import Head from 'next/head';
import { Box, Text, ActionIcon } from '@mantine/core';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import UploadModal from '@/components/Modals/UploadModal/UploadModal';
import Navbar from '@/components/Navbar/Navbar';
import { useRouter } from 'next/router';
import { QueryClient, dehydrate, useMutation, useQuery, useQueryClient } from 'react-query';
import type { Images } from '@prisma/client';
import generateURL from '@/utils/generateURL';
import Icon from '@/components/Icon';
import Image from 'next/image';
import imageLoader from '@/utils/imageLoader';
import { openConfirmModal } from '@mantine/modals';

export default function Images() {
	const router = useRouter();
	const queryClient = useQueryClient();

	const { data: session, status } = useSession();
	const [isOpen, setIsOpen] = useState(false);

	if (status === 'unauthenticated') {
		void router.push('/');
	}

	const toggleUploadModal = () => {
		setIsOpen(true);
	};

	const getImages = async () => {
		const response = await fetch(`/api/images/get`, {
			method: 'GET',
		});

		if (response.status === 200) {
			return (await response.json()) as Images[];
		} else {
			console.error(response.status, response.statusText);
			return [];
		}
	};

	const deleteImage = async (image: Images) => {
		return await fetch(`/api/images/delete?image=${image.imageId}`, {
			method: 'DELETE',
		});
	};

	const deleteImageHandler = (image: Images) => {
		openConfirmModal({
			title: 'Are you sure you want to delete this image?',
			children: <Text size='sm'>Delete {image.imageName}?</Text>,
			labels: { confirm: 'Delete', cancel: 'Cancel' },
			onConfirm: () => {
				mutation.mutate(image);
			},
		});
	};

	const { isLoading, isError, data, error } = useQuery('images', getImages);
	const mutation = useMutation(deleteImage, {
		onSuccess: () => queryClient.invalidateQueries('images'),
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
						{!isLoading && (data?.length === 0 || !data) ? <Text>No images found</Text> : null}
						{!isLoading && data ? (
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'column',
									gap: '1rem',
									width: '100%',
								}}
							>
								{data.map((image) => (
									<Box
										key={image.imageId}
										sx={(theme) => ({
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'center',
											padding: '1rem',
											backgroundColor: theme.colors.dark[5],
											borderRadius: '0.25rem',
										})}
									>
										<Box
											sx={{
												display: 'flex',
												gap: '1rem',
												alignItems: 'center',
											}}
										>
											<Image
												style={{ borderRadius: '0.25rem' }}
												loader={imageLoader}
												src={image.imageId}
												alt=''
												width={50}
												height={50}
											/>
											<Box
												sx={{
													display: 'flex',
													flexDirection: 'column',
												}}
											>
												<Text component='a' target='_blank' href={generateURL(image.imageId)}>
													{image.imageName}
												</Text>
												<Text size='sm' color='dimmed'>
													{image.imageSize} MB
												</Text>
											</Box>
										</Box>
										<Box>
											<ActionIcon color='red' variant='light' size='lg' onClick={() => deleteImageHandler(image)}>
												<Icon icon='trash' />
											</ActionIcon>
										</Box>
									</Box>
								))}
							</Box>
						) : null}
					</Box>

					<UploadModal isOpen={isOpen} setIsOpen={setIsOpen} />
					<Box component='footer'></Box>
				</Box>
			</Box>
		</>
	);
}
