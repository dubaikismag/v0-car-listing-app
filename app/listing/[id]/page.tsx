import ListingDetailClient from './ListingDetailClient'

export default async function ListingDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = await params
  return <ListingDetailClient params={resolvedParams} />
}
