import ScriptRunner from '@/components/ScriptRunner';
import { getPage } from '@/lib/db';
import { notFound } from 'next/navigation';

export async function generateMetadata() {
  const page = await getPage('why-every-modern-adult-needs-a-comprehensive-health-term-insurance-combo');
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: 'https://coverwiseimf.com/why-every-modern-adult-needs-a-comprehensive-health-term-insurance-combo',
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: 'https://coverwiseimf.com/why-every-modern-adult-needs-a-comprehensive-health-term-insurance-combo',
    }
  };
}

export default async function Page() {
  const page = await getPage('why-every-modern-adult-needs-a-comprehensive-health-term-insurance-combo');
  if (!page) {
    notFound();
  }

  return (
    <ScriptRunner html={page.html} bodyClass={page.bodyClass} />
  );
}
