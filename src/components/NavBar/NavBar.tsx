import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './NavBar.module.scss';

interface NavBarProps {
  title: string;
  rightContent?: React.ReactNode;
  className?: string;
}

export default function NavBar({ title, rightContent, className }: NavBarProps) {
  const titleRef = useRef<HTMLSpanElement>(null);
  const [fits, setFits] = useState(true);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const check = () => setFits(el.scrollWidth <= el.clientWidth + 1);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [title]);

  return (
    <nav className={`${styles['nav-bar']}${className ? ` ${className}` : ''}`}>
      <div className={styles['nav-bar__inner']}>
        <Link to="/projects" className={styles['nav-bar__back-link']}>← projects</Link>
        <span ref={titleRef} className={styles['nav-bar__title']} style={{ opacity: fits ? 1 : 0 }}>
          {title}
        </span>
        {rightContent && <div className={styles['nav-bar__right']}>{rightContent}</div>}
      </div>
    </nav>
  );
}
