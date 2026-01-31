import { useState } from 'react';
import { FileText, Download, Loader2, CheckCircle2, Image, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import jsPDF from 'jspdf';
import type { PatentClaim, AttestationData } from '@/types/patent';

interface FullPDFExportProps {
  claims: PatentClaim[];
  attestations: AttestationData[];
  documentHash: string;
  documentVersion: string;
}

export const FullPDFExport = ({ claims, attestations, documentHash, documentVersion }: FullPDFExportProps) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const generateFullPDF = async () => {
    setIsExporting(true);
    setProgress(0);

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      let yPosition = margin;

      // Helper function to add page if needed
      const checkPageBreak = (requiredSpace: number) => {
        if (yPosition + requiredSpace > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
          return true;
        }
        return false;
      };

      // Helper to wrap text
      const addWrappedText = (text: string, fontSize: number, maxWidth: number) => {
        pdf.setFontSize(fontSize);
        const lines = pdf.splitTextToSize(text, maxWidth);
        lines.forEach((line: string) => {
          checkPageBreak(fontSize * 0.5);
          pdf.text(line, margin, yPosition);
          yPosition += fontSize * 0.5;
        });
        return lines.length;
      };

      // ===== COVER PAGE =====
      setProgress(5);
      
      // Title
      pdf.setFillColor(30, 41, 59);
      pdf.rect(0, 0, pageWidth, 80, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(28);
      pdf.setFont('helvetica', 'bold');
      pdf.text('PATENT EVIDENCE PACKAGE', pageWidth / 2, 35, { align: 'center' });
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'normal');
      pdf.text('NSO Quality Dashboard - 4 U.S. Patents Filed', pageWidth / 2, 48, { align: 'center' });
      
      pdf.setFontSize(10);
      pdf.text('CONFIDENTIAL - ATTORNEY-CLIENT PRIVILEGED', pageWidth / 2, 65, { align: 'center' });

      // Document Info Box
      yPosition = 100;
      pdf.setTextColor(0, 0, 0);
      pdf.setFillColor(248, 250, 252);
      pdf.roundedRect(margin, yPosition, contentWidth, 50, 3, 3, 'F');
      
      yPosition += 10;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Document Information', margin + 5, yPosition);
      
      yPosition += 8;
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Document Hash: ${documentHash}`, margin + 5, yPosition);
      yPosition += 6;
      pdf.text(`Version: ${documentVersion}`, margin + 5, yPosition);
      yPosition += 6;
      pdf.text(`Generated: ${new Date().toLocaleString()}`, margin + 5, yPosition);
      yPosition += 6;
      pdf.text(`Total Claims: ${claims.length}`, margin + 5, yPosition);
      yPosition += 6;
      pdf.text(`Attestations: ${attestations.length}`, margin + 5, yPosition);

      // Inventor Info
      yPosition = 170;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Inventor', margin, yPosition);
      yPosition += 8;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text('Alexis Collier, PhD, RN', margin, yPosition);
      yPosition += 6;
      pdf.text('U.S. Provisional Patent Application', margin, yPosition);
      yPosition += 6;
      pdf.text('December 2025', margin, yPosition);

      // Table of Contents
      yPosition = 210;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Contents', margin, yPosition);
      yPosition += 8;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      
      const toc = [
        '1. Executive Summary',
        '2. Patent Claims (1-20)',
        '3. Witness Attestations',
        '4. Evidence Timeline',
        '5. Appendix: Screenshots'
      ];
      
      toc.forEach(item => {
        pdf.text(item, margin + 5, yPosition);
        yPosition += 6;
      });

      // ===== EXECUTIVE SUMMARY =====
      setProgress(15);
      pdf.addPage();
      yPosition = margin;
      
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('1. Executive Summary', margin, yPosition);
      yPosition += 12;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const summaryText = `This document provides comprehensive evidence of the working implementation of the NSO Quality Dashboard, covering 80+ patent claims across 4 U.S. provisional applications. The system integrates trust-based alert prioritization, clinical risk intelligence with SHAP explainability, unified nursing intelligence, and documentation burden scoring (DBS) for nurse-sensitive patient outcomes.

Each claim is documented with its patent language, working implementation details, and source code references. Witness attestations verify the functionality of all described features.`;
      
      addWrappedText(summaryText, 10, contentWidth);

      // Claim Categories Summary
      yPosition += 10;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Claim Categories', margin, yPosition);
      yPosition += 8;

      const categories = [
        { name: 'System Architecture', count: claims.filter(c => c.category === 'system').length },
        { name: 'SHAP Explainability', count: claims.filter(c => c.category === 'explainability').length },
        { name: 'Temporal Forecasting', count: claims.filter(c => c.category === 'forecasting').length },
        { name: 'Adaptive Thresholds', count: claims.filter(c => c.category === 'thresholds').length },
        { name: 'Closed-Loop Feedback', count: claims.filter(c => c.category === 'feedback').length },
        { name: 'Clinical Workflow', count: claims.filter(c => c.category === 'workflow').length },
      ];

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      categories.forEach(cat => {
        pdf.text(`• ${cat.name}: ${cat.count} claims`, margin + 5, yPosition);
        yPosition += 6;
      });

      // ===== PATENT CLAIMS =====
      setProgress(25);
      pdf.addPage();
      yPosition = margin;

      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('2. Patent Claims', margin, yPosition);
      yPosition += 15;

      for (let i = 0; i < claims.length; i++) {
        const claim = claims[i];
        setProgress(25 + Math.floor((i / claims.length) * 40));

        checkPageBreak(60);
        
        // Claim header
        pdf.setFillColor(248, 250, 252);
        pdf.roundedRect(margin, yPosition, contentWidth, 8, 2, 2, 'F');
        
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 0, 0);
        pdf.text(`Claim ${claim.number}: ${claim.title}`, margin + 3, yPosition + 5.5);
        yPosition += 12;

        // Category and status
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Category: ${claim.category} | Status: ${claim.status}`, margin, yPosition);
        yPosition += 8;

        // Patent language
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Patent Claim Language:', margin, yPosition);
        yPosition += 5;
        pdf.setFont('helvetica', 'normal');
        addWrappedText(claim.description, 9, contentWidth - 5);
        yPosition += 5;

        // Implementation
        pdf.setFont('helvetica', 'bold');
        pdf.text('Working Implementation:', margin, yPosition);
        yPosition += 5;
        pdf.setFont('helvetica', 'normal');
        addWrappedText(claim.implementation, 9, contentWidth - 5);
        yPosition += 3;

        // Source reference
        pdf.setTextColor(80, 80, 200);
        pdf.text(`Source: ${claim.componentPath}`, margin, yPosition);
        pdf.setTextColor(0, 0, 0);
        yPosition += 12;
      }

      // ===== ATTESTATIONS =====
      setProgress(70);
      pdf.addPage();
      yPosition = margin;

      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('3. Witness Attestations', margin, yPosition);
      yPosition += 15;

      if (attestations.length === 0) {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'italic');
        pdf.text('No attestations have been recorded yet.', margin, yPosition);
      } else {
        attestations.forEach((att, idx) => {
          checkPageBreak(45);
          
          pdf.setFillColor(240, 253, 244);
          pdf.roundedRect(margin, yPosition, contentWidth, 35, 3, 3, 'F');
          
          yPosition += 8;
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'bold');
          pdf.text(`Attestation #${idx + 1}`, margin + 5, yPosition);
          
          yPosition += 7;
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          pdf.text(`Witness: ${att.witnessName}`, margin + 5, yPosition);
          yPosition += 5;
          pdf.text(`Title: ${att.witnessTitle}${att.organization ? ` | ${att.organization}` : ''}`, margin + 5, yPosition);
          yPosition += 5;
          pdf.text(`Date: ${att.attestedAt ? new Date(att.attestedAt).toLocaleString() : 'Unknown'}`, margin + 5, yPosition);
          yPosition += 5;
          pdf.text(`Signature: ${att.signature}`, margin + 5, yPosition);
          
          yPosition += 15;
        });
      }

      // ===== TIMELINE =====
      setProgress(80);
      pdf.addPage();
      yPosition = margin;

      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('4. Evidence Timeline', margin, yPosition);
      yPosition += 15;

      // Load timeline activities
      const { data: activities } = await supabase
        .from('patent_activities')
        .select('*')
        .eq('document_hash', documentHash)
        .order('created_at', { ascending: false })
        .limit(20);

      if (!activities || activities.length === 0) {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'italic');
        pdf.text('No timeline activities recorded.', margin, yPosition);
      } else {
        activities.forEach((activity) => {
          checkPageBreak(20);
          
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'bold');
          pdf.text(`• ${activity.title}`, margin + 5, yPosition);
          yPosition += 5;
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(100, 100, 100);
          pdf.text(`  ${new Date(activity.created_at).toLocaleString()} | ${activity.activity_type}`, margin + 5, yPosition);
          pdf.setTextColor(0, 0, 0);
          yPosition += 8;
        });
      }

      // ===== APPENDIX =====
      setProgress(90);
      pdf.addPage();
      yPosition = margin;

      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('5. Appendix: Screenshots', margin, yPosition);
      yPosition += 15;

      // Load screenshots
      const { data: screenshots } = await supabase
        .from('patent_claim_screenshots')
        .select('*')
        .eq('document_hash', documentHash)
        .order('claim_number', { ascending: true });

      if (!screenshots || screenshots.length === 0) {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'italic');
        pdf.text('No screenshots have been uploaded.', margin, yPosition);
      } else {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`${screenshots.length} screenshots attached to claims.`, margin, yPosition);
        yPosition += 10;

        const groupedScreenshots: Record<number, typeof screenshots> = {};
        screenshots.forEach(s => {
          if (!groupedScreenshots[s.claim_number]) groupedScreenshots[s.claim_number] = [];
          groupedScreenshots[s.claim_number].push(s);
        });

        Object.entries(groupedScreenshots).forEach(([claimNum, shots]) => {
          checkPageBreak(15);
          pdf.setFont('helvetica', 'bold');
          pdf.text(`Claim ${claimNum}: ${shots.length} screenshot(s)`, margin + 5, yPosition);
          yPosition += 5;
          shots.forEach(shot => {
            pdf.setFont('helvetica', 'normal');
            pdf.text(`  - ${shot.file_name}${shot.caption ? `: ${shot.caption}` : ''}`, margin + 10, yPosition);
            yPosition += 5;
          });
          yPosition += 3;
        });
      }

      // ===== FOOTER =====
      setProgress(95);
      
      // Add page numbers
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        pdf.text(`Document Hash: ${documentHash}`, margin, pageHeight - 10);
        pdf.text('CONFIDENTIAL', pageWidth - margin, pageHeight - 10, { align: 'right' });
      }

      // Save
      setProgress(100);
      pdf.save(`patent-evidence-package-${documentHash}.pdf`);

      toast({
        title: 'PDF Generated',
        description: 'Complete evidence package has been downloaded'
      });
    } catch (err) {
      console.error('PDF generation failed:', err);
      toast({
        title: 'Export Failed',
        description: 'Failed to generate PDF. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsExporting(false);
      setProgress(0);
    }
  };

  return (
    <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/30">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5 text-blue-500" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-foreground mb-1">Full Evidence Package</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Generate a comprehensive PDF containing all claims, attestations, timeline, and screenshot references.
          </p>
          
          <div className="flex flex-wrap gap-2 mb-3 text-[10px]">
            <span className="px-2 py-1 rounded bg-secondary flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-risk-low" />
              {claims.length} Claims
            </span>
            <span className="px-2 py-1 rounded bg-secondary flex items-center gap-1">
              <Users className="w-3 h-3 text-purple-500" />
              {attestations.length} Attestations
            </span>
            <span className="px-2 py-1 rounded bg-secondary flex items-center gap-1">
              <Clock className="w-3 h-3 text-blue-500" />
              Timeline
            </span>
            <span className="px-2 py-1 rounded bg-secondary flex items-center gap-1">
              <Image className="w-3 h-3 text-emerald-500" />
              Screenshots
            </span>
          </div>

          {isExporting && (
            <div className="mb-3">
              <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                <span>Generating PDF...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <Button
            onClick={generateFullPDF}
            disabled={isExporting}
            className="gap-2"
            size="sm"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download Full Package
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
