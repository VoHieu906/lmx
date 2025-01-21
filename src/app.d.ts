// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import PocketBase, { AuthModel } from 'pocketbase';
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			pb: PocketBase;
			user: AuthModel | undefined;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
