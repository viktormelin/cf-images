import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const sessionToken =
		process.env.NODE_ENV === 'development'
			? req.cookies['next-auth.session-token']
			: req.cookies['__Secure-next-auth.session-token'];

	// Check if authenticated
	if (sessionToken) {
		const session = await prisma.session.findUnique({ where: { sessionToken } });

		if (session) {
			const key = await prisma.aPIKey.create({
				data: {
					userId: session.userId,
				},
			});

			res.status(201).json(key);
		} else {
			res.status(500).send('Failed to find user from session');
		}
	} else {
		res.status(401).end();
	}
};

export default handler;
