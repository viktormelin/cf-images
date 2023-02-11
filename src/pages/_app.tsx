import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import type { DehydratedState } from 'react-query';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { NotificationsProvider } from '@mantine/notifications';
import theme from '@/themes/theme';
import type { Session } from 'next-auth';
import { useState } from 'react';

export default function App({ Component, pageProps: { session, dehydratedState, ...pageProps } }: AppProps) {
	const [queryClient] = useState(() => new QueryClient());
	return (
		<QueryClientProvider client={queryClient}>
			<Hydrate state={dehydratedState as DehydratedState}>
				<MantineProvider theme={theme}>
					<ModalsProvider>
						<NotificationsProvider>
							<SessionProvider session={session as Session}>
								<Component {...pageProps} />
							</SessionProvider>
						</NotificationsProvider>
					</ModalsProvider>
				</MantineProvider>
			</Hydrate>
		</QueryClientProvider>
	);
}
