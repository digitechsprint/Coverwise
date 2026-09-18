import { cookies } from 'next/headers';

/**
 * Checks whether the request carries a valid admin session cookie.
 * @returns {Promise<boolean>}
 */
export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get('admin_token')?.value === 'authenticated';
}
