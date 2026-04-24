import { Link } from 'react-router-dom';
import styles from './HomeClean.module.scss';
import profileImg from '../../assets/pfp.webp';
import nameAnimation from '../../assets/name_animation.webp';
import SEO from '../../components/SEO/SEO';
import RotatingTagline from './RotatingTagline';
import { useGrain } from '../../hooks/useGrain';

export default function Home() {
  useGrain();

  return (
    <main className={styles.home}>
      <SEO title="Daniel Ocheltree" description="Software Engineer and tinkerer. I build things for the web and for fun." />

      <section className={styles['home__hero']}>
        <img
          src={nameAnimation}
          alt="Daniel Ocheltree"
          className={styles['home__name-animation']}
          width="850"
          height="161"
        />
        {/* <div className={styles['home__divider']} aria-hidden="true">╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌</div> */}
      </section>

      <section className={styles['home__content']}>
        <figure className={styles['home__photo-frame']} aria-label="Profile photo">
          <span className={styles['home__frame-corner']} aria-hidden="true">
            {"╔══╗ <img src=\"pfp.webp\""}
          </span>
          <img src={profileImg} alt="Daniel Ocheltree" className={styles['home__profile-img']} />
          <span className={`${styles['home__frame-corner']} ${styles['home__frame-corner--bottom-right']}`} aria-hidden="true">alt="Daniel Ocheltree"/&gt; ╚══╝</span>
        </figure>

        <div className={styles['home__bio']}>
          <div className={styles['home__section']}>
            <span className={styles['home__section-label']} aria-hidden="true">
              {"<!-- about -->"}
            </span>
            <div className={styles['home__info-row']}>
              <span className={styles['home__info-key']}>role</span>
              <span>Senior Software Engineer</span>
            </div>
            <div className={styles['home__info-row']}>
              <span className={styles['home__info-key']}>loc</span>
              <span>McLean, VA</span>
            </div>
            <div className={styles['home__info-row']}>
              <span className={styles['home__info-key']}>org</span>
              <span>Capital One</span>
            </div>
            <div className={styles['home__info-row']}>
              <span className={styles['home__info-key']}>edu</span>
              <span>Virginia Tech, CS &apos;19</span>
            </div>
          </div>

          <div className={styles['home__section']}>
            <span className={styles['home__section-label']} aria-hidden="true">
              {"<!-- bio -->"}
            </span>
            <p className={styles['home__blurb']}>
              I build things for the web and for fun. Enjoy tinkering, the outdoors, and going down rabbit holes to fix self-created problems.
            </p>
          </div>

          <div className={styles['home__section']}>
            <span className={styles['home__section-label']} aria-hidden="true">
              {"<!-- links -->"}
            </span>
            <ul className={styles['home__links']}>
              <li className={styles['home__link-item']}>
                <label className={styles['home__link-label']}>linkedin</label>
                <a className={styles['home__link-anchor']} target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/ocheltreedaniel/">
                  @ocheltreedaniel
                </a>
              </li>
              <li className={styles['home__link-item']}>
                <label className={styles['home__link-label']}>email</label>
                <a className={styles['home__link-anchor']} href="mailto:danielocheltree+website@gmail.com">
                  @gmail.com
                </a>
              </li>
              <li className={styles['home__link-item']}>
                <label className={styles['home__link-label']}>resume</label>
                <Link className={styles['home__link-anchor']} to="/resume">/resume.pdf</Link>
              </li>
              <li className={styles['home__link-item']}>
                <label className={styles['home__link-label']}>projects</label>
                <Link className={styles['home__link-anchor']} to="/projects">/projects</Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <RotatingTagline
          className={styles['home__tagline']}
          visibleClass={styles['home__tagline--visible']}
          hiddenClass={styles['home__tagline--hidden']}
        />
    </main>
  );
}
