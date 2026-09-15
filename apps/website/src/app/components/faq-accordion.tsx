'use client';

import React, { useState } from 'react';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import styles from './faq-section.module.scss';

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqAccordionProps {
  items: FaqItem[];
  defaultOpenIndex?: number | null;
}

export default function FaqAccordion({
  items,
  defaultOpenIndex = 0,
}: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className={styles.accordionList} role="region" aria-label="FAQ Accordion">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        const answerId = `faq-answer-${idx}`;
        const questionId = `faq-question-${idx}`;

        return (
          <div
            key={`faq-item-${idx}`}
            className={clsx(styles.item, isOpen && styles.itemOpen)}
          >
            <button
              id={questionId}
              type="button"
              className={styles.questionButton}
              onClick={() => toggle(idx)}
              aria-expanded={isOpen}
              aria-controls={answerId}
            >
              <span>{item.question}</span>
              <ChevronDown
                size={20}
                className={clsx(styles.chevron, isOpen && styles.chevronOpen)}
                aria-hidden="true"
              />
            </button>

            {isOpen && (
              <div
                id={answerId}
                role="region"
                aria-labelledby={questionId}
                className={styles.answerWrapper}
              >
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export { FaqAccordion };
