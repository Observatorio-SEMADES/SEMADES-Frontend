import React from "react";
import "../../styles/SourceMeta.css";

export function SourceDisclosure({ sources }) {
  if (!sources?.length) return null;

  return (
    <details className="source-meta-disclosure">
      <summary>Fontes</summary>
      <ul>
        {sources.map((source) => (
          <li key={source.url}>
            <a href={source.url} target="_blank" rel="noopener noreferrer">
              {source.label}
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}

export default function SourceMeta({ rows, period, unit, note, collapsibleSources = false }) {
  if (!rows.length) return null;
  const sources = [...new Map(rows.map((row) => [row.fonte_url, { url: row.fonte_url, label: row.fonte || row.fonte_aba || "Planilha de origem" }])).values()];
  const dates = [...new Set(rows.map((row) => row.data_extracao))];
  return (
    <div className="source-meta">
      <span><b>Território:</b> {rows[0].territorio}</span>
      <span><b>Período:</b> {period}</span>
      <span><b>Unidade:</b> {unit}</span>
      <span><b>Extração:</b> {dates.map((date) => date.split("-").reverse().join("/")).join(", ")}</span>
      <span>
        {collapsibleSources ? <SourceDisclosure sources={sources} /> : <><b>Fonte:</b> {sources.map((source, i) => <React.Fragment key={source.url}>{i > 0 && ", "}<a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a></React.Fragment>)}</>}
      </span>
      {note && <span className="source-meta-note">{note}</span>}
    </div>
  );
}
