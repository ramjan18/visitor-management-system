import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export const downloadVisitorBadge = async (visitor) => {
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([300, 200]);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const { width, height } = page.getSize();
  
      page.drawText('Visitor Badge', {
        x: 90,
        y: height - 30,
        size: 16,
        font,
        color: rgb(0, 0, 0.8),
      });
  
      page.drawText(`Name: ${visitor.name}`, { x: 20, y: height - 60, size: 12, font });
      page.drawText(`Email: ${visitor.email}`, { x: 20, y: height - 80, size: 10, font });
      page.drawText(`Phone: ${visitor.phoneNo}`, { x: 20, y: height - 100, size: 10, font });
      page.drawText(`Purpose: ${visitor.purpose}`, { x: 20, y: height - 120, size: 10, font });
      page.drawText(`Check-In: ${new Date(visitor.checkInTime).toLocaleString()}`, {
        x: 20,
        y: height - 140,
        size: 10,
        font,
      });
  
      if (typeof visitor.photo === 'string' && visitor.photo.startsWith('data:image')) {
        const imgBytes = await fetch(visitor.photo).then(res => res.arrayBuffer());
  
        const img = visitor.photo.includes('image/png')
          ? await pdfDoc.embedPng(imgBytes)
          : await pdfDoc.embedJpg(imgBytes);
  
        page.drawImage(img, {
          x: 220,
          y: 60,
          width: 50,
          height: 50,
        });
      }
  
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      saveAs(blob, `${visitor.name || "visitor"}_badge.pdf`);
    } catch (err) {
      console.error("Failed to download badge:", err);
      alert("Could not generate the badge. Please try again.");
    }
  };
  
  