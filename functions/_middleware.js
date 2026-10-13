// Brand the static HTML per hostname BEFORE any script runs, so text-message link previews (which read <title> / og tags
// without running JavaScript) show the right business. Oct 13 2026 (Kenny): previews said "Rover Cleaners" for both brands.
// The page's own script still brands the visible page; this only fixes what crawlers and link previews see.
const BRANDS = {
  'review.rovercleaningserviceschicago.com': 'Rover Cleaning Services Chicago',
  'review.pinecleaningtx.com': 'Pine Cleaning Services',
};

export async function onRequest(context) {
  const res = await context.next();
  const name = BRANDS[new URL(context.request.url).hostname];
  if (!name || !(res.headers.get('content-type') || '').includes('text/html')) return res;
  const title = `${name} — How'd We Do?`;
  return new HTMLRewriter()
    .on('title', { element(e) { e.setInnerContent(title); } })
    .on('head', { element(e) { e.append(`<meta property="og:title" content="${title}" />\n<meta property="og:site_name" content="${name}" />`, { html: true }); } })
    .on('.logo-name', { element(e) { e.setInnerContent(name); } })
    .on('.footer', { element(e) { e.setInnerContent('© ' + name); } })
    .transform(res);
}
