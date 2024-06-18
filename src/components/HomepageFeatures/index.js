import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'À propos de Victor Gouin',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Je suis Victor Gouin, étudiant en Bac+4 spécialisé en administration
        systèmes et réseaux. Passionné par la technologie et toujours à la
        recherche de solutions innovantes pour optimiser et sécuriser les
        infrastructures réseau.
      </>
    ),
  },
  {
    title: 'Compétences Techniques',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Je maîtrise diverses technologies et outils, notamment la gestion des
        serveurs, la configuration des réseaux, et l'automatisation des tâches
        administratives. Mon expertise comprend Linux, Windows Server, et
        divers langages de scripting.
      </>
    ),
  },
  {
    title: 'Projets et Expériences',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        J'ai travaillé sur plusieurs projets académiques et professionnels
        visant à améliorer l'efficacité des systèmes informatiques. J'ai une
        expérience pratique en déploiement de réseaux sécurisés et en gestion
        de systèmes complexes.
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
