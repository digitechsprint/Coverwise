import ScriptRunner from '@/components/ScriptRunner';
import { getPage } from '@/lib/db';
import { notFound } from 'next/navigation';

export async function generateMetadata() {
  const page = await getPage('travel-insurance-explore-the-world-with-confidence');
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: 'https://coverwiseimf.com/travel-insurance-explore-the-world-with-confidence',
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: 'https://coverwiseimf.com/travel-insurance-explore-the-world-with-confidence',
    }
  };
}

export default async function Page() {
  const page = await getPage('travel-insurance-explore-the-world-with-confidence');
  if (!page) {
    notFound();
  }

  return (
    <ScriptRunner html={page.html} bodyClass={page.bodyClass} />
  );
}
