import ScriptRunner from '@/components/ScriptRunner';
import { getPage } from '@/lib/db';
import { notFound } from 'next/navigation';

export async function generateMetadata() {
  const page = await getPage('why-business-travelers-from-noida-need-more-than-just-a-passport');
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: 'https://coverwiseimf.com/why-business-travelers-from-noida-need-more-than-just-a-passport',
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: 'https://coverwiseimf.com/why-business-travelers-from-noida-need-more-than-just-a-passport',
    }
  };
}

export default async function Page() {
  const page = await getPage('why-business-travelers-from-noida-need-more-than-just-a-passport');
  if (!page) {
    notFound();
  }

  return (
    <ScriptRunner html={page.html} bodyClass={page.bodyClass} />
  );
}
