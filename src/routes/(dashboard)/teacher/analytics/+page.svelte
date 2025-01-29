<script>
	import * as echarts from 'echarts';
	import { Crown, LucideBookA, Users, View } from 'lucide-svelte';
	import { onMount } from 'svelte';

	export let data;
	let { course, highestRatedCourse, lowestRatedCourse } = data;
	console.log(highestRatedCourse, lowestRatedCourse);
	let totalViews = course?.reduce((courseAcc, course) => {
		let chapterViews =
			course.expand?.['chapters(course)']?.reduce(
				(chapterAcc, chapter) => chapterAcc + chapter.views,
				0
			) || 0;
		return courseAcc + chapterViews;
	}, 0);
	let totalSubscribers = course?.reduce((subAcc, sub) => {
		return subAcc + (sub?.subscribers ? sub?.subscribers : 0);
	}, 0);
	let totalCourse = course?.length;
	let lineChart, pieChart;
	let selectedCourse = 'JavaScript'; // Default selected course

	const courseData = {
		JavaScript: [120, 132, 101, 134, 90, 230, 210, 180, 250, 300, 280, 310],
		Python: [220, 182, 191, 234, 290, 330, 310, 280, 290, 310, 400, 390],
		React: [150, 232, 201, 154, 190, 330, 410, 400, 380, 390, 450, 460],
		Backend: [98, 77, 101, 99, 40, 80, 60, 70, 90, 120, 110, 130]
	};

	const updateLineChart = () => {
		if (lineChart) {
			lineChart.setOption({
				series: [
					{
						name: selectedCourse,
						type: 'line',
						data: courseData[selectedCourse]
					}
				]
			});
		}
	};

	onMount(() => {
		if (typeof window !== 'undefined') {
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
					data: [selectedCourse],
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
						name: selectedCourse,
						type: 'line',
						data: courseData[selectedCourse]
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
	<div class="mb-40 grid grid-cols-1 gap-6 px-6 sm:grid-cols-2 lg:grid-cols-4">
		<!-- Total Views Card -->
		<div
			class="group relative overflow-hidden rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
		>
			<div class="flex items-center space-x-4">
				<View class="size-8 text-green-600" />
				<div>
					<p class="text-3xl font-bold text-green-900">{totalViews}</p>
					<h3 class="text-lg font-medium text-green-700">Total Views</h3>
				</div>
			</div>
			<div
				class="absolute -bottom-4 -right-4 opacity-20 transition-opacity duration-300 group-hover:opacity-30"
			>
				<View class="size-24 text-green-600" />
			</div>
		</div>

		<!-- Total Subscribers Card -->
		<div
			class="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
		>
			<div class="flex items-center space-x-4">
				<Users class="size-8 text-blue-600" />
				<div>
					<p class="text-3xl font-bold text-blue-900">{totalSubscribers}</p>
					<h3 class="text-lg font-medium text-blue-700">Total Subscribers</h3>
				</div>
			</div>
			<div
				class="absolute -bottom-4 -right-4 opacity-20 transition-opacity duration-300 group-hover:opacity-30"
			>
				<Users class="size-24 text-blue-600" />
			</div>
		</div>

		<!-- Total Course Card -->
		<div
			class="group relative overflow-hidden rounded-xl bg-gradient-to-br from-red-50 to-red-100 p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
		>
			<div class="flex items-center space-x-4">
				<LucideBookA class="size-8 text-red-600" />
				<div>
					<p class="text-3xl font-bold text-red-900">{totalCourse}</p>
					<h3 class="text-lg font-medium text-red-700">Total Course</h3>
				</div>
			</div>
			<div
				class="absolute -bottom-4 -right-4 opacity-20 transition-opacity duration-300 group-hover:opacity-30"
			>
				<LucideBookA class="size-24 text-red-600" />
			</div>
		</div>

		<!-- Highest Rated Course Card -->
		<div
			class="group relative overflow-hidden rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
		>
			<div class="flex items-center space-x-4">
				<Crown class="size-8 text-yellow-600" />
				<div class="flex-1 overflow-hidden">
					<p class="truncate text-3xl font-bold text-yellow-900">{highestRatedCourse?.title}</p>
					<h3 class="text-lg font-medium text-yellow-700">Highest Rated Course</h3>
				</div>
			</div>
			<div
				class="absolute -bottom-4 -right-4 opacity-20 transition-opacity duration-300 group-hover:opacity-30"
			>
				<Crown class="size-24 text-yellow-600" />
			</div>
		</div>
	</div>

	<!-- Charts Grid -->
	<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
		<div class="relative">
			<!-- Dropdown in the top-left corner of the line chart -->
			<div class="absolute left-8 top-0 z-10">
				<select
					id="courseelect"
					class="rounded-md border-2 border-indigo-500 bg-white px-2 py-1 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
					bind:value={selectedCourse}
					on:change={updateLineChart}
				>
					<option value="JavaScript">JavaScript</option>
					<option value="Python">Python</option>
					<option value="React">React</option>
					<option value="Backend">Backend</option>
				</select>
			</div>
			<div id="lineChart" class="h-[400px] w-full"></div>
		</div>
		<div id="pieChart" class="h-[400px] w-full"></div>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}
</style>
