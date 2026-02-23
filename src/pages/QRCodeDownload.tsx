import { QRCodeCanvas } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const TARGET_URL = 'https://clinicaldashboard.lovable.app/ania2026';

const QRCodeDownload = () => {
  const handleDownload = () => {
    const canvas = document.querySelector('#ania-qr canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'ania2026-qr-code.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-2xl font-bold text-foreground">ANIA 2026 QR Code</h1>
      <p className="text-sm text-muted-foreground max-w-md text-center">
        Scan or right-click to save. Links to:<br />
        <code className="text-xs bg-muted px-2 py-1 rounded mt-1 inline-block">{TARGET_URL}</code>
      </p>
      <div id="ania-qr" className="bg-white p-6 rounded-2xl shadow-lg">
        <QRCodeCanvas
          value={TARGET_URL}
          size={400}
          level="H"
          marginSize={2}
        />
      </div>
      <Button onClick={handleDownload} className="gap-2">
        <Download className="w-4 h-4" />
        Download PNG
      </Button>
    </div>
  );
};

export default QRCodeDownload;
