<script lang="ts">
	// Props
	export let achievements: any[] = [];
	export let courses: any[] = [];

	// Icons from Lucide Svelte
	import {
		Github,
		Linkedin,
		Twitter,
		Facebook,
		Medal,
		BookOpen,
		Briefcase,
		Award
	} from 'lucide-svelte';
</script>

<div class="min-h-screen bg-gray-50 p-4 md:p-8">
	<div class="mx-auto max-w-6xl space-y-8">
		<!-- Profile Header Card -->
		<div class="overflow-hidden rounded-lg bg-white shadow-md">
			<!-- Cover Image -->
			<div class="h-20 bg-gradient-to-r from-blue-500 to-purple-600" />

			<div class="relative space-y-8 px-4 pb-8 pt-0 md:px-8">
				<!-- Avatar & Basic Info -->
				<div class="flex flex-col items-center gap-4 md:flex-row md:gap-8">
					<div class="relative">
						<div class="h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-xl">
							<img
								src="https://github.com/shadcn.png"
								alt="John Doe"
								class="h-full w-full object-cover"
							/>
						</div>
						<div
							class="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-yellow-400 shadow-lg"
						>
							<Medal class="h-4 w-4 text-white" />
						</div>
					</div>

					<div class="text-center md:text-left">
						<h1 class="text-3xl font-bold">John Doe</h1>
						<p class="mt-2 max-w-2xl text-gray-600">
							Passionate software developer with a focus on web technologies and user experience.
							Always learning and building new things.
						</p>
						<div class="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
							<span class="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800"
								>Full Stack Developer</span
							>
							<span class="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
								>Active Learner</span
							>
							<span class="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700"
								>Open Source Contributor</span
							>
						</div>
					</div>

					<!-- Social Links -->
					<div class="flex gap-4 md:ml-auto">
						<a
							href="https://github.com/johndoe"
							class="text-gray-600 transition-colors hover:text-gray-900"
						>
							<Github class="h-6 w-6" />
						</a>
						<a
							href="https://linkedin.com/in/johndoe"
							class="text-gray-600 transition-colors hover:text-blue-600"
						>
							<Linkedin class="h-6 w-6" />
						</a>
						<a
							href="https://twitter.com/johndoe"
							class="text-gray-600 transition-colors hover:text-blue-400"
						>
							<Twitter class="h-6 w-6" />
						</a>
						<a
							href="https://facebook.com/johndoe"
							class="text-gray-600 transition-colors hover:text-blue-700"
						>
							<Facebook class="h-6 w-6" />
						</a>
					</div>
				</div>

				<hr class="border-gray-200" />

				<!-- Stats -->
				<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
					<div class="text-center">
						<div class="text-2xl font-bold">128</div>
						<div class="text-sm text-gray-600">Contributions</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold">12</div>
						<div class="text-sm text-gray-600">Certificates</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold">48</div>
						<div class="text-sm text-gray-600">Projects</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold">2.4k</div>
						<div class="text-sm text-gray-600">Followers</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Main Content Grid -->
		<div class="grid gap-8 md:grid-cols-2">
			<!-- Certifications -->
			<div class="rounded-lg bg-white p-6 shadow-md">
				<div class="mb-4 flex items-center">
					<BookOpen class="mr-2 h-5 w-5 text-blue-500" />
					<h2 class="text-xl font-semibold">Certifications</h2>
				</div>
				<div class="space-y-4">
					<div class="flex items-start gap-4">
						<div class="rounded-lg bg-blue-50 p-2">
							<Award class="h-5 w-5 text-blue-500" />
						</div>
						<div>
							<h3 class="font-medium">AWS Certified Solutions Architect</h3>
							<p class="text-sm text-gray-600">Amazon Web Services • 2023</p>
						</div>
					</div>
					<div class="flex items-start gap-4">
						<div class="rounded-lg bg-green-50 p-2">
							<Award class="h-5 w-5 text-green-500" />
						</div>
						<div>
							<h3 class="font-medium">Professional Web Developer</h3>
							<p class="text-sm text-gray-600">Meta • 2022</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Experience -->
			<div class="rounded-lg bg-white p-6 shadow-md">
				<div class="mb-4 flex items-center">
					<Briefcase class="mr-2 h-5 w-5 text-purple-500" />
					<h2 class="text-xl font-semibold">Experience</h2>
				</div>
				<div class="space-y-4">
					<div class="relative border-l-2 border-gray-200 pl-4">
						<div
							class="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-purple-500 bg-white"
						/>
						<h3 class="font-medium">Senior Software Engineer</h3>
						<p class="text-sm text-gray-600">Tech Corp • 2022 - Present</p>
					</div>
					<div class="relative border-l-2 border-gray-200 pl-4">
						<div
							class="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-purple-500 bg-white"
						/>
						<h3 class="font-medium">Software Developer</h3>
						<p class="text-sm text-gray-600">StartUp Inc • 2020 - 2022</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Achievements -->
		<div class="rounded-lg bg-white p-6 shadow-md">
			<div class="mb-4 flex items-center">
				<Award class="mr-2 h-5 w-5 text-yellow-500" />
				<h2 class="text-xl font-semibold">Achievements</h2>
			</div>
			{#if achievements.length > 0}
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					<!-- Achievement cards would go here -->
				</div>
			{:else}
				<div class="py-8 text-center text-gray-600">
					<Award class="mx-auto mb-4 h-16 w-16 text-gray-300" />
					<p class="text-lg">No achievements shared yet.</p>
				</div>
			{/if}
		</div>

		<!-- Courses -->
		<div class="rounded-lg bg-white p-6 shadow-md">
			<div class="mb-4 flex items-center">
				<BookOpen class="mr-2 h-5 w-5 text-emerald-500" />
				<h2 class="text-xl font-semibold">Enrolled Courses</h2>
			</div>
			{#if courses.length > 0}
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					<!-- Course cards would go here -->
				</div>
			{:else}
				<div class="py-8 text-center text-gray-600">
					<BookOpen class="mx-auto mb-4 h-16 w-16 text-gray-300" />
					<p class="text-lg">No courses enrolled yet.</p>
				</div>
			{/if}
		</div>
	</div>
</div>
