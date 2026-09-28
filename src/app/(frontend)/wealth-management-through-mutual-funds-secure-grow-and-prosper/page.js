import ScriptRunner from '@/components/ScriptRunner';
import { getPage } from '@/lib/db';
import { notFound } from 'next/navigation';

export async function generateMetadata() {
  const page = await getPage('wealth-management-through-mutual-funds-secure-grow-and-prosper');
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: 'https://coverwiseimf.com/wealth-management-through-mutual-funds-secure-grow-and-prosper',
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: 'https://coverwiseimf.com/wealth-management-through-mutual-funds-secure-grow-and-prosper',
    }
  };
}

export default async function Page() {
  const page = await getPage('wealth-management-through-mutual-funds-secure-grow-and-prosper');
  if (!page) {
    notFound();
  }

  return (
    <ScriptRunner html={page.html} bodyClass={page.bodyClass} />
  );
}
