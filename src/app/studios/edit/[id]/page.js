"use client";
import { useParams } from "next/navigation";
import PrivateRoute from "@/components/PrivateRoute";
import PageHeader from "@/components/PageHeader";
import StudioForm from "@/components/StudioForm";
import EmptyState from "@/components/EmptyState";
import { DetailsSkeleton } from "@/components/Skeletons";
import { useAuth } from "@/context/AuthContext";
import { useApi } from "@/lib/useApi";

function Editor() {
  const { id } = useParams();
  const { user } = useAuth();
  const { data, loading, error } = useApi(`/studios/${id}`);

  if (loading) return <DetailsSkeleton />;
  if (error || !data) return <div className="container-x py-20"><EmptyState title="Studio not found" text={error} actionHref="/my-listings" actionLabel="Back to my listings" /></div>;
  if (data.studio.ownerEmail !== user.email) {
    return <div className="container-x py-20"><EmptyState title="This is not your listing" text="You can only edit studios that you host." actionHref="/my-listings" actionLabel="Back to my listings" /></div>;
  }
  return (
    <>
      <PageHeader title="Update studio" subtitle={`Editing ${data.studio.title}`} />
      <div className="container-x max-w-4xl py-10"><StudioForm studio={data.studio} /></div>
    </>
  );
}

export default function EditStudioPage() {
  return <PrivateRoute><Editor /></PrivateRoute>;
}
