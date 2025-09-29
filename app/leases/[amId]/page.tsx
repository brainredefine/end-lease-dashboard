import LeaseClient from "./LeaseClient";

type Params = Promise<{ amId: string }>;

export default async function LeasePage({ params }: { params: Params }) {
  const { amId } = await params;
  return <LeaseClient amId={amId} />;
}
