import ScriptRunner from '@/components/ScriptRunner';
import { getPage } from '@/lib/db';
import { notFound } from 'next/navigation';

export async function generateMetadata() {
  const page = await getPage('get-a-quote');
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: 'https://coverwiseimf.com/get-a-quote',
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: 'https://coverwiseimf.com/get-a-quote',
    }
  };
}

export default async function Page() {
  const page = await getPage('get-a-quote');
  if (!page) {
    notFound();
  }

  return (
    <ScriptRunner html={page.html} bodyClass={page.bodyClass} />
  );
}
