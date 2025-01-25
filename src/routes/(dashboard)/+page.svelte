<script lang="ts">
	import Banner from '$lib/components/Banner.svelte';
	import CourseCard from '$lib/components/CourseCard.svelte';

	export let data;

	let enrolledCourses = [
		{
			id: 1,
			title: 'Mathematics 101',
			description: 'Basic concepts of algebra, geometry, and calculus.',
			progress: 80,
			image: 'https://via.placeholder.com/300x200?text=Mathematics'
		},
		{
			id: 2,
			title: 'Biology',
			description: 'Introduction to cell structure and human anatomy.',
			progress: 50,
			image: 'https://via.placeholder.com/300x200?text=Biology'
		},
		{
			id: 3,
			title: 'Physics',
			description: 'Understanding motion, energy, and forces.',
			progress: 30,
			image: 'https://via.placeholder.com/300x200?text=Physics'
		}
	];

	let paidCourses = [
		{
			id: '4',
			title: 'Chemistry',
			imageUrl: 'https://via.placeholder.com/300x200?text=Chemistry',
			price: 29.99,
			progress: 50,
			category: 'Science',
			chapterLength: 12
		},
		{
			id: '5',
			title: 'History 101',
			imageUrl: 'https://via.placeholder.com/300x200?text=History',
			price: 19.99,
			progress: 20,
			category: 'Social Studies',
			chapterLength: 8
		}
	];

	let freeCourses = [
		{
			id: '6',
			title: 'Introduction to Programming',
			imageUrl: 'https://via.placeholder.com/300x200?text=Programming',
			price: 0,
			progress: 80,
			category: 'Computer Science',
			chapterLength: 15
		},
		{
			id: '7',
			title: 'Art Basics',
			imageUrl: 'https://via.placeholder.com/300x200?text=Art',
			price: 0,
			progress: 100,
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
