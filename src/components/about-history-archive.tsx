import { historyBookletTexts } from "@/content/about-history";

export function AboutHistoryArchive() {
  return (
    <div className="about-history-archive" aria-label="企业简介文字资料">
      <div className="about-history-archive-heading">
        <span>BOOKLET / NOTES</span>
        <h3>企业简介</h3>
      </div>
      <div className="about-history-archive-list">
        {historyBookletTexts.map((record) => (
          <article className="about-history-archive-item" key={record.pageRange}>
            <h4>{record.title}</h4>
            <p>{record.lead}</p>
            <ul>
              {record.points.map((point) => <li key={point}>{point}</li>)}
            </ul>
            <small>{record.verificationNote}</small>
          </article>
        ))}
      </div>
    </div>
  );
}
