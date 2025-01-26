<script>
	import * as echarts from 'echarts';
	import { Book, Clock, GitPullRequest, Users } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let lineChart, barChart, pieChart;

	onMount(() => {
		if (typeof window !== 'undefined') {
			// Line chart
			const lineChartDom = document.getElementById('lineChart');
			lineChart = echarts.init(lineChartDom);
			lineChart.setOption({
				title: {
					text: 'Course Enrollment Over Time',
					left: 'center'
				},
				tooltip: {
					trigger: 'axis'
				},
				legend: {
					data: ['JavaScript', 'Python', 'React', 'Backend'],
					bottom: 0
				},
				xAxis: {
					type: 'category',
					boundaryGap: false,
					data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
				},
				yAxis: {
					type: 'value'
				},
				series: [
					{
						name: 'JavaScript',
						type: 'line',
						data: [120, 132, 101, 134, 90, 230, 210, 180, 250, 300, 280, 310]
					},
					{
						name: 'Python',
						type: 'line',
						data: [220, 182, 191, 234, 290, 330, 310, 280, 290, 310, 400, 390]
					},
					{
						name: 'React',
						type: 'line',
						data: [150, 232, 201, 154, 190, 330, 410, 400, 380, 390, 450, 460]
					},
					{
						name: 'Backend',
						type: 'line',
						data: [98, 77, 101, 99, 40, 80, 60, 70, 90, 120, 110, 130]
					}
				]
			});

			// Bar chart
			const barChartDom = document.getElementById('barChart');
			barChart = echarts.init(barChartDom);
			barChart.setOption({
				title: {
					text: 'Course Enrollment Comparison',
					left: 'center'
				},
				tooltip: {
					trigger: 'axis'
				},
				xAxis: {
					type: 'category',
					data: ['JavaScript', 'Python', 'React', 'Backend']
				},
				yAxis: {
					type: 'value'
				},
				series: [
					{
						name: 'Enrollments',
						type: 'bar',
						data: [1050, 1200, 1500, 900]
					}
				]
			});

			// Pie chart
			const pieChartDom = document.getElementById('pieChart');
			pieChart = echarts.init(pieChartDom);
			pieChart.setOption({
				title: {
					text: 'Course Distribution',
					left: 'center'
				},
				tooltip: {
					trigger: 'item'
				},
				series: [
					{
						name: 'Course Distribution',
						type: 'pie',
						radius: '50%',
						data: [
							{ value: 335, name: 'JavaScript' },
							{ value: 310, name: 'Python' },
							{ value: 234, name: 'React' },
							{ value: 135, name: 'Backend' }
						]
					}
				]
			});

			// Resize charts if window size changes
			const resizeCharts = () => {
				lineChart.resize();
				barChart.resize();
				pieChart.resize();
			};

			window.addEventListener('resize', resizeCharts);

			return () => {
				window.removeEventListener('resize', resizeCharts);
			};
		}
	});
</script>

<div class="container mx-auto px-4 py-8">
	<!-- Info Boxes above the charts -->
	<div class="mb-40 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
		<div class="flex items-center space-x-4 rounded-lg bg-green-100 p-4 shadow-lg">
			<Book class="size-6 text-green-600" />
			<div>
				<p class="text-2xl font-bold">5000</p>
				<h3 class="text-xl">ToTal Views</h3>
			</div>
		</div>
		<div class="flex items-center space-x-4 rounded-lg bg-red-100 p-4 shadow-lg">
			<GitPullRequest class="size-6 text-red-600" />
			<div>
				<p class="text-2xl font-bold">75</p>
				<h3 class="text-xl">Total Chapters</h3>
			</div>
		</div>
		<div class="flex items-center space-x-4 rounded-lg bg-blue-100 p-4 shadow-lg">
			<Users class="size-6 text-blue-600" />
			<div>
				<p class="text-2xl font-bold">1,500</p>
				<h3 class="text-xl">Number of Students</h3>
			</div>
		</div>
		<div class="flex items-center space-x-4 rounded-lg bg-yellow-100 p-4 shadow-lg">
			<Clock class="size-6 text-yellow-600" />
			<div>
				<p class="text-2xl font-bold">12,000</p>
				<h3 class="text-xl">Total Study Hours</h3>
			</div>
		</div>
	</div>

	<!-- Charts Grid -->
	<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
		<div id="barChart" class="h-[400px] w-full"></div>
		<div id="pieChart" class="h-[400px] w-full"></div>
		<div id="lineChart" class="h-[400px] w-full md:col-span-2"></div>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}
</style>
