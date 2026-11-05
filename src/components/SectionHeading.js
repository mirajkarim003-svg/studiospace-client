export default function SectionHeading({ title, subtitle, action, center = false }) {
  return (
    <div className={`mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${center ? "items-center text-center sm:flex-col sm:items-center" : ""}`}>
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className={`section-sub ${center ? "mx-auto" : ""}`}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
