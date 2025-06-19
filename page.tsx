
// src/app/dashboard/loan/[id]/page.tsx

// This interface defines the expected shape of props for a Next.js page.
// It includes 'params' for dynamic route segments and 'searchParams' for query strings.
interface LoanDetailPageProps {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

// This is a minimal functional component that Next.js can render as a page.
// It accepts props matching LoanDetailPageProps.
export default function LoanDetailPage({ params }: LoanDetailPageProps) {
  return (
    <div>
      <h1>Loan Detail Page (Minimal)</h1>
      <p>Loan ID: {params.id}</p>
      <p>This page is currently a placeholder for debugging purposes.</p>
    </div>
  );
}
