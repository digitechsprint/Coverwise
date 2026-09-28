import ScriptRunner from '@/components/ScriptRunner';
import { getPage } from '@/lib/db';
import { notFound } from 'next/navigation';

export async function generateMetadata() {
  const page = await getPage('health-insurance');
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: 'https://coverwiseimf.com/health-insurance',
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: 'https://coverwiseimf.com/health-insurance',
    }
  };
}

export default async function Page() {
  const page = await getPage('health-insurance');
  if (!page) {
    notFound();
  }

  return (
    <ScriptRunner html={page.html} bodyClass={page.bodyClass} />
  );
}
