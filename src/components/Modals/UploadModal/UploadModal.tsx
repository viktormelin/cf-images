import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { Box, Button, Text, Modal, Transition, ActionIcon, Loader } from '@mantine/core';
import Icon from '@/components/Icon';
import roundTo from '@/utils/roundTo';
import { useState } from 'react';
import type { CfResponse, CfResult, imageFile } from '@/types/typings';

const UploadModal: React.FC<{ isOpen: boolean; setIsOpen: (state: boolean) => void }> = ({ isOpen, setIsOpen }) => {
	const [isUploading, setIsUploading] = useState(false);
	const [hasUploaded, setHasUploaded] = useState(false);
	const [images, setImages] = useState<imageFile[]>([]);

	const updateImageState = (image: imageFile, state: string, value: boolean | string) => {
		const tempImages = [...images];
		const tempImage = tempImages.find((item) => item === image);

		if (tempImage) {
			if (state === 'loading') tempImage.loading = value as boolean;
			if (state === 'uploaded') tempImage.uploaded = value as boolean;
			if (state === 'error') tempImage.error = value as string;
			if (state === 'url') tempImage.url = value as string;
		}

		setImages(tempImages);
	};

	const dropImage = (files: File[]) => {
		const tempArr = [];

		for (const file of files) {
			tempArr.push({ file, loading: false, uploaded: false });
		}

		setImages([...images, ...tempArr]);
	};

	const removeFile = (name: string) => {
		setImages(images.filter((image) => image.file.name !== name));
	};

	const uploadFiles = async () => {
		if (images.length > 0 && !hasUploaded) {
			setIsUploading(true);

			for (const image of images) {
				updateImageState(image, 'loading', true);

				const body = new FormData();

				body.append('image', image.file, image.file.name);

				const res = await fetch('/api/images/upload', {
					method: 'POST',
					body,
				});

				const { result }: { result: CfResult } = (await res.json()) as CfResponse;

				if (res.status === 201) {
					updateImageState(image, 'loading', false);
					updateImageState(image, 'uploaded', true);
					updateImageState(image, 'url', result.variants[0]);
				} else {
					updateImageState(image, 'loading', false);
					updateImageState(image, 'error', res.statusText);
				}
			}

			setHasUploaded(true);
			setIsUploading(false);
		}
	};

	const closeModal = () => {
		setImages([]);
		setHasUploaded(false);
		setIsUploading(false);
		setIsOpen(false);
	};

	return (
		<Modal
			styles={(theme) => ({
				modal: {
					color: '#fff',
					backgroundColor: theme.colors.dark[6],
				},
			})}
			centered
			opened={isOpen}
			onClose={closeModal}
			title='Upload Images'
		>
			<Dropzone
				accept={IMAGE_MIME_TYPE}
				maxSize={5242880}
				maxFiles={5}
				color='dark'
				onDrop={dropImage}
				onReject={(files) => console.log(files)}
			>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						flexDirection: 'column',
						gap: '1rem',
						height: '10rem',
					}}
				>
					<Dropzone.Accept>
						<Icon size='36' icon='photo-check' />
					</Dropzone.Accept>
					<Dropzone.Reject>
						<Icon size='36' icon='photo-x' />
					</Dropzone.Reject>
					<Dropzone.Idle>
						<Icon size='36' icon='photo-up' />
					</Dropzone.Idle>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: '0.25rem',
						}}
					>
						<Text size='xl'>Drag images here or click to select files</Text>
						<Text size='xs' inline>
							Attach as many files as you like, each file should not exceed 5MB
						</Text>
					</Box>
				</Box>
			</Dropzone>
			<Transition mounted={images.length > 0} transition='slide-down' duration={400} timingFunction='ease'>
				{(styles) => (
					<Box
						style={styles}
						sx={{
							display: 'flex',
							flexDirection: 'column',
							gap: '1rem',
							marginTop: '1rem',
						}}
					>
						{images.map((image, index) => (
							<Box
								key={index}
								sx={(theme) => ({
									padding: '0.5rem 1rem',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'space-between',
									backgroundColor: theme.colors.dark[5],
									borderRadius: '0.25rem',
								})}
							>
								<Box>
									{image.url ? (
										<Text color='blue' component='a' href={image.url}>
											{image.file.name}
										</Text>
									) : null}
									{!image.url ? <Text>{image.file.name}</Text> : null}
									<Text size='xs'>{roundTo(image.file.size / 1024 / 1024)} MB</Text>
								</Box>
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
									}}
								>
									{image.loading ? <Loader size='sm' /> : null}
									{!image.loading && !image.uploaded ? (
										<ActionIcon onClick={() => removeFile(image.file.name)} variant='light' color='red'>
											<Icon icon='trash' />
										</ActionIcon>
									) : null}
									{!image.loading && image.uploaded ? (
										<ActionIcon variant='light' color='green'>
											<Icon icon='check' />
										</ActionIcon>
									) : null}
								</Box>
							</Box>
						))}
						<Button disabled={isUploading} onClick={uploadFiles}>
							Upload
						</Button>
					</Box>
				)}
			</Transition>
		</Modal>
	);
};

export default UploadModal;
