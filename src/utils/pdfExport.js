import { jsPDF } from 'jspdf';

export const exportNoteToPDF = (title, content, tags) => {
  const doc = new jsPDF({
    unit: 'mm',
    format: 'a4',
    orientation: 'portrait'
  });
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 25;
  const maxWidth = pageWidth - (margin * 2);
  let yPosition = margin;
  const lineHeight = 1.2;

  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  const titleText = title || 'Untitled';
  const titleLines = doc.splitTextToSize(titleText, maxWidth);
  doc.text(titleLines, margin, yPosition);
  yPosition += titleLines.length * 10 + 6;

  if (tags.length > 0) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120, 120, 120);
    const tagsText = tags.join(' • ');
    const tagLines = doc.splitTextToSize(tagsText, maxWidth);
    doc.text(tagLines, margin, yPosition);
    yPosition += tagLines.length * 4 + 8;
  }

  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40, 40, 40);
  
  if (content) {
    const paragraphs = content.split('\n');
    
    for (let i = 0; i < paragraphs.length; i++) {
      const paragraph = paragraphs[i].trim();
      
      if (paragraph) {
        const lines = doc.splitTextToSize(paragraph, maxWidth);
        
        if (yPosition + (lines.length * 5 * lineHeight) > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }
        
        doc.text(lines, margin, yPosition);
        yPosition += lines.length * 5 * lineHeight;
      }
      
      yPosition += 3;
    }
  } else {
    doc.setTextColor(150, 150, 150);
    doc.text('No content', margin, yPosition);
    yPosition += 10;
  }

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(150, 150, 150);
  doc.text(`Exported from iNote • ${dateStr}`, margin, pageHeight - 10);

  const filename = `${(title || 'Untitled').replace(/[^a-z0-9]/gi, '_')}.pdf`;
  doc.save(filename);
};
