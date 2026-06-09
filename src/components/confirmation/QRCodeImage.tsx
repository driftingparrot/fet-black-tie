import QRCode from 'qrcode';

interface Props {
  qrSlug: string;
}

export default async function QRCodeImage({ qrSlug }: Props) {
  // The QR code encodes the scan URL that gatekeeper will scan
  const scanUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://fetblacktie.com'}/gatekeeper?qr=${qrSlug}`;

  const dataUrl = await QRCode.toDataURL(scanUrl, {
    width: 280,
    margin: 2,
    color: {
      dark: '#e8af0f', // gold
      light: '#1c1c28', // surface-2 background
    },
  });

  return (
    <div className="inline-flex flex-col items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={dataUrl}
        alt={`QR code for ticket ${qrSlug}`}
        width={280}
        height={280}
        className="rounded-xl"
      />
    </div>
  );
}
