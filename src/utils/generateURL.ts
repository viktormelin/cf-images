const generateURL = (imageId: string) => {
	const updatedURL = `${process.env.NEXT_PUBLIC_CLOUDFLARE_DOMAIN}/${imageId}/public`;

	return updatedURL;
};

export default generateURL;
