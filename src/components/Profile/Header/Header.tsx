import { Box, Text, Progress, Skeleton } from '@mantine/core';
import { groups } from '@/utils/canUpload';
import type { Images, User } from '@prisma/client';

const Header = ({
	user,
	images,
	remaining,
}: {
	user: User;
	images: Images[] | undefined | void;
	remaining:
		| {
				remainingSize: number;
				remainingImages: number;
		  }
		| undefined
		| void;
}) => {
	return (
		<Box
			sx={(theme) => ({
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				padding: '1rem',
				backgroundColor: theme.colors.dark[5],
				borderRadius: '0.25rem',
			})}
		>
			<Box
				sx={{
					display: 'flex',
					gap: '1.5rem',
				}}
			>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					<Text color='dimmed' size='sm'>
						Username
					</Text>
					<Text component='h2'>{user.name}</Text>
				</Box>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					<Text color='dimmed' size='sm'>
						Email
					</Text>
					<Text component='h2'>{user.email}</Text>
				</Box>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					<Text color='dimmed' size='sm'>
						Current Plan
					</Text>
					<Text component='h2'>{user.group.toLocaleUpperCase()}</Text>
				</Box>
			</Box>

			<Box
				sx={{
					display: 'flex',
					gap: '1.5rem',
				}}
			>
				<Box
					sx={{
						width: '10rem',
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					<Text mb={5}>Storage</Text>
					{remaining ? (
						<>
							<Progress value={100 * remaining.remainingSize} />
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'space-between',
								}}
							>
								<Text color='dimmed' size='sm'>
									{user.bandwidth}MB
								</Text>
								<Text color='dimmed' size='sm'>
									{groups[user.group].maxSize}MB
								</Text>
							</Box>
						</>
					) : (
						<>
							<Skeleton height={8} />
							<Skeleton height={8} mt={6} />
						</>
					)}
				</Box>
				<Box
					sx={{
						width: '10rem',
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					<Text mb={5}>Images</Text>
					{remaining && images ? (
						<>
							<Progress value={100 * remaining.remainingImages} />
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'space-between',
								}}
							>
								<Text color='dimmed' size='sm'>
									{images.length + 1}
								</Text>
								<Text color='dimmed' size='sm'>
									{groups[user.group].maxImages}
								</Text>
							</Box>
						</>
					) : (
						<>
							<Skeleton height={8} />
							<Skeleton height={8} mt={6} />
						</>
					)}
				</Box>
			</Box>
		</Box>
	);
};

export default Header;
