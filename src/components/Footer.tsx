// src/components/Footer.tsx
import type { FC } from 'react';

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto">
      <div className="container mx-auto text-center">
        <p>&copy; {currentYear} Pasar Desa Digital. All rights reserved.</p>
        <p className="text-sm text-gray-400 mt-1">
          Dibuat oleh Mahasiswa KKN
        </p>
      </div>
    </footer>
  );
};

export default Footer;