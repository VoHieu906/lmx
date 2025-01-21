export const actions = {
	logout: async (event) => {
		const {
			locals: { pb }
		} = event;
		pb.authStore.clear();
	}
};
