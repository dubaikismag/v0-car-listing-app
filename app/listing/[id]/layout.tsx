export const dynamicParams = false;

export function generateStaticParams() {
  // This stays here in a "Server" file where Next.js can read it
  return []; 
}

export default function ListingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
