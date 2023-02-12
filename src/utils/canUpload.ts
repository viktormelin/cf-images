import type { Images, User } from '@prisma/client';
interface group {
	maxSize: number;
	maxImages: number;
}

interface groups {
	[key: string]: group;
}

export const groups: groups = {
	base: { maxSize: 100, maxImages: 50 },
	premium: { maxSize: 1000, maxImages: 250 },
};

export const getRemaining = (user: User & { images: Images[] }) => {
	const remainingSize = user.bandwidth / groups[user.group].maxSize;
	const remainingImages = user.images.length / groups[user.group].maxImages;

	return { remainingSize, remainingImages };
};

const canUpload = (
	user: User & {
		images: Images[];
	},
	size: number
) => {
	if (user.bandwidth + size <= groups[user.group].maxSize && user.images.length + 1 <= groups[user.group].maxImages) {
		return true;
	}

	return false;
};

export default canUpload;
