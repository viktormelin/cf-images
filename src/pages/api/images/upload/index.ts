import Cors from 'cors';
import formidable, { File } from 'formidable';
import PersistentFile from 'formidable/PersistentFile';
import { readFileSync, rm, unlinkSync, writeFileSync } from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
// import a from '../../../../../public/temp'

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

const cors = Cors({
	methods: ['POST', 'GET', 'HEAD'],
});

export const config = {
	api: {
		bodyParser: false,
	},
};

const runMiddleware = (req: NextApiRequest, res: NextApiResponse, fn: (...args: any[]) => any) => {
	return new Promise((resolve, reject) => {
		fn(req, res, (result: any) => {
			if (result instanceof Error) {
				return reject(result);
			}

			return resolve(result);
		});
	});
};

const uploadToServer = async (file: File) => {
	const data = readFileSync(file.filepath);

	writeFileSync(`./public/temp/${file.originalFilename}`, data);
	unlinkSync(file.filepath);

	const tempFile = readFileSync(`./public/temp/${file.originalFilename}`);
	const tempBlob = new Blob([tempFile]);
	const body = new FormData();
	// const fileExtension = file.originalFilename?.split('.').pop()
	const fileSize = file.size / 1024 / 1024;

	body.append('file', tempBlob, file.originalFilename as string);

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

	rm(`./public/temp/${file.originalFilename}`, () => {});
	const retVal = response.json();
	return retVal;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	await runMiddleware(req, res, cors);
	const { key } = req.query;

	if (key) {
		// Check for auth
	} else {
		// No token provided, continue as "free user"
		const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			if (err) {
				res.status(400).send(err);
			}

			const response = await uploadToServer(files.image as File);

			console.log(response);

			// if (response.status === 200) {
			if (response.success === true) {
				res.status(201).json(response);
			} else {
				res.status(response.status).send(response.statusText);
			}
		});
	}
};

export default handler;
