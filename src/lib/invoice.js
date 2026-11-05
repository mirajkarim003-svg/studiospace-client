import { fmtDate, fmtTime, money } from "./utils";

// Builds and downloads a PDF receipt for a confirmed / completed booking (jsPDF, runs in the browser)
export async function downloadInvoice(b) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const no = `SS-${String(b._id).slice(-8).toUpperCase()}`;

  doc.setFillColor(14, 20, 36);
  doc.rect(0, 0, W, 110, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.text("StudioSpace", 48, 60);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(255, 210, 31);
  doc.text("Booking receipt", 48, 80);
  doc.setTextColor(255, 255, 255);
  doc.text(`Receipt no. ${no}`, W - 48, 60, { align: "right" });
  doc.text(`Issued ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, W - 48, 80, { align: "right" });

  doc.setTextColor(20, 20, 30);
  let y = 160;
  const block = (title, lines, x) => {
    doc.setFont("helvetica", "bold").setFontSize(10).setTextColor(110, 115, 130).text(title, x, y);
    doc.setFont("helvetica", "normal").setFontSize(12).setTextColor(20, 20, 30);
    lines.forEach((l, i) => doc.text(String(l), x, y + 20 + i * 16));
  };
  block("BILLED TO", [b.userName, b.userEmail], 48);
  block("HOSTED BY", [b.hostName, b.hostEmail], W / 2);

  y = 250;
  block("STUDIO", [b.studioTitle, b.studioLocation], 48);
  block("SESSION", [fmtDate(b.date), `${fmtTime(b.startTime)} - ${fmtTime(b.endTime)} (${b.hours} hr)`, `${b.guests} guest${b.guests > 1 ? "s" : ""}`], W / 2);

  y = 350;
  doc.setFillColor(238, 240, 246).rect(48, y, W - 96, 28, "F");
  doc.setFont("helvetica", "bold").setFontSize(11).text("Description", 60, y + 18).text("Amount", W - 60, y + 18, { align: "right" });
  doc.setFont("helvetica", "normal").setFontSize(12);
  doc.text(`Studio rental: ${money(b.hourlyRate)} x ${b.hours} hr`, 60, y + 54).text(money(b.subtotal), W - 60, y + 54, { align: "right" });
  doc.text("Security deposit (refundable)", 60, y + 80).text(money(b.securityDeposit), W - 60, y + 80, { align: "right" });
  doc.setDrawColor(200, 204, 214).line(48, y + 98, W - 48, y + 98);
  doc.setFont("helvetica", "bold").setFontSize(14);
  doc.text("Total", 60, y + 124).text(money(b.total), W - 60, y + 124, { align: "right" });

  doc.setFontSize(11).setFont("helvetica", "normal").setTextColor(110, 115, 130);
  doc.text(`Booking status: ${b.status}`, 48, y + 170);
  doc.text("Thank you for booking with StudioSpace. Payment is settled directly with the host.", 48, y + 190);

  doc.save(`StudioSpace-receipt-${no}.pdf`);
}
