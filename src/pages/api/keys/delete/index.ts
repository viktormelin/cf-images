import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { key } = req.query;
	const sessionToken = req.cookies['next-auth.session-token'];

	// Check if authenticated
	if (key && sessionToken) {
		const session = await prisma.session.findUnique({ where: { sessionToken } });

		if (session) {
			const deletedKey = await prisma.aPIKey.deleteMany({
				where: {
					id: key as string,
					userId: session.userId,
				},
			});

			if (deletedKey) {
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
