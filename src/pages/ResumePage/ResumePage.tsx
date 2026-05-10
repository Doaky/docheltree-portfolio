import { useEffect } from 'react';

export default function ResumePage() {
  useEffect(() => {
    window.location.replace('/resume.pdf');
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'monospace', color: '#a8c8b4', background: '#0d1f16' }}>
      Opening resume…&nbsp;<a href="/resume.pdf" style={{ color: '#4ade80' }}>Click here if it doesn't open.</a>
    </div>
  );
}
