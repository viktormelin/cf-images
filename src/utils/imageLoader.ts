const imageLoader = ({ src, width }: { src: string; width: number }) => {
	return `${process.env.NEXT_PUBLIC_CLOUDFLARE_DOMAIN}/${src}/width=${width}`;
};

export default imageLoader;
