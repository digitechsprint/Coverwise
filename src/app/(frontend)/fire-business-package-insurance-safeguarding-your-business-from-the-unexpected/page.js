import ScriptRunner from '@/components/ScriptRunner';
import { getPage } from '@/lib/db';
import { notFound } from 'next/navigation';

export async function generateMetadata() {
  const page = await getPage('fire-business-package-insurance-safeguarding-your-business-from-the-unexpected');
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: 'https://coverwiseimf.com/fire-business-package-insurance-safeguarding-your-business-from-the-unexpected',
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: 'https://coverwiseimf.com/fire-business-package-insurance-safeguarding-your-business-from-the-unexpected',
    }
  };
}

export default async function Page() {
  const page = await getPage('fire-business-package-insurance-safeguarding-your-business-from-the-unexpected');
  if (!page) {
    notFound();
  }

  return (
    <ScriptRunner html={page.html} bodyClass={page.bodyClass} />
  );
}
