import { QRCodeSVG } from 'qrcode.react';
import { cn } from '@/lib/utils';

interface QRCodeVerificationProps {
  documentHash: string;
  documentVersion: string;
  className?: string;
}

export const QRCodeVerification = ({ 
  documentHash, 
  documentVersion,
  className 
}: QRCodeVerificationProps) => {
  // Generate verification URL
  const verificationUrl = `${window.location.origin}/patent-evidence?key=patent2025&verify=${documentHash}`;
  
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="p-3 bg-white rounded-lg border border-border">
        <QRCodeSVG
          value={verificationUrl}
          size={100}
          level="M"
          includeMargin={false}
        />
      </div>
      <div className="text-center">
        <p className="text-[10px] text-muted-foreground">Scan to verify</p>
        <p className="text-[10px] font-mono text-primary">{documentHash}</p>
        <p className="text-[10px] text-muted-foreground">v{documentVersion}</p>
      </div>
    </div>
  );
};
