<!-- Privacy Settings Section -->
<section class="privacy-settings">
	<h2>Privacy Settings</h2>
	<label>
		<input type="checkbox" checked={user.privacy.showAchievements} />
		Show Achievements
	</label>
	<label>
		<input type="checkbox" checked={user.privacy.showCourses === 'all'} />
		Show All Courses
	</label>
	<label>
		<input type="checkbox" checked={Array.isArray(user.privacy.showCourses)} />
		Select Courses
	</label>
</section>

<!-- Change Password Section -->
<section class="change-password">
	<h2>Change Password</h2>
	<button>Change Password</button>
</section>

<!-- Linked Accounts Section -->
<section class="linked-accounts">
	<h2>Linked Accounts</h2>
	<button class={user.linkedAccounts.google ? 'linked' : ''}>
		{user.linkedAccounts.google ? 'Connected to Google' : 'Connect Google'}
	</button>
	<button class={user.linkedAccounts.github ? 'linked' : ''}>
		{user.linkedAccounts.github ? 'Connected to GitHub' : 'Connect GitHub'}
	</button>
</section>
