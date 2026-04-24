import { useEffect, useMemo, useState } from 'react';
import { TAGLINES } from './taglines';

interface RotatingTaglineProps {
  className?: string;
  visibleClass?: string;
  hiddenClass?: string;
}

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function RotatingTagline({ className, visibleClass, hiddenClass }: RotatingTaglineProps) {
  const order = useMemo(() => shuffled(TAGLINES), []);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex(prev => (prev + 1) % order.length);
        setVisible(true);
      }, 350);
    }, 4000);

    return () => clearInterval(interval);
  }, [order.length]);

  const fadeClass = visible ? visibleClass : hiddenClass;

  return (
    <p className={`${className ?? ''} ${fadeClass ?? ''}`.trim()}>
      {order[index]}
    </p>
  );
}
