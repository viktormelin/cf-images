import { Badge, Box, Button, Text } from '@mantine/core';
import projects from '@/store/projects';
import { useMediaQuery } from '@mantine/hooks';

const Projects = () => {
	const desktop = useMediaQuery('(min-width:900px)');

	return (
		<Box
			sx={{
				display: 'grid',
				gridTemplateColumns: desktop ? 'repeat(2, 1fr)' : '1fr',
				gap: '2rem',
			}}
		>
			{projects &&
				projects.map((item, index) => (
					<Box
						key={index}
						sx={(theme) => ({
							height: '15rem',
							background: item.image ? `url(${item.image})` : theme.colors.dark[8],
							borderRadius: '0.25rem',
							transition: 'all 0.2s ease',
							padding: '1rem',
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'space-between',
							boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
						})}
					>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
							}}
						>
							<Text
								sx={{
									fontWeight: 'bold',
									display: 'flex',
									fontSize: desktop ? '1.25rem' : '1rem',
									gap: '0.5rem',
								}}
							>
								0{index + 1}.{' '}
								<Text
									sx={{
										fontWeight: 'normal',
									}}
								>
									{item.title}
								</Text>
							</Text>
							<Box
								sx={{
									display: 'flex',
									gap: '0.25rem',
								}}
							>
								{item.live ? (
									<Button component='a' size={desktop ? 'md' : 'xs'} href={item.live}>
										Live
									</Button>
								) : null}
								<Button component='a' size={desktop ? 'md' : 'xs'} href={item.repo}>
									Repo
								</Button>
							</Box>
						</Box>
						<Box
							sx={{
								display: 'flex',
								gap: '0.25rem',
								flexWrap: 'wrap',
							}}
						>
							{item.stack.map((stack, index) => (
								<Badge key={index} size={desktop ? 'md' : 'xs'} variant='filled' color='dark'>
									{stack}
								</Badge>
							))}
						</Box>
					</Box>
				))}
		</Box>
	);
};

export default Projects;
