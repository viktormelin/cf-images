import type { CfResponse } from '@/types/typings';
import roundTo from '@/utils/roundTo';
import Cors from 'cors';
import type { File } from 'formidable';
import formidable from 'formidable';
import { readFileSync, rmSync, unlinkSync, writeFileSync } from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

const cors = Cors({
	methods: ['POST', 'GET', 'HEAD'],
});

export const config = {
	api: {
		bodyParser: false,
	},
};

const runMiddleware = (req: NextApiRequest, res: NextApiResponse, fn: Function) => {
	return new Promise((resolve, reject) => {
		fn(req, res, (result: unknown) => {
			if (result instanceof Error) {
				return reject(result);
			}

			return resolve(result);
		});
	});
};

const uploadToServer = async (file: File) => {
	const data = readFileSync(file.filepath);

	if (file && file.originalFilename) {
		writeFileSync(`./public/temp/${file.originalFilename}`, data);
		unlinkSync(file.filepath);

		const tempFile = readFileSync(`./public/temp/${file.originalFilename}`);
		const tempBlob = new Blob([tempFile]);
		const body = new FormData();
		// const fileExtension = file.originalFilename?.split('.').pop()
		// const fileSize = file.size / 1024 / 1024;

		body.append('file', tempBlob, file.originalFilename);

		const response = await fetch(
			`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT}/images/v1`,
			{
				credentials: 'include',
				method: 'POST',
				headers: {
					Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
				},
				body,
			}
		);

		const _cb = rmSync(`./public/temp/${file.originalFilename}`);
		const retVal = (await response.json()) as CfResponse;
		return retVal;
	}
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	await runMiddleware(req, res, cors);
	const { key } = req.query;

	const sessionToken = req.cookies['next-auth.session-token'];

	if (key || sessionToken) {
		// Check for auth
		if (sessionToken) {
			// User is logged in
			const user = await prisma.session.findUnique({ where: { sessionToken } });
			if (user) {
				const form = new formidable.IncomingForm();
				form.parse(req, async (err, _fields, files) => {
					if (err) {
						res.status(500).send(err);
					}

					const imageFile = files.image as File;
					const response = await uploadToServer(imageFile);

					if (response) {
						if (response.success === true) {
							const dbImage = await prisma.images.create({
								data: {
									userId: user.userId,
									imageId: response.result.id,
									imageURL: response.result.variants[0],
									imageName: response.result.filename,
									imageSize: roundTo(imageFile.size / 1024 / 1024),
								},
							});

							if (dbImage) {
								res.status(201).json(dbImage);
							} else {
								res.status(500).send('Failed to create image on server');
							}
						} else {
							res.status(500).json(response.errors);
						}
					}

					res.status(500).end();
				});
			} else {
				res.status(500).send('Failed to find user from session');
			}
		}
	} else {
		// No token provided, continue as "free user"
		const form = new formidable.IncomingForm();
		form.parse(req, async (err, _fields, files) => {
			if (err) {
				res.status(400).send(err);
			}

			const response = await uploadToServer(files.image as File);

			if (response) {
				if (response.success === true) {
					res.status(201).json(response);
				} else {
					res.status(500).json(response.errors);
				}
			}

			res.status(500).end();
		});
	}
};

export default handler;
