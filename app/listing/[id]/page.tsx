import ListingDetailClient from './ListingDetailClient'

// This satisfies the GitHub Pages static build requirement
export function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }]
}

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  return <ListingDetailClient params={params} />
}
