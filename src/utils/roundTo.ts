const roundTo = (num: number): number => {
	return Math.round((num + Number.EPSILON) * 100) / 100;
};

export default roundTo;
