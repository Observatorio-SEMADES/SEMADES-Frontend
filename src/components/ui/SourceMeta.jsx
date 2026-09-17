import React from "react";
import "../../styles/SourceMeta.css";

export default function SourceMeta({ rows, period, unit, note }) {
  if (!rows.length) return null;
  const sources = [...new Map(rows.map((row) => [row.fonte_url, { url: row.fonte_url, label: row.fonte || row.fonte_aba || "Planilha de origem" }])).values()];
  const dates = [...new Set(rows.map((row) => row.data_extracao))];
  return (
    <div className="source-meta">
      <span><b>Território:</b> {rows[0].territorio}</span>
      <span><b>Período:</b> {period}</span>
      <span><b>Unidade:</b> {unit}</span>
      <span><b>Extração:</b> {dates.map((date) => date.split("-").reverse().join("/")).join(", ")}</span>
      <span><b>Fonte:</b> {sources.map((source, i) => <React.Fragment key={source.url}>{i > 0 && ", "}<a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a></React.Fragment>)}</span>
      {note && <span className="source-meta-note">{note}</span>}
    </div>
  );
}
