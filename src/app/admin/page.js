"use client";
import { useState, useEffect } from 'react';
import styles from './admin.module.css';

export default function AdminPage() {
    const [data, setData] = useState({
        hero: { title: '', subtitle: '', description: '', email: '', linkedin: '' },
        experiences: [],
        skills: []
    });
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');

    useEffect(() => {
        fetch('/api/content')
            .then(res => res.json())
            .then(json => {
                setData(json);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setStatus('Error loading data');
                setLoading(false);
            });
    }, []);

    const handleChange = (section, field, value) => {
        setData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleExperienceChange = (index, field, value) => {
        const newExperiences = [...data.experiences];
        newExperiences[index] = { ...newExperiences[index], [field]: value };
        setData(prev => ({ ...prev, experiences: newExperiences }));
    };

    const addExperience = () => {
        setData(prev => ({
            ...prev,
            experiences: [...prev.experiences, { title: '', description: '', repoLink: '#', blogLink: '#', liveLink: '#', extraText: '', extraImage: '' }]
        }));
    };

    const removeExperience = (index) => {
        const newExperiences = data.experiences.filter((_, i) => i !== index);
        setData(prev => ({ ...prev, experiences: newExperiences }));
    };

    const handleSkillChange = (index, value) => {
        const newSkills = [...data.skills];
        newSkills[index] = value;
        setData(prev => ({ ...prev, skills: newSkills }));
    };

    const addSkill = () => {
        setData(prev => ({ ...prev, skills: [...prev.skills, ''] }));
    };

    const removeSkill = (index) => {
        const newSkills = data.skills.filter((_, i) => i !== index);
        setData(prev => ({ ...prev, skills: newSkills }));
    };

    const handleSave = async () => {
        setStatus('Saving...');
        try {
            const res = await fetch('/api/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                setStatus('Saved successfully!');
                setTimeout(() => setStatus(''), 3000);
            } else {
                setStatus('Failed to save.');
            }
        } catch (e) {
            setStatus('Error saving.');
        }
    };

    const handleUpload = async (e, section, index = null) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const json = await res.json();

            if (res.ok) {
                if (section === 'hero') {
                    handleChange('hero', 'image', json.url);
                } else if (section === 'experiences' && index !== null) {
                    handleExperienceChange(index, 'image', json.url);
                } else if (section === 'experiences-extra' && index !== null) {
                    handleExperienceChange(index, 'extraImage', json.url);
                }
            } else {
                alert('Upload failed');
            }
        } catch (err) {
            console.error(err);
            alert('Upload error');
        }
    };

    if (loading) return <div className={styles.container}>Loading...</div>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Portfolio Admin</h1>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Hero Section</h2>
                <div className={styles.field}>
                    <label className={styles.label}>Profile Image</label>
                    {data.hero.image && <img src={data.hero.image} alt="Profile Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%', marginBottom: '10px' }} />}
                    <input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'hero')} />
                </div>
                <div className={styles.field}>
                    <label className={styles.label}>Title</label>
                    <input className={styles.input} value={data.hero.title} onChange={e => handleChange('hero', 'title', e.target.value)} />
                </div>
                <div className={styles.field}>
                    <label className={styles.label}>Subtitle</label>
                    <input className={styles.input} value={data.hero.subtitle} onChange={e => handleChange('hero', 'subtitle', e.target.value)} />
                </div>
                <div className={styles.field}>
                    <label className={styles.label}>Description</label>
                    <textarea className={styles.textarea} value={data.hero.description} onChange={e => handleChange('hero', 'description', e.target.value)} />
                </div>
                <div className={styles.field}>
                    <label className={styles.label}>Email</label>
                    <input className={styles.input} value={data.hero.email} onChange={e => handleChange('hero', 'email', e.target.value)} />
                </div>
                <div className={styles.field}>
                    <label className={styles.label}>LinkedIn URL</label>
                    <input className={styles.input} value={data.hero.linkedin} onChange={e => handleChange('hero', 'linkedin', e.target.value)} />
                </div>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Experiences</h2>
                {data.experiences.map((exp, i) => (
                    <div key={i} className={styles.card}>
                        <div className={styles.field}>
                            <label className={styles.label}>Project Image</label>
                            {exp.image && <img src={exp.image} alt="Project Preview" style={{ width: '100px', height: '60px', objectFit: 'cover', marginBottom: '10px' }} />}
                            <input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'experiences', i)} />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Project Title</label>
                            <input className={styles.input} value={exp.title} onChange={e => handleExperienceChange(i, 'title', e.target.value)} />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Description</label>
                            <textarea className={styles.textarea} value={exp.description} onChange={e => handleExperienceChange(i, 'description', e.target.value)} />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Repo Link</label>
                            <input className={styles.input} value={exp.repoLink} onChange={e => handleExperienceChange(i, 'repoLink', e.target.value)} />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Blog Link</label>
                            <input className={styles.input} value={exp.blogLink} onChange={e => handleExperienceChange(i, 'blogLink', e.target.value)} />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Live Link</label>
                            <input className={styles.input} value={exp.liveLink} onChange={e => handleExperienceChange(i, 'liveLink', e.target.value)} />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Extra Section - Text (Italic)</label>
                            <input className={styles.input} value={exp.extraText || ''} onChange={e => handleExperienceChange(i, 'extraText', e.target.value)} />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Extra Section - Image/Icon</label>
                            {exp.extraImage && <img src={exp.extraImage} alt="Extra Preview" style={{ width: '24px', height: '24px', objectFit: 'contain', marginBottom: '10px' }} />}
                            <input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'experiences-extra', i)} />
                        </div>
                        <button className={styles.removeButton} onClick={() => removeExperience(i)}>Remove Experience</button>
                    </div>
                ))}
                <button className={styles.button} onClick={addExperience} style={{ background: '#28a745' }}>+ Add Experience</button>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Skills</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {data.skills.map((skill, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <input className={styles.input} style={{ width: '150px' }} value={skill} onChange={e => handleSkillChange(i, e.target.value)} />
                            <button className={styles.removeButton} style={{ marginTop: 0, padding: '0.5rem' }} onClick={() => removeSkill(i)}>X</button>
                        </div>
                    ))}
                </div>
                <button className={styles.button} onClick={addSkill} style={{ display: 'block', marginTop: '1rem', background: '#28a745' }}>+ Add Skill</button>
            </section>

            <button className={styles.button} onClick={handleSave}>Save Changes</button>
            {status && <p className={status.includes('Error') || status.includes('Failed') ? styles.error : styles.success}>{status}</p>}
        </div>
    );
}
