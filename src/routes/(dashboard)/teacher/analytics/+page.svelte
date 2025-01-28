<script>
	import * as echarts from 'echarts';
	import { Book, Clock, GitPullRequest, Users } from 'lucide-svelte';
	import { onMount } from 'svelte';

	export let data;
	let { course } = data;
	console.log(course);
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
	let totalCourses = course?.length;
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
	<div class="mb-40 grid grid-cols-1 gap-8 px-6 sm:grid-cols-2 lg:grid-cols-4">
		<div class="flex items-center space-x-4 rounded-lg bg-green-100 p-2 shadow-lg">
			<Book class="size-6 text-green-600" />
			<div>
				<p class="text-2xl font-bold">{totalViews}</p>
				<h3 class="text-xl">Total Views</h3>
			</div>
		</div>

		<div class="flex items-center space-x-4 rounded-lg bg-blue-100 p-2 shadow-lg">
			<Users class="size-6 text-blue-600" />
			<div>
				<p class="text-2xl font-bold">{totalSubscribers}</p>
				<h3 class="text-xl">Total Subscribers</h3>
			</div>
		</div>
		<div class="flex items-center space-x-4 rounded-lg bg-red-100 p-2 shadow-lg">
			<GitPullRequest class="size-6 text-red-600" />
			<div>
				<p class="text-2xl font-bold">{totalCourses}</p>
				<h3 class="text-xl">Total Course</h3>
			</div>
		</div>
		<div class="flex items-center space-x-4 rounded-lg bg-yellow-100 p-2 shadow-lg">
			<Clock class="size-6 text-yellow-600" />
			<div>
				<p class="text-2xl font-bold">4.9</p>
				<h3 class="text-xl">Average rating</h3>
			</div>
		</div>
	</div>

	<!-- Charts Grid -->
	<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
		<div class="relative">
			<!-- Dropdown in the top-left corner of the line chart -->
			<div class="absolute left-8 top-0 z-10">
				<select
					id="courseSelect"
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
