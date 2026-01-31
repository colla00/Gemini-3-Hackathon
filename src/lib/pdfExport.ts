import jsPDF from 'jspdf';

interface PatentClaim {
  number: number;
  title: string;
  description: string;
  category: string;
  implementation: string;
  status: string;
}

interface AttestationData {
  witnessName: string;
  witnessTitle: string;
  organization: string;
  attestedAt: string | null;
  signature: string;
}

export const generatePatentEvidencePDF = (
  claims: PatentClaim[],
  attestations: AttestationData[],
  documentHash: string,
  documentVersion: string
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  const addNewPageIfNeeded = (requiredSpace: number = 40) => {
    if (y + requiredSpace > 270) {
      doc.addPage();
      y = 20;
    }
  };

  // Research Prototype Warning Banner
  doc.setFillColor(255, 243, 205);
  doc.rect(0, y, pageWidth, 15, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(180, 83, 9);
  doc.text('⚠ RESEARCH PROTOTYPE - NO CLINICAL VALIDATION CONDUCTED', pageWidth / 2, y + 9, { align: 'center' });
  doc.setTextColor(0, 0, 0);
  y += 20;

  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Patent Evidence Documentation', margin, y);
  y += 10;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Clinical Risk Intelligence System', margin, y);
  y += 15;

  // Document info box
  doc.setDrawColor(200);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 30, 3, 3, 'FD');
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Document Hash:', margin + 5, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.text(documentHash, margin + 40, y + 8);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Version:', margin + 5, y + 16);
  doc.setFont('helvetica', 'normal');
  doc.text(documentVersion, margin + 25, y + 16);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Generated:', margin + 5, y + 24);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date().toLocaleString(), margin + 30, y + 24);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Claims:', margin + 100, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.text(claims.length.toString(), margin + 120, y + 8);
  
  y += 40;

  // Inventor info
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Inventor: ', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.text('Alexis Collier, PhD, RN', margin + 20, y);
  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.text('Filing: ', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.text('U.S. Provisional Application, December 2025', margin + 15, y);
  y += 15;

  // Patent Claims Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Patent Claims', margin, y);
  y += 10;

  claims.forEach((claim) => {
    addNewPageIfNeeded(50);
    
    // Claim header
    doc.setFillColor(240, 245, 250);
    doc.roundedRect(margin, y - 5, contentWidth, 8, 2, 2, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`Claim ${claim.number}: ${claim.title}`, margin + 3, y);
    y += 8;

    // Description
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const descLines = doc.splitTextToSize(claim.description, contentWidth - 6);
    doc.text(descLines, margin + 3, y);
    y += descLines.length * 4 + 4;

    // Implementation
    addNewPageIfNeeded(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Implementation:', margin + 3, y);
    y += 4;
    doc.setFont('helvetica', 'normal');
    const implLines = doc.splitTextToSize(claim.implementation, contentWidth - 6);
    doc.text(implLines, margin + 3, y);
    y += implLines.length * 4 + 4;

    // Status
    doc.setFont('helvetica', 'bold');
    doc.text('Status: ', margin + 3, y);
    doc.setFont('helvetica', 'normal');
    doc.text(claim.status.charAt(0).toUpperCase() + claim.status.slice(1), margin + 20, y);
    y += 12;
  });

  // Attestations Section
  if (attestations.length > 0) {
    addNewPageIfNeeded(60);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Witness Attestations', margin, y);
    y += 10;

    attestations.forEach((att, index) => {
      addNewPageIfNeeded(35);
      
      doc.setFillColor(245, 250, 245);
      doc.roundedRect(margin, y - 5, contentWidth, 30, 2, 2, 'F');
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`Attestation #${index + 1}`, margin + 3, y);
      y += 6;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Witness: ${att.witnessName}, ${att.witnessTitle}`, margin + 3, y);
      y += 5;
      if (att.organization) {
        doc.text(`Organization: ${att.organization}`, margin + 3, y);
        y += 5;
      }
      doc.text(`Date: ${att.attestedAt ? new Date(att.attestedAt).toLocaleString() : 'N/A'}`, margin + 3, y);
      y += 5;
      doc.text(`Signature: ${att.signature}`, margin + 3, y);
      y += 12;
    });
  }

  // Footer on each page with watermark
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Research Prototype Watermark (diagonal)
    doc.setFontSize(50);
    doc.setTextColor(200, 200, 200);
    doc.setFont('helvetica', 'bold');
    doc.text('RESEARCH PROTOTYPE', pageWidth / 2, 150, { 
      align: 'center', 
      angle: 45 
    });
    doc.setTextColor(0, 0, 0);
    
    // Page footer
    doc.setFontSize(8);
    doc.setTextColor(128);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, 290, { align: 'center' });
    doc.text('RESEARCH PROTOTYPE - NO CLINICAL VALIDATION - CONFIDENTIAL', pageWidth / 2, 285, { align: 'center' });
    doc.setTextColor(0);
  }

  // Save the PDF
  doc.save(`patent-evidence-${documentHash}.pdf`);
};
