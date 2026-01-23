import { useRef } from 'react';
import { Printer, FileText, Award, Calendar, Hash, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PatentClaim, AttestationData } from '@/types/patent';

interface PrintLegalViewProps {
  claims: PatentClaim[];
  attestations: AttestationData[];
  documentHash: string;
  documentVersion: string;
}

export const PrintLegalView = ({
  claims,
  attestations,
  documentHash,
  documentVersion
}: PrintLegalViewProps) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Patent Evidence Documentation - Legal Filing Copy</title>
        <style>
          @page {
            size: letter;
            margin: 1in;
          }
          body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12pt;
            line-height: 1.5;
            color: #000;
            background: #fff;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            font-size: 16pt;
            font-weight: bold;
            margin: 0 0 10px;
            text-transform: uppercase;
          }
          .header h2 {
            font-size: 14pt;
            font-weight: normal;
            margin: 0 0 10px;
          }
          .meta-info {
            display: flex;
            justify-content: space-between;
            font-size: 10pt;
            margin-top: 15px;
          }
          .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
          }
          .section-title {
            font-size: 14pt;
            font-weight: bold;
            border-bottom: 1px solid #000;
            padding-bottom: 5px;
            margin-bottom: 15px;
          }
          .claim {
            margin-bottom: 25px;
            page-break-inside: avoid;
          }
          .claim-header {
            font-weight: bold;
            margin-bottom: 10px;
          }
          .claim-body {
            margin-left: 20px;
          }
          .claim-label {
            font-weight: bold;
            display: block;
            margin-top: 10px;
          }
          .attestation {
            border: 1px solid #000;
            padding: 15px;
            margin-bottom: 15px;
          }
          .signature-line {
            border-top: 1px solid #000;
            margin-top: 40px;
            padding-top: 5px;
            width: 300px;
          }
          .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 10pt;
            border-top: 1px solid #000;
            padding-top: 10px;
          }
          .page-number:after {
            content: counter(page);
          }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        ${printContent.innerHTML}
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      <Button onClick={handlePrint} variant="outline" size="sm" className="gap-2">
        <Printer className="w-4 h-4" />
        Print Legal Copy
      </Button>

      {/* Hidden print content */}
      <div className="hidden">
        <div ref={printRef}>
          {/* Header */}
          <div className="header">
            <h1>PATENT EVIDENCE DOCUMENTATION</h1>
            <h2>NSO Quality Dashboard</h2>
            <p style={{ fontStyle: 'italic', margin: '10px 0' }}>
              4 U.S. Patents Filed: Trust-Based Alerts • Clinical Risk Intelligence • Unified Platform • DBS System
            </p>
            <div className="meta-info">
              <div>
                <strong>Inventor:</strong> Alexis Collier, PhD, RN
              </div>
              <div>
                <strong>Filing:</strong> U.S. Provisional Application
              </div>
              <div>
                <strong>Date:</strong> December 2025
              </div>
            </div>
          </div>

          {/* Document Integrity Section */}
          <div className="section">
            <div className="section-title">DOCUMENT INTEGRITY VERIFICATION</div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '5px 0', width: '200px' }}><strong>Document Hash:</strong></td>
                  <td style={{ fontFamily: 'Courier, monospace' }}>{documentHash}</td>
                </tr>
                <tr>
                  <td style={{ padding: '5px 0' }}><strong>Document Version:</strong></td>
                  <td>{documentVersion}</td>
                </tr>
                <tr>
                  <td style={{ padding: '5px 0' }}><strong>Total Claims:</strong></td>
                  <td>{claims.length}</td>
                </tr>
                <tr>
                  <td style={{ padding: '5px 0' }}><strong>Print Date:</strong></td>
                  <td>{currentDate}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Claims Section */}
          <div className="section">
            <div className="section-title">PATENT CLAIMS AND IMPLEMENTATIONS</div>
            {claims.map(claim => (
              <div key={claim.number} className="claim">
                <div className="claim-header">
                  Claim {claim.number}: {claim.title}
                </div>
                <div className="claim-body">
                  <span className="claim-label">Patent Claim Language:</span>
                  <p>{claim.description}</p>
                  
                  <span className="claim-label">Working Implementation:</span>
                  <p>{claim.implementation}</p>
                  
                  <span className="claim-label">Source File:</span>
                  <p style={{ fontFamily: 'Courier, monospace', fontSize: '10pt' }}>
                    {claim.componentPath}
                  </p>
                  
                  <span className="claim-label">Implementation Status:</span>
                  <p>{claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Attestations Section */}
          {attestations.length > 0 && (
            <div className="section">
              <div className="section-title">WITNESS ATTESTATIONS</div>
              {attestations.map((att, idx) => (
                <div key={idx} className="attestation">
                  <p><strong>Witness #{idx + 1}</strong></p>
                  <p><strong>Name:</strong> {att.witnessName}</p>
                  <p><strong>Title:</strong> {att.witnessTitle}</p>
                  {att.organization && <p><strong>Organization:</strong> {att.organization}</p>}
                  <p><strong>Date of Attestation:</strong> {att.attestedAt ? new Date(att.attestedAt).toLocaleString() : 'N/A'}</p>
                  <p style={{ marginTop: '15px', fontStyle: 'italic' }}>
                    "I hereby attest that I have reviewed the above patent claims and their corresponding 
                    implementations in the NSO Quality Dashboard software. The implementations 
                    described accurately reflect the working functionality of the system as of the date of this attestation."
                  </p>
                  <div className="signature-line">
                    <span>Signature: {att.signature}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Certification */}
          <div className="section" style={{ marginTop: '50px' }}>
            <div className="section-title">CERTIFICATION</div>
            <p>
              I, the undersigned, do hereby certify that this document is a true and accurate 
              representation of the patent evidence documentation for the NSO Quality Dashboard 
              as of the date indicated above.
            </p>
            <div style={{ marginTop: '50px' }}>
              <div className="signature-line">
                <span>Authorized Signature</span>
              </div>
              <div style={{ marginTop: '30px' }}>
                <div className="signature-line">
                  <span>Date</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ marginTop: '50px', textAlign: 'center', fontSize: '10pt', borderTop: '1px solid #000', paddingTop: '10px' }}>
            <p>CONFIDENTIAL - FOR LEGAL FILING PURPOSES ONLY</p>
            <p>© {new Date().getFullYear()} Patent Documentation System. All rights reserved.</p>
          </div>
        </div>
      </div>
    </>
  );
};
