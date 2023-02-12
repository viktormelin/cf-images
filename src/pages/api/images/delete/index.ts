import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { image } = req.query;

	const sessionToken =
		process.env.NODE_ENV === 'development'
			? req.cookies['next-auth.session-token']
			: req.cookies['_Secure-next-auth.session-token'];

	// Check if authenticated
	if (image && sessionToken) {
		const user = await prisma.session.findUnique({ where: { sessionToken } });

		if (user) {
			const deletedImage = await prisma.images.deleteMany({
				where: {
					userId: user.userId,
					imageId: image as string,
				},
			});

			if (deletedImage) {
				res.status(204).end();
			} else {
				res.status(500).end();
			}
		} else {
			res.status(500).send('Failed to find user from session');
		}
	} else {
		res.status(401).end();
	}
};

export default handler;
