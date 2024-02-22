import { getPageMetadata } from '@/lib/seo';

export const metadata = getPageMetadata({ title: 'My definitions' });

export default function MyDefinitionsPage() {
  return <>My definitions</>;
}
