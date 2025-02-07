<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { Pencil, Plus, PlusCircle, Trash, Eye, EyeOff, Check } from 'lucide-svelte';

	let user = {
		name: 'John Doe',
		email: 'johndoe@example.com',
		profilePicture: 'https://via.placeholder.com/100',
		description: 'Software Engineer | Tech Enthusiast',
		certifications: ['AWS Certified', 'Google Cloud Professional'],
		experience: ['Frontend Developer at XYZ', 'Backend Developer at ABC'],
		privacy: {
			achievements: {
				showAll: false,
				selected: ['AWS Certified']
			},
			courses: {
				showAll: true,
				selected: []
			}
		}
	};

	$: achievementsCount = user.privacy.achievements.showAll
		? user.certifications.length
		: user.privacy.achievements.selected.length;

	$: coursesCount = user.privacy.courses.showAll
		? user.certifications.length
		: user.privacy.courses.selected.length;
</script>

<div class="mx-auto space-y-6">
	<!-- Profile & Personal Information Section -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<section class="rounded-xl border bg-white p-6 shadow-sm">
			<h2 class="mb-4 text-xl font-semibold">Profile Picture</h2>
			<div class="flex flex-col items-center">
				<img
					src="https://github.com/shadcn.png"
					alt="Profile"
					class="mb-4 h-32 w-32 rounded-full object-cover shadow-md"
				/>
				<Button variant="outline" class="gap-2">
					<Pencil size={16} />
					Change Picture
				</Button>
			</div>
		</section>

		<section class="rounded-xl border bg-white p-6 shadow-sm">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-xl font-semibold">Personal Information</h2>
				<Button variant="ghost" class="h-8 w-8 p-0">
					<Pencil size={16} />
				</Button>
			</div>

			<div class="space-y-3">
				<div class="grid grid-cols-3 gap-2">
					<span class="font-medium">Name:</span>
					<span class="col-span-2">{user.name}</span>
				</div>
				<div class="grid grid-cols-3 gap-2">
					<span class="font-medium">Email:</span>
					<span class="col-span-2">{user.email}</span>
				</div>
				<div class="grid grid-cols-3 gap-2">
					<span class="font-medium">Bio:</span>
					<span class="col-span-2">{user.description}</span>
				</div>
			</div>
		</section>
	</div>

	<!-- Certifications & Experience Section -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<section class="rounded-xl border bg-white p-6 shadow-sm">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-xl font-semibold">Certifications</h2>
				<Button variant="ghost" class="h-8 w-8 p-0">
					<PlusCircle size={16} />
				</Button>
			</div>

			<ul class="mb-4 space-y-2">
				{#each user.certifications as cert}
					<li class="flex items-center justify-between rounded-lg bg-gray-50 p-2">
						<span>{cert}</span>
						<div class="flex items-center gap-2">
							<Button variant="ghost" class="h-8 w-8 p-0">
								<Pencil size={16} />
							</Button>
							<Button variant="ghost" class="h-8 w-8 p-0 text-red-500">
								<Trash size={16} />
							</Button>
						</div>
					</li>
				{/each}
			</ul>
		</section>

		<section class="rounded-xl border bg-white p-6 shadow-sm">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-xl font-semibold">Experience</h2>
				<Button variant="ghost" class="h-8 w-8 p-0">
					<PlusCircle size={16} />
				</Button>
			</div>

			<ul class="mb-4 space-y-2">
				{#each user.experience as exp}
					<li class="flex items-center justify-between rounded-lg bg-gray-50 p-2">
						<span>{exp}</span>
						<div class="flex items-center gap-2">
							<Button variant="ghost" class="h-8 w-8 p-0">
								<Pencil size={16} />
							</Button>
							<Button variant="ghost" class="h-8 w-8 p-0 text-red-500">
								<Trash size={16} />
							</Button>
						</div>
					</li>
				{/each}
			</ul>
		</section>
	</div>

	<!-- Enhanced Privacy Settings Section -->
	<section class="rounded-xl border bg-white p-6 shadow-sm">
		<div class="mb-8 flex items-center justify-between">
			<h2 class="text-2xl font-semibold text-gray-800">Privacy Settings</h2>
			<div class="text-sm text-gray-500">Manage what others can see on your profile</div>
		</div>

		<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
			<!-- Enhanced Achievements Privacy -->
			<div class="relative space-y-6 rounded-lg bg-gray-50 p-6">
				<div class="absolute right-4 top-4">
					{#if user.privacy.achievements.showAll}
						<Eye class="text-green-500" size={20} />
					{:else}
						<EyeOff class="text-gray-400" size={20} />
					{/if}
				</div>

				<div>
					<h3 class="text-lg font-medium text-gray-800">Achievements Visibility</h3>
					<p class="mt-1 text-sm text-gray-600">
						{achievementsCount} item{achievementsCount !== 1 ? 's' : ''} visible
					</p>
				</div>

				<div class="space-y-3">
					<label
						class="flex cursor-pointer items-center gap-3 rounded-lg border bg-white p-4 transition-colors hover:bg-gray-50"
					>
						<div class="relative flex h-6 w-6 items-center justify-center">
							<input
								type="radio"
								name="achievements-privacy"
								bind:group={user.privacy.achievements.showAll}
								value={true}
								class="peer h-4 w-4 cursor-pointer"
							/>
							<div
								class="absolute inset-0 hidden items-center justify-center rounded-full bg-blue-500 text-white peer-checked:flex"
							>
								<Check size={12} />
							</div>
						</div>
						<div>
							<span class="font-medium">Show All Achievements</span>
							<p class="text-sm text-gray-500">Display all your achievements to visitors</p>
						</div>
					</label>

					<label
						class="flex cursor-pointer items-center gap-3 rounded-lg border bg-white p-4 transition-colors hover:bg-gray-50"
					>
						<div class="relative flex h-6 w-6 items-center justify-center">
							<input
								type="radio"
								name="achievements-privacy"
								bind:group={user.privacy.achievements.showAll}
								value={false}
								class="peer h-4 w-4 cursor-pointer"
							/>
							<div
								class="absolute inset-0 hidden items-center justify-center rounded-full bg-blue-500 text-white peer-checked:flex"
							>
								<Check size={12} />
							</div>
						</div>
						<div>
							<span class="font-medium">Select Specific Achievements</span>
							<p class="text-sm text-gray-500">Choose which achievements to display</p>
						</div>
					</label>
				</div>

				{#if !user.privacy.achievements.showAll}
					<div class="mt-4 space-y-2 rounded-lg border bg-white p-4">
						{#each user.certifications as cert}
							<label
								class="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
							>
								<div class="relative flex h-6 w-6 items-center justify-center">
									<input
										type="checkbox"
										bind:group={user.privacy.achievements.selected}
										value={cert}
										class="peer h-4 w-4 cursor-pointer"
									/>
									<div
										class="absolute inset-0 hidden items-center justify-center rounded-sm bg-blue-500 text-white peer-checked:flex"
									>
										<Check size={12} />
									</div>
								</div>
								<span class="text-sm">{cert}</span>
							</label>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Enhanced Courses Privacy -->
			<div class="relative space-y-6 rounded-lg bg-gray-50 p-6">
				<div class="absolute right-4 top-4">
					{#if user.privacy.courses.showAll}
						<Eye class="text-green-500" size={20} />
					{:else}
						<EyeOff class="text-gray-400" size={20} />
					{/if}
				</div>

				<div>
					<h3 class="text-lg font-medium text-gray-800">Courses Visibility</h3>
					<p class="mt-1 text-sm text-gray-600">
						{coursesCount} item{coursesCount !== 1 ? 's' : ''} visible
					</p>
				</div>

				<div class="space-y-3">
					<label
						class="flex cursor-pointer items-center gap-3 rounded-lg border bg-white p-4 transition-colors hover:bg-gray-50"
					>
						<div class="relative flex h-6 w-6 items-center justify-center">
							<input
								type="radio"
								name="courses-privacy"
								bind:group={user.privacy.courses.showAll}
								value={true}
								class="peer h-4 w-4 cursor-pointer"
							/>
							<div
								class="absolute inset-0 hidden items-center justify-center rounded-full bg-blue-500 text-white peer-checked:flex"
							>
								<Check size={12} />
							</div>
						</div>
						<div>
							<span class="font-medium">Show All Courses</span>
							<p class="text-sm text-gray-500">Display all your courses to visitors</p>
						</div>
					</label>

					<label
						class="flex cursor-pointer items-center gap-3 rounded-lg border bg-white p-4 transition-colors hover:bg-gray-50"
					>
						<div class="relative flex h-6 w-6 items-center justify-center">
							<input
								type="radio"
								name="courses-privacy"
								bind:group={user.privacy.courses.showAll}
								value={false}
								class="peer h-4 w-4 cursor-pointer"
							/>
							<div
								class="absolute inset-0 hidden items-center justify-center rounded-full bg-blue-500 text-white peer-checked:flex"
							>
								<Check size={12} />
							</div>
						</div>
						<div>
							<span class="font-medium">Select Specific Courses</span>
							<p class="text-sm text-gray-500">Choose which courses to display</p>
						</div>
					</label>
				</div>

				{#if !user.privacy.courses.showAll}
					<div class="mt-4 space-y-2 rounded-lg border bg-white p-4">
						{#each user.certifications as cert}
							<label
								class="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
							>
								<div class="relative flex h-6 w-6 items-center justify-center">
									<input
										type="checkbox"
										bind:group={user.privacy.courses.selected}
										value={cert}
										class="peer h-4 w-4 cursor-pointer"
									/>
									<div
										class="absolute inset-0 hidden items-center justify-center rounded-sm bg-blue-500 text-white peer-checked:flex"
									>
										<Check size={12} />
									</div>
								</div>
								<span class="text-sm">{cert}</span>
							</label>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</section>
</div>
