import { Box, Image as Img } from '@mantine/core';
import image3d from '@/assets/images/picture-dynamic-premium.png';

const ImageComp = () => {
	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				flexDirection: 'column',
			}}
		>
			<Img src={image3d.src} alt='3d image' width={300} height={300} />
		</Box>
	);
};

export default ImageComp;
