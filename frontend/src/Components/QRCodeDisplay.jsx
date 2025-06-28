export default function QRCodeDisplay({ code }) {
  const qrUrl = `http://localhost:8000/qrcode?code=${code}`;

  return (
    <div className="mt-4">
      <img src={qrUrl} alt="QR Code" className="w-48 h-48 mx-auto" />
    </div>
  );
}
