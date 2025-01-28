export function getProgressColor(progress: number): string {
	if (progress >= 100) return 'bg-blue-600'; // Completed
	if (progress >= 75) return 'bg-green-500'; // Near completion
	if (progress >= 50) return 'bg-yellow-400'; // Good progress
	if (progress >= 25) return 'bg-orange-400'; // Moderate progress
	return 'bg-red-500'; // Low progress
}
