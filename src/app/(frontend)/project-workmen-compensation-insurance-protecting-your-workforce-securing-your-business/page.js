import ScriptRunner from '@/components/ScriptRunner';
import { getPage } from '@/lib/db';
import { notFound } from 'next/navigation';

export async function generateMetadata() {
  const page = await getPage('project-workmen-compensation-insurance-protecting-your-workforce-securing-your-business');
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: 'https://coverwiseimf.com/project-workmen-compensation-insurance-protecting-your-workforce-securing-your-business',
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: 'https://coverwiseimf.com/project-workmen-compensation-insurance-protecting-your-workforce-securing-your-business',
    }
  };
}

export default async function Page() {
  const page = await getPage('project-workmen-compensation-insurance-protecting-your-workforce-securing-your-business');
  if (!page) {
    notFound();
  }

  return (
    <ScriptRunner html={page.html} bodyClass={page.bodyClass} />
  );
}
