import { useEffect } from 'react';
import { performLogout } from '@/lib/auth/storage';
import { useRouter } from 'next/router';

export default function LogoutPage() {
	const router = useRouter();
	useEffect(() => {
		(async () => {
			await performLogout();
			router.replace('/auth/sign-in');
		})();
	}, [router]);
	return null;
}
