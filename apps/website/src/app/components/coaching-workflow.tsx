import React from 'react';
import clsx from 'clsx';
import styles from './coaching-workflow.module.scss';

export interface WorkflowStep {
  tag: string;
  title: string;
  description: string;
}

export interface CoachingWorkflowProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  steps: WorkflowStep[];
  className?: string;
}

export default function CoachingWorkflow({
  eyebrow,
  title,
  subtitle,
  steps,
  className,
}: CoachingWorkflowProps) {
  return (
    <div className={clsx(styles.wrapper, className)} aria-label={title}>
      {/* Section Header */}
      <div className={styles.header}>
        <h2 className={styles.eyebrow}>{eyebrow}</h2>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      {/* Desktop Git Source Tree (Horizontal Pipeline) */}
      <div className={styles.desktopTree} aria-hidden="true">
        <div className={styles.desktopPipeline}>
          <div className={styles.desktopTrackLine} />
          {steps.map((step, idx) => (
            <div key={`desktop-step-${idx}`} className={styles.desktopStepItem}>
              {/* Git commit node / dot */}
              <div className={styles.nodeWrapper}>
                <span className={styles.nodeDot} />
              </div>
              {/* Step info: tag, title, description underneath */}
              <div className={styles.stepContent}>
                <span className={styles.stepTag}>{step.tag}</span>
                <h4 className={styles.stepTitle}>{step.title}</h4>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile & Tablet Git Source Tree (Vertical Branch) */}
      <div className={styles.mobileTree}>
        <ol className={styles.mobileTimeline}>
          <div className={styles.mobileTrackLine} aria-hidden="true" />
          {steps.map((step, idx) => (
            <li key={`mobile-step-${idx}`} className={styles.mobileStepItem}>
              {/* Git commit node / dot */}
              <div className={styles.mobileNodeWrapper} aria-hidden="true">
                <span className={styles.nodeDot} />
              </div>
              {/* Step info: tag, title, description underneath */}
              <div className={styles.mobileStepContent}>
                <span className={styles.stepTag}>{step.tag}</span>
                <h4 className={styles.stepTitle}>{step.title}</h4>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export { CoachingWorkflow };
