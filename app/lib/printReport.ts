// Branded printable report: opens a print-ready window with the SEOShouts
// header/footer wrapped around tool-supplied HTML. The browser's print dialog
// handles PDF output — no PDF library, works in every browser.

export function openBrandedReport(opts: {
  toolName: string
  subjectUrl?: string
  bodyHtml: string
}) {
  const win = window.open('', '_blank', 'width=900,height=700')
  if (!win) return // popup blocked — nothing else to do

  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  win.document.write(`<!DOCTYPE html>
<html>
<head>
<title>${esc(opts.toolName)} Report — SEOShouts</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; color: #111; padding: 32px; font-size: 13px; line-height: 1.55; }
  .rpt-head { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #2563EB; padding-bottom: 14px; margin-bottom: 20px; }
  .rpt-brand { font-size: 20px; font-weight: 800; letter-spacing: -0.5px; }
  .rpt-brand span { color: #2563EB; }
  .rpt-meta { text-align: right; font-size: 11px; color: #555; }
  .rpt-title { font-size: 16px; font-weight: 700; margin-bottom: 4px; }
  .rpt-url { font-size: 12px; color: #2563EB; word-break: break-all; margin-bottom: 18px; }
  h2 { font-size: 14px; margin: 18px 0 8px; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
  table { width: 100%; border-collapse: collapse; margin: 8px 0 14px; }
  th, td { border: 1px solid #ccc; padding: 6px 9px; text-align: left; font-size: 12px; }
  th { background: #f3f4f6; font-weight: 700; }
  .good { color: #059669; font-weight: 700; } .warn { color: #d97706; font-weight: 700; } .bad { color: #dc2626; font-weight: 700; }
  .score-big { font-size: 40px; font-weight: 800; color: #2563EB; }
  .rpt-foot { margin-top: 28px; border-top: 1px solid #ddd; padding-top: 10px; font-size: 10px; color: #777; display: flex; justify-content: space-between; }
  @media print { body { padding: 12px; } .no-print { display: none; } }
</style>
</head>
<body>
  <div class="rpt-head">
    <div class="rpt-brand">SEO<span>Shouts</span></div>
    <div class="rpt-meta">Generated ${esc(date)}<br/>seoshouts.com/tools/</div>
  </div>
  <div class="rpt-title">${esc(opts.toolName)} Report</div>
  ${opts.subjectUrl ? `<div class="rpt-url">${esc(opts.subjectUrl)}</div>` : ''}
  ${opts.bodyHtml}
  <div class="rpt-foot">
    <span>Free SEO tools by SEOShouts — every number is real or clearly labeled as an estimate.</span>
    <span>seoshouts.com</span>
  </div>
  <div class="no-print" style="margin-top:20px;text-align:center;">
    <button onclick="window.print()" style="padding:10px 28px;background:#2563EB;color:#fff;border:none;font-size:14px;font-weight:700;cursor:pointer;">Print / Save as PDF</button>
  </div>
</body>
</html>`)
  win.document.close()
}
