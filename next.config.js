/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'cdn.dixxel.io',
				port: '',
				pathname: '/cdn-cgi/imagedelivery/**',
			},
		],
	},
};

module.exports = nextConfig;
