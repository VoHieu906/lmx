<script lang="ts">
	import ClientOnlyApexChart from '$lib/components/ClientOnlyApexChart.svelte';

	const lineChartOptions = {
		chart: {
			type: 'line',
			height: 350
		},
		series: [
			{
				name: 'Learning Time (hours)',
				data: [15, 25, 35, 50, 60, 70]
			}
		],
		xaxis: {
			categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
		},
		title: {
			text: 'Learning Time Over 6 Months',
			align: 'center'
		},
		colors: ['#FF5733']
	};

	const pieChartOptions = {
		chart: {
			type: 'pie',
			height: 350
		},
		series: [40, 25, 15, 20],
		labels: ['Math', 'Science', 'History', 'Art'],
		title: {
			text: 'Course Time Distribution',
			align: 'center'
		},
		colors: ['#FF5733', '#33FF57', '#3357FF', '#FF33A1']
	};

	const columnChartOptions = {
		chart: {
			type: 'bar',
			height: 350
		},
		series: [
			{
				name: 'Completed Courses',
				data: [200, 150, 180, 120]
			}
		],
		xaxis: {
			categories: ['Math', 'Science', 'History', 'Art']
		},
		title: {
			text: 'Course Completion by Students',
			align: 'center'
		},
		colors: ['#33A1FF']
	};
</script>

<div class="space-y-8 p-6">
	<section>
		<h2 class="mb-4 text-center text-2xl font-semibold">Learning Time Over 6 Months</h2>
		<ClientOnlyApexChart options={lineChartOptions} />
	</section>

	<section>
		<h2 class="mb-4 text-center text-2xl font-semibold">Course Time Distribution</h2>
		<ClientOnlyApexChart options={pieChartOptions} />
	</section>

	<section>
		<h2 class="mb-4 text-center text-2xl font-semibold">Course Completion by Students</h2>
		<ClientOnlyApexChart options={columnChartOptions} />
	</section>
</div>
