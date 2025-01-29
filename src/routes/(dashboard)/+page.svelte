<script lang="ts">
	import Banner from '$lib/components/Banner.svelte';
	import CourseCard from '$lib/components/CourseCard.svelte';

	export let data;
	let { course, highestRatedCourse, lowestRatedCourse } = data;
	console.log(highestRatedCourse);
	let enrolledCourses = [
		{
			id: 1,
			title: 'Mathematics 101',
			description: 'Basic concepts of algebra, geometry, and calculus.',
			progress: 80,
			image: ''
		},
		{
			id: 2,
			title: 'Biology',
			description: 'Introduction to cell structure and human anatomy.',
			progress: 50,
			image: ''
		},
		{
			id: 3,
			title: 'Physics',
			description: 'Understanding motion, energy, and forces.',
			progress: 30,
			image: ''
		}
	];

	let paidCourses = [
		{
			id: '4',
			title: 'Chemistry',
			imageUrl: '',
			price: 29.99,

			category: 'Science',
			chapterLength: 12
		},
		{
			id: '5',
			title: 'History 101',
			imageUrl: '',
			price: 19.99,

			category: 'Social Studies',
			chapterLength: 8
		}
	];

	let freeCourses = [
		{
			id: '6',
			title: 'Introduction to Programming',
			imageUrl: '',
			price: 0,

			category: 'Computer Science',
			chapterLength: 15
		},
		{
			id: '7',
			title: 'Art Basics',
			imageUrl: '',
			price: 0,

			category: 'Art & Design',
			chapterLength: 10
		}
	];
</script>

<div>
	<main class="space-y-6">
		<Banner />

		<section class="rounded-2xl bg-white p-6 shadow">
			<h1 class="text-2xl font-bold">Welcome back, {data.user?.email}!</h1>
			<p class="text-gray-600">You're making great progress. Keep it up!</p>
		</section>

		<section class="rounded-2xl bg-white p-6 shadow">
			<h2 class="mb-4 text-xl font-bold">Your Enrolled Courses</h2>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{#each enrolledCourses as course}
					<div class="course-card overflow-hidden rounded-xl bg-gray-50 shadow hover:shadow-lg">
						<img src={course.image} alt="{course.title} image" class="h-40 w-full object-cover" />
						<div class="p-4">
							<h3 class="text-lg font-semibold">{course.title}</h3>
							<p class="mb-2 text-sm text-gray-600">{course.description}</p>
							<div class="mt-2">
								<p class="text-sm text-gray-500">Progress: {course.progress}%</p>
								<div class="h-2 rounded-full bg-gray-200">
									<div
										class="h-2 rounded-full bg-blue-500 transition-all"
										style="width: {course.progress}%"
									></div>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</section>

		<section class="rounded-2xl bg-white p-8 shadow">
			<h2 class="mb-6 text-2xl font-bold text-gray-800">🔥 Highest Rated Course</h2>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<!-- Course Image -->
				<div class="relative">
					<img
						src={highestRatedCourse?.imageUrl}
						alt={highestRatedCourse?.title}
						class="h-72 w-full rounded-2xl object-cover shadow-md transition duration-300 hover:scale-105"
					/>
					<span
						class="absolute right-4 top-4 rounded-lg bg-yellow-500 px-3 py-1 text-sm font-semibold text-white shadow-md"
						>⭐ {highestRatedCourse?.averageRating.toFixed(1)}</span
					>
				</div>

				<!-- Course Details -->
				<div class="flex flex-col justify-center space-y-2">
					<h3
						class="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-xl font-extrabold uppercase tracking-wide text-transparent"
					>
						{highestRatedCourse?.title}
					</h3>

					<p
						class="line-clamp-3 max-h-[4.5em] overflow-hidden text-[15px] italic
           leading-relaxed text-gray-700 shadow-sm sm:line-clamp-4 sm:max-h-[6em]"
					>
						"{highestRatedCourse?.description}"
					</p>

					<span
						class="inline-block w-max rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-800 shadow-sm"
					>
						📚 {highestRatedCourse?.expand?.category.name}
					</span>

					<div class="rounded-lg bg-gray-100 p-2 shadow-inner">
						<div class="flex items-center space-x-3 text-gray-700">
							<span class="text-lg">👥</span>
							<p class="text-sm font-medium">
								<strong>{highestRatedCourse?.subscribers}</strong> Students Enrolled
							</p>
						</div>
						<div class="mt-2 flex items-center space-x-3 text-gray-700">
							<span class="text-lg">💰</span>
							<p class="text-sm font-medium">
								Price: <strong>${highestRatedCourse?.price}</strong>
							</p>
						</div>
						<div class="mt-2 flex items-center space-x-3 text-gray-700">
							<span class="text-lg">⭐</span>
							<p class="text-sm font-medium">
								Rating: <strong>{highestRatedCourse?.averageRating.toFixed(1)}</strong> / 5
							</p>
						</div>
					</div>

					<a
						href={`/courses/${highestRatedCourse?.id}`}
						class="mt-4 inline-block w-max rounded-xl bg-blue-600 px-5 py-2 text-white shadow-md transition-all duration-300 hover:bg-blue-700 hover:shadow-lg"
					>
						🚀 Enroll Now
					</a>
				</div>
			</div>
		</section>

		<section class="rounded-2xl bg-white p-6 shadow">
			<h2 class="mb-4 text-xl font-bold">Paid Courses</h2>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{#each paidCourses as course}
					<CourseCard
						id={course.id}
						title={course.title}
						imageUrl={course.imageUrl}
						price={course.price}
						progress={course.progress}
						category={course.category}
						chapterLength={course.chapterLength}
					/>
				{/each}
			</div>
		</section>

		<section class="rounded-2xl bg-white p-6 shadow">
			<h2 class="mb-4 text-xl font-bold">Free Courses</h2>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{#each freeCourses as course}
					<CourseCard
						id={course.id}
						title={course.title}
						imageUrl={course.imageUrl}
						price={course.price}
						progress={course.progress}
						category={course.category}
						chapterLength={course.chapterLength}
					/>
				{/each}
			</div>
		</section>
	</main>
</div>

<style>
	main {
		padding: 1rem;
	}

	.course-card {
		display: flex;
		flex-direction: column;
		height: 100%;
		border-radius: 12px;
	}

	.course-card img {
		border-bottom: 2px solid #e2e8f0;
	}

	.course-card:hover {
		transform: translateY(-2px);
		transition: transform 0.2s ease-in-out;
	}
</style>
