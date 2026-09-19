"use client";

import { motion, useReducedMotion } from "motion/react";

export const historyEvents = [
  {
    year: "2010",
    type: "起点",
    title: "青蛙设计组 / 晴蛙工作室",
    description: "画册页记录的晴蛙视觉早期工作起点。",
  },
  {
    year: "2014",
    type: "主体",
    title: "云南晴蛙文化传播有限公司",
    description: "画册页记录的公司主体节点。",
  },
  {
    year: "2016",
    type: "主体",
    title: "武汉晴蛙文化传播有限公司",
    description: "画册页记录的公司主体节点。",
  },
  {
    year: "2021",
    type: "主体",
    title: "武汉晴蛙视觉科技有限公司",
    description: "晴蛙视觉现有公司主体之一。",
  },
  {
    year: "2022",
    type: "主体",
    title: "武汉晴蛙设计工程有限公司",
    description: "晴蛙视觉现有公司主体之一。",
  },
  {
    year: "2023",
    type: "主体",
    title: "广州晴蛙传媒科技有限公司",
    description: "画册页记录的公司主体节点。",
  },
  {
    year: "2023",
    type: "认定记录",
    title: "科技型企业认定记录",
    description: "画册页在该年份标注了国家高新技术企业与国家级科技型中小企业相关记录。",
  },
  {
    year: "2024",
    type: "认定记录",
    title: "武汉晴蛙设计相关认定记录",
    description: "画册页标注了国家高新技术企业与科技型中小企业相关记录，准确主体与证明文件仍待逐项核验。",
  },
  {
    year: "2025",
    type: "许可记录",
    title: "广播电视节目制作经营许可证",
    description: "画册页标注的许可节点，证照编号、主体与当前状态仍需核验。",
  },
] as const;

export function AboutHistoryTimeline() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="about-history-timeline"
      role="region"
      aria-label="晴蛙视觉发展历程时间轴"
      tabIndex={0}
    >
      <div className="history-timeline-frame">
        <div className="history-timeline-canvas">
          <div className="history-timeline-track" aria-hidden="true">
            <motion.span
              initial={reduceMotion ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: reduceMotion ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          <div className="history-timeline-events">
            {historyEvents.map((event, index) => (
              <motion.article
                className="history-timeline-event"
                key={`${event.year}-${event.title}`}
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : index * 0.06, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="history-timeline-card">
                  <div className="history-timeline-meta">
                    <time dateTime={event.year}>{event.year}</time>
                    <span>{event.type}</span>
                  </div>
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                </div>
                <span className="history-timeline-marker" aria-hidden="true" />
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
