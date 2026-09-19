"use client";

import { Check, Clipboard, RotateCcw } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { initiatives, services } from "@/content/site";

type Brief = {
  name: string;
  contact: string;
  projectType: string;
  timeline: string;
  budget: string;
  description: string;
};

const baseBrief: Brief = {
  name: "",
  contact: "",
  projectType: "",
  timeline: "",
  budget: "",
  description: "",
};

const projectTypes = [
  ...services.map((service) => service.title),
  ...initiatives.map((initiative) => initiative.label),
  "综合项目",
  "其他",
];

type ContactBriefProps = {
  initialTopic?: string;
};

export function ContactBrief({ initialTopic = "" }: ContactBriefProps) {
  const initialBrief = {
    ...baseBrief,
    projectType: projectTypes.includes(initialTopic) ? initialTopic : "",
  };
  const [brief, setBrief] = useState(initialBrief);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const summary = useMemo(
    () => [
      "晴蛙视觉合作简报",
      `称呼：${brief.name}`,
      `联系方式：${brief.contact}`,
      `项目类型：${brief.projectType}`,
      `期望时间：${brief.timeline || "待讨论"}`,
      `预算范围：${brief.budget || "待讨论"}`,
      `项目说明：${brief.description}`,
    ].join("\n"),
    [brief],
  );

  function update(field: keyof Brief, value: string) {
    setBrief((current) => ({ ...current, [field]: value }));
    setSubmitted(false);
    setCopied(false);
    setError("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!brief.name.trim() || !brief.contact.trim() || !brief.projectType || !brief.description.trim()) {
      setError("请填写称呼、联系方式、项目类型和项目说明。完成后即可生成合作简报。");
      return;
    }
    setError("");
    setSubmitted(true);
  }

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
    } catch {
      setError("浏览器未允许复制。请手动选择下方简报内容。 ");
    }
  }

  function reset() {
    setBrief(initialBrief);
    setSubmitted(false);
    setCopied(false);
    setError("");
  }

  return (
    <div className="contact-brief">
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <label>
            <span>你的称呼 *</span>
            <input value={brief.name} onChange={(event) => update("name", event.target.value)} autoComplete="name" />
          </label>
          <label>
            <span>联系方式 *</span>
            <input
              value={brief.contact}
              onChange={(event) => update("contact", event.target.value)}
              placeholder="邮箱、电话或微信"
              autoComplete="email"
            />
          </label>
          <label>
            <span>项目类型 *</span>
            <select value={brief.projectType} onChange={(event) => update("projectType", event.target.value)}>
              <option value="">请选择</option>
              {projectTypes.map((projectType) => <option key={projectType}>{projectType}</option>)}
            </select>
          </label>
          <label>
            <span>期望时间</span>
            <input value={brief.timeline} onChange={(event) => update("timeline", event.target.value)} placeholder="例如：2026 年 10 月" />
          </label>
          <label>
            <span>预算范围</span>
            <select value={brief.budget} onChange={(event) => update("budget", event.target.value)}>
              <option value="">待讨论</option>
              <option>¥10,000 以下</option>
              <option>¥10,000 - ¥30,000</option>
              <option>¥30,000 - ¥80,000</option>
              <option>¥80,000 以上</option>
            </select>
          </label>
          <label className="form-description">
            <span>项目说明 *</span>
            <textarea
              value={brief.description}
              onChange={(event) => update("description", event.target.value)}
              rows={7}
              placeholder="你希望解决什么问题？项目会出现在哪里？最重要的交付是什么？"
            />
          </label>
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="brief-submit" type="submit">生成合作简报</button>
      </form>

      {submitted && (
        <section className="brief-result" aria-live="polite">
          <div>
            <p>简报已生成</p>
            <h2>下一步，把它发给晴蛙视觉。</h2>
          </div>
          <pre tabIndex={0}>{summary}</pre>
          <div className="brief-actions">
            <button type="button" onClick={copySummary}>
              {copied ? <Check aria-hidden="true" /> : <Clipboard aria-hidden="true" />}
              {copied ? "已复制" : "复制简报"}
            </button>
            <button type="button" onClick={reset}>
              <RotateCcw aria-hidden="true" />
              重新填写
            </button>
          </div>
          <p className="channel-note">复制简报后，请在下方联系目录中选择合适的城市、电话或邮箱发送。</p>
        </section>
      )}
    </div>
  );
}
