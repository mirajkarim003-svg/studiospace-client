"use client";
import EmptyState from "@/components/EmptyState";

export default function GlobalError({ reset }) {
  return (
    <div className="container-x py-24">
      <EmptyState title="Something went wrong" text="An unexpected error interrupted this page. Please try again." actionLabel="Reload this page" onAction={reset} />
    </div>
  );
}
