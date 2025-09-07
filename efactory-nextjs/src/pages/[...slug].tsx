import { useRouter } from 'next/router';

export default function DynamicPage() {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dynamic Route</h1>
      <p>Path: /{Array.isArray(slug) ? slug.join('/') : 'loading...'}</p>
    </div>
  );
}