"use client";
import PrivateRoute from "@/components/PrivateRoute";
import PageHeader from "@/components/PageHeader";
import StudioForm from "@/components/StudioForm";

export default function AddStudioPage() {
  return (
    <PrivateRoute>
      <PageHeader title="Add a new studio" subtitle="Tell creators about your space. You can edit or remove the listing at any time." />
      <div className="container-x max-w-4xl py-10"><StudioForm /></div>
    </PrivateRoute>
  );
}
