import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/lib/prisma';

interface DiscordUser {
	id: string;
	username: string;
	display_name?: string;
	avatar: string;
	avatar_decorations?: string;
	discriminator: string;
	public_flags: number;
}
interface DiscordRes {
	roles: string[];
	user: DiscordUser;
}

export default NextAuth({
	adapter: PrismaAdapter(prisma),
	providers: [
		DiscordProvider({
			clientId: process.env.DISCORD_CLIENT_ID,
			clientSecret: process.env.DISCORD_CLIENT_SECRET,
			token: 'https://discord.com/api/oauth2/token',
			userinfo: 'https://discord.com/api/users/@me',
			authorization: {
				params: {
					scope: 'identify email guilds guilds.members.read',
				},
			},
		}),
	],
	session: {
		maxAge: 86000,
	},
	callbacks: {
		async signIn({ user, account }) {
			const verifiedRoleId = '1034129970383028265';

			if (account) {
				const token = account.access_token;

				if (token) {
					const response = await fetch(
						`https://discord.com/api/users/@me/guilds/${process.env.DISCORD_GUILD_ID}/member`,
						{
							method: 'GET',
							headers: {
								Authorization: `Bearer ${token}`,
							},
						}
					);

					if (response.status === 200) {
						const resBody = (await response.json()) as DiscordRes;

						if (resBody.roles.includes(verifiedRoleId)) {
							const dbUser = await prisma.user.findUnique({
								where: { id: user.id },
							});

							if (dbUser) {
								await prisma.account.update({
									where: {
										provider_providerAccountId: {
											provider: account.provider,
											providerAccountId: account.providerAccountId,
										},
									},
									data: {
										access_token: account.access_token,
										expires_at: account.expires_at,
										id_token: account.id_token,
										refresh_token: account.refresh_token,
										session_state: account.session_state,
										scope: account.scope,
									},
								});
							}

							return true;
						}
					}
				}
			}

			return false;
		},
		// eslint-disable-next-line @typescript-eslint/require-await
		async redirect({ url, baseUrl }) {
			if (url.startsWith('/')) {
				return `${baseUrl}${url}`;
			} else if (new URL(url).origin === baseUrl) {
				return url;
			}

			return baseUrl;
		},
		// async session({ session, user }) {
		// 	const account = await prisma.account.findFirst({
		// 		where: {
		// 			userId: user.id,
		// 		},
		// 	});

		// 	if (account && account.access_token) {
		// 		await fetch(`https://discord.com/api/users/@me/guilds/${process.env.DISCORD_GUILD_ID}/member`, {
		// 			method: 'GET',
		// 			headers: {
		// 				Authorization: `Bearer ${account.access_token}`,
		// 			},
		// 		}).then((res) =>
		// 			res.json().then((data: { roles: string[] }) => {
		// 				if (data) {
		// 					session.user.roles = data.roles;
		// 				}
		// 			})
		// 		);
		// 	}

		// 	return session;
		// },
	},
});
