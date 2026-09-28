import { supabase } from '@/lib/supabase';

const SITE_URL = 'https://coverwiseimf.com';

// Mirrors the static routes under src/app/(frontend)/ -- each one's slug
// matches its getPage(slug) call and folder name.
const STATIC_SLUGS = [
  '', // home
  'about',
  'our-portfolio',
  'contact',
  'our-services',
  'health-insurance',
  'motor-insurance',
  'motor-insurance-drive-with-confidence-stay-protected',
  'travel-insurance-explore-the-world-with-confidence',
  'marine-transit-insurance-protecting-your-cargo-securing-your-business',
  'fire-business-package-insurance-safeguarding-your-business-from-the-unexpected',
  'project-workmen-compensation-insurance-protecting-your-workforce-securing-your-business',
  'group-health-insurance-for-employees-secure-your-workforce-strengthen-your-business',
  'choosing-the-best-health-insurance-in-ghaziabad-and-noida',
  'wealth-management-through-mutual-funds-secure-grow-and-prosper',
  'why-business-travelers-from-noida-need-more-than-just-a-passport',
  'why-every-modern-adult-needs-a-comprehensive-health-term-insurance-combo',
  'get-a-quote',
];

export default async function sitemap() {
  const staticEntries = STATIC_SLUGS.map((slug) => ({
    url: slug ? `${SITE_URL}/${slug}` : `${SITE_URL}/`,
    changeFrequency: slug ? 'monthly' : 'weekly',
    priority: slug ? 0.8 : 1,
  }));

  const blogIndexEntry = {
    url: `${SITE_URL}/blog`,
    changeFrequency: 'weekly',
    priority: 0.6,
  };

  const { data: blogs } = await supabase
    .from('blogs')
    .select('slug, updated_at, created_at');

  const blogEntries = (blogs || []).map((blog) => ({
    url: `${SITE_URL}/blog/${blog.slug}`,
    lastModified: blog.updated_at || blog.created_at || undefined,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticEntries, blogIndexEntry, ...blogEntries];
}
