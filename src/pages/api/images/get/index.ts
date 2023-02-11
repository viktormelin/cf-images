import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { token, image } = req.query;

	const sessionToken = req.cookies['next-auth.session-token'];

	// Check if authenticated
	if (token || sessionToken) {
		// Fetch specific image using auth token
		if (token && image) {
			// Fetch everything from user
		} else if (sessionToken) {
			const user = await prisma.session.findUnique({ where: { sessionToken } });

			if (user) {
				const images = await prisma.images.findMany({ where: { userId: user.userId } });

				res.status(200).json(images);
			} else {
				res.status(500).send('Failed to find user from session');
			}
		} else {
			res.status(401).end();
		}
	} else {
		res.status(401).end();
	}
};

export default handler;
