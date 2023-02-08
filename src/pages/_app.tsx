import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { NotificationsProvider } from '@mantine/notifications';
import theme from '@/themes/theme';
import type { Session } from 'next-auth';

const queryClient = new QueryClient();

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	return (
		<QueryClientProvider client={queryClient}>
			<MantineProvider theme={theme}>
				<ModalsProvider>
					<NotificationsProvider>
						<SessionProvider session={session as Session}>
							<Component {...pageProps} />
						</SessionProvider>
					</NotificationsProvider>
				</ModalsProvider>
			</MantineProvider>
		</QueryClientProvider>
	);
}
