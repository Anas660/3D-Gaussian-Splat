import Viewer from "@/components/Viewer";

export default function ViewerPage({ params }: { params: { id: string } }) {
  return <Viewer captureId={params.id} />;
}
