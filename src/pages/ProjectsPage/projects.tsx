import styles from './projects.module.scss';

function Projects () {
  return (

    <main className={styles.main}>
        <div className={styles.multiHeader}>
            <h1>projects</h1>
            <h1>projects</h1>
            <h1>projects</h1>
        </div>

        <div>
            <a href="/">back to home</a>
        </div>

        <div className={styles.projectEntriesWrapper}>
            <div className={styles.projectGroupTitleWrapper}>
                <h2 className={styles.projectGroupTitle}>Web Apps</h2>
            </div>
            <section className={styles.projectGroup}>
                <a className={styles.projectCard} href="projects/kelly-pool">
                    <h3 className={styles.projectCardTitle}>Kelly Pool</h3>
                    <p className={styles.projectCard__description}>Number generator for Kelly Pool</p>
                    <img className={styles.projectCard__image} />
                </a>
                <a className={styles.projectCard} href="projects/tip-trainer">
                    <h3 className={styles.projectCard__title}>Tip Trainer</h3>
                    <p className={styles.projectCard__description}></p>
                    <img className={styles.projectCard__image} />
                </a>
                <a className={styles.projectCard} href="projects/tip-trainer">
                    <h3 className={styles.projectCard__title}>Homepage</h3>
                    <p className={styles.projectCard__description}></p>
                    <img className={styles.projectCard__image} />
                </a>
            </section>
        </div>

        <div className={styles.projectEntriesWrapper}>
            <div className={styles.projectGroupTitleWrapper}>
                <h2 className={styles.projectGroupTitle}>Doodles</h2>
            </div>
            <section className={styles.projectGroup}>
                <a className={styles.projectCard} href="projects/kelly-pool">
                    <h3 className={styles.projectCardTitle}>Hyperion</h3>
                    <p className={styles.projectCard__description}>Number generator for Kelly Pool</p>
                    <img className={styles.projectCard__image} />
                </a>
                <a className={styles.projectCard} href="projects/tip-trainer">
                    <h3 className={styles.projectCard__title}>Tip Trainer</h3>
                    <p className={styles.projectCard__description}></p>
                    <img className={styles.projectCard__image} />
                </a>
                <a className={styles.projectCard} href="projects/tip-trainer">
                    <h3 className={styles.projectCard__title}>Tip Trainer</h3>
                    <p className={styles.projectCard__description}></p>
                    <img className={styles.projectCard__image} />
                </a>
                <a className={styles.projectCard} href="projects/tip-trainer">
                    <h3 className={styles.projectCard__title}>Tip Trainer</h3>
                    <p className={styles.projectCard__description}></p>
                    <img className={styles.projectCard__image} />
                </a>
                <a className={styles.projectCard} href="projects/tip-trainer">
                    <h3 className={styles.projectCard__title}>Tip Trainer</h3>
                    <p className={styles.projectCard__description}></p>
                    <img className={styles.projectCard__image} />
                </a>
            </section>
        </div>

        <div className={styles.projectEntriesWrapper}>
            <div className={styles.projectGroupTitleWrapper}>
                <h2 className={styles.projectGroupTitle}>Stitching</h2>
            </div>
            <section className={styles.projectGroup}>
                <a className={styles.projectCard} href="projects/kelly-pool">
                    <h3 className={styles.projectCardTitle}>Kelly Pool</h3>
                    <p className={styles.projectCard__description}>Number generator for Kelly Pool</p>
                    <img className={styles.projectCard__image} />
                </a>
                <a className={styles.projectCard} href="projects/tip-trainer">
                    <h3 className={styles.projectCard__title}>Tip Trainer</h3>
                    <p className={styles.projectCard__description}></p>
                    <img className={styles.projectCard__image} />
                </a>
            </section>
        </div>

        <div className={styles.projectEntriesWrapper}>
            <div className={styles.projectGroupTitleWrapper}>
                <h2 className={styles.projectGroupTitle}>Tinkering</h2>
            </div>
            <section className={styles.projectGroup}>
                <a className={styles.projectCard} href="projects/kelly-pool">
                    <h3 className={styles.projectCardTitle}>Hyperion</h3>
                    <p className={styles.projectCard__description}>Number generator for Kelly Pool</p>
                    <img className={styles.projectCard__image} />
                </a>
                <a className={styles.projectCard} href="projects/tip-trainer">
                    <h3 className={styles.projectCard__title}>Tip Trainer</h3>
                    <p className={styles.projectCard__description}></p>
                    <img className={styles.projectCard__image} />
                </a>
            </section>
        </div>
    </main>
  );
}

export default Projects;
