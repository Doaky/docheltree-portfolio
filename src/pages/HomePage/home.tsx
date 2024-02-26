import styles from './home.module.scss';

function Home () {
  return (
    <main>
      <header className={styles.s}>
        <h2>Daniel Ocheltree</h2>
        <img src={require('../../assets/profile.webp')} alt="profile picture" width="294" height="392" />
      </header>

      <article>
        <section className={styles.info}>
          <i className={styles.position}>Senior Software Engineer.</i>
          <i className="{styles.location}">McLean, VA</i>
          <br />
          <a className={styles.email} href="mailto:danielocheltree@gmail.com">
            danielocheltree@gmail.com
          </a>
        </section>
        <section className={styles.biography}>
          <p>
            Virginia Tech Class of 2019 // Computer Science Major // Software
            Developer at Capital One
            <br /> <br />I enjoy camping, listening to music, embroidering, and
            tinkering.
          </p>
        </section>
        <section className={styles.links}>
          <ul>
            <li>
              <label>LinkedIn</label>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.linkedin.com/in/ocheltreedaniel/"
              >
                @ocheltreedaniel
              </a>
            </li>
            <li>
              <label>Resume</label>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="/assets/daniel_ocheltree_resume.pdf"
              >
                /resume
              </a>
            </li>
            <li>
              <label>Projects</label>
              <a href='/projects'>/projects</a>
            </li>
          </ul>
        </section>
      </article>
    </main>
  );
}

export default Home;
