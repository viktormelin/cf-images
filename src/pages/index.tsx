import Head from 'next/head';
import { Box } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useState } from 'react';
import Header from '@/components/Landing/Header';
import UploadModal from '@/components/Modals/UploadModal/UploadModal';
import ImageComp from '@/components/Landing/ImageComp';
import Navbar from '@/components/Navbar/Navbar';

export default function Home() {
	const desktop = useMediaQuery('(min-width:900px)');

	const [isOpen, setIsOpen] = useState(false);

	const toggleUploadModal = () => {
		setIsOpen(true);
	};

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
							display: 'grid',
							gridTemplateColumns: 'repeat(2, 1fr)',
							gap: '6rem',
							height: '100%',
							width: '100%',
						}}
					>
						<ImageComp />
						<Header setIsOpen={setIsOpen} />
					</Box>

					<UploadModal isOpen={isOpen} setIsOpen={setIsOpen} />
					<Box component='footer'></Box>
				</Box>
			</Box>
		</>
	);
}
