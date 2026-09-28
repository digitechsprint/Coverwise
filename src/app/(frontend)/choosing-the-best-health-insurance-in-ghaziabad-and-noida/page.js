import ScriptRunner from '@/components/ScriptRunner';
import { getPage } from '@/lib/db';
import { notFound } from 'next/navigation';

export async function generateMetadata() {
  const page = await getPage('choosing-the-best-health-insurance-in-ghaziabad-and-noida');
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: 'https://coverwiseimf.com/choosing-the-best-health-insurance-in-ghaziabad-and-noida',
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: 'https://coverwiseimf.com/choosing-the-best-health-insurance-in-ghaziabad-and-noida',
    }
  };
}

export default async function Page() {
  const page = await getPage('choosing-the-best-health-insurance-in-ghaziabad-and-noida');
  if (!page) {
    notFound();
  }

  return (
    <ScriptRunner html={page.html} bodyClass={page.bodyClass} />
  );
}
