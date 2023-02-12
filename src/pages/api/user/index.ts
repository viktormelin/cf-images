import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { getRemaining } from '@/utils/canUpload';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const sessionToken = req.cookies['next-auth.session-token'];

	// Check if authenticated
	if (sessionToken) {
		const session = await prisma.session.findUnique({ where: { sessionToken } });

		if (session) {
			if (session) {
				const user = await prisma.user.findUnique({
					where: { id: session.userId },
					include: {
						images: true,
						keys: true,
					},
				});

				if (user) {
					res.status(200).json({
						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
						images: user.images,
						keys: user.keys,
						remaining: getRemaining(user),
					});
				}
			}
		} else {
			res.status(500).send('Failed to find user from session');
		}
	} else {
		res.status(401).end();
	}
};

export default handler;
