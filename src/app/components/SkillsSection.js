import styles from './skills.module.css';

export default function SkillsSection({ skills = [] }) {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <h2 className={styles.title}>Skills & Technologies</h2>
                <div className={styles.grid}>
                    {skills.map((skill, index) => (
                        <div key={index} className={styles.card}>
                            {skill}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
