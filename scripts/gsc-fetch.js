// Pulls Search Console query performance (clicks, impressions, CTR, position) as JSON.
// Usage: node scripts/gsc-fetch.js [days]
// Key file lives outside the repo (W: is docs/files only, per CLAUDE.md) — override with GSC_KEY_FILE if moved.
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const keyFile = process.env.GSC_KEY_FILE || 'W:/Personal Projects/seoshouts/Files/seoshouts-ddf884cd8b16.json';
const siteUrl = 'https://seoshouts.com/';
const days = parseInt(process.argv[2] || '90', 10);

function fmt(d) {
  return d.toISOString().slice(0, 10);
}

async function main() {
  if (!fs.existsSync(keyFile)) {
    console.error(`Key file not found: ${keyFile}`);
    process.exit(1);
  }

  const auth = new google.auth.GoogleAuth({
    keyFile,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });

  const searchconsole = google.searchconsole({ version: 'v1', auth });

  const end = new Date();
  end.setDate(end.getDate() - 3); // GSC data lags ~2-3 days
  const start = new Date(end);
  start.setDate(start.getDate() - days);

  const res = await searchconsole.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate: fmt(start),
      endDate: fmt(end),
      dimensions: ['query', 'page'],
      rowLimit: 25000,
      dataState: 'final',
    },
  });

  const rows = res.data.rows || [];
  const byPage = {};
  for (const row of rows) {
    const [query, page] = row.keys;
    (byPage[page] ||= []).push({
      query,
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: +(row.ctr * 100).toFixed(2),
      position: +row.position.toFixed(1),
    });
  }

  const outPath = path.join(__dirname, '..', 'gsc-data.json');
  fs.writeFileSync(outPath, JSON.stringify(byPage, null, 2));

  console.log(`Range: ${fmt(start)} to ${fmt(end)}`);
  console.log(`${rows.length} query/page rows -> ${outPath}\n`);

  const summary = Object.entries(byPage)
    .map(([page, qs]) => ({
      page,
      clicks: qs.reduce((s, q) => s + q.clicks, 0),
      impressions: qs.reduce((s, q) => s + q.impressions, 0),
      queries: qs.length,
    }))
    .sort((a, b) => b.clicks - a.clicks);

  for (const s of summary) {
    console.log(`${s.clicks}\tclicks  ${s.impressions}\timpr  ${s.queries}\tqueries  ${s.page}`);
  }
}

main().catch((err) => {
  console.error('GSC fetch failed:', err.errors || err.message);
  process.exit(1);
});
