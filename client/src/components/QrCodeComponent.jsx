import React from "react";
import { QRCodeCanvas } from "qrcode.react";

const QRCodeComponent = () => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl mb-4 font-bold">Scan to Register</h2>
      <QRCodeCanvas value="http://localhost:5173/visitorForm" size={200} />
    </div>
  );
};

export default QRCodeComponent;
