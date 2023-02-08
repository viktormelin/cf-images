import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '../../../lib/prisma';

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
			const verifiedRoleId = '1064965680669135109';
			let retVal: boolean | string = '/';

			const dbUser = await prisma.user.findUnique({
				where: {
					id: user.id,
				},
			});

			if (dbUser) {
				if (account && account.access_token) {
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

					await fetch(`https://discord.com/api/users/@me/guilds/${process.env.DISCORD_GUILD_ID}/member`, {
						method: 'GET',
						headers: {
							Authorization: `Bearer ${account.access_token}`,
						},
					}).then((res) =>
						res.json().then((data: { roles: string[] }) => {
							if (data) {
								if (data.roles.includes(verifiedRoleId)) {
									user.roles = data.roles;
									retVal = true;
								}
							}
						})
					);
				}
			}

			return retVal;
		},
		// async jwt({ token, account, profile }) {
		// 	if (account) {
		// 		token.accessToken = account.access_token;
		// 	}

		// 	return token;
		// },
		async session({ session, user }) {
			const account = await prisma.account.findFirst({
				where: {
					userId: user.id,
				},
			});

			if (account && account.access_token) {
				await fetch(`https://discord.com/api/users/@me/guilds/${process.env.DISCORD_GUILD_ID}/member`, {
					method: 'GET',
					headers: {
						Authorization: `Bearer ${account.access_token}`,
					},
				}).then((res) =>
					res.json().then((data: { roles: string[] }) => {
						if (data) {
							session.user.roles = data.roles;
						}
					})
				);
			}

			return session;
		},
	},
});
