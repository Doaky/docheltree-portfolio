import { useEffect } from 'react';

export default function ResumePage() {
  useEffect(() => {
    window.location.replace('/resume.pdf');
  }, []);
  return null;
}
