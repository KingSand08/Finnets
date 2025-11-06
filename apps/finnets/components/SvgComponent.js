import { headers } from 'next/headers';

const QUOTE = `['"]`;
const attr = (name) =>
  new RegExp(`${name}\\s*=\\s*${QUOTE}([^'"]+)${QUOTE}`, 'i');

function parseSvg(svg) {
  const viewBoxMatch = svg.match(attr('viewBox'));
  const viewBox =
    viewBoxMatch?.[1] ??
    (() => {
      const w = svg.match(attr('width'))?.[1];
      const h = svg.match(attr('height'))?.[1];
      const wNum = w ? parseFloat(w.replace('%', '')) : NaN;
      const hNum = h ? parseFloat(h.replace('%', '')) : NaN;
      return Number.isFinite(wNum) && Number.isFinite(hNum)
        ? `0 0 ${wNum} ${hNum}`
        : undefined;
    })();

  const paths = [];
  const pathTagRe = /<path\b[^>]*>/gi;
  const dRe = attr('d');
  const frRe = attr('fill-rule');
  const frCamelRe = attr('fillRule');
  const tfRe = attr('transform');
  const fillRe = attr('fill');

  let m;
  while ((m = pathTagRe.exec(svg))) {
    const tag = m[0];
    const d = tag.match(dRe)?.[1];
    if (!d) continue;
    paths.push({
      d,
      fillRule: tag.match(frRe)?.[1] || tag.match(frCamelRe)?.[1] || 'nonzero',
      transform: tag.match(tfRe)?.[1],
      origFill: tag.match(fillRe)?.[1] || null,
    });
  }

  return { viewBox, paths };
}

async function readSvgText(src) {
  if (/^https?:\/\//i.test(src)) {
    const res = await fetch(src, { cache: 'force-cache' });
    if (!res.ok) throw new Error(`Failed to fetch SVG: ${res.status} ${src}`);
    return res.text();
  }
  if (src.startsWith('/')) {
    const h = await headers();
    const host =
      h.get?.('x-forwarded-host') ??
      h.get?.('host') ??
      process.env.VERCEL_URL ??
      'localhost:3000';
    const proto =
      h.get?.('x-forwarded-proto') ??
      (process.env.VERCEL_URL ? 'https' : 'http');
    const url = `${proto}://${host}${src}`;
    const res = await fetch(url, { cache: 'force-cache' });
    if (!res.ok) throw new Error(`Failed to fetch SVG from ${src}`);
    return res.text();
  }
  throw new Error(
    'Unsupported src: use an absolute URL or a path starting with "/".'
  );
}

const SvgComponent = async ({
  src,
  width = '100%',
  height = '100%',
  title,
  fill,
  className,
  ariaLabel,
  ...rest
}) => {
  const svgText = await readSvgText(src);
  const { viewBox, paths } = parseSvg(svgText);

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={width}
      height={height}
      viewBox={viewBox}
      className={className}
      aria-label={ariaLabel || title}
      role={title ? 'img' : 'presentation'}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {paths.map((p, i) => (
        <path
          key={i}
          d={p.d}
          transform={p.transform || undefined}
          fillRule={p.fillRule}
          fill={fill ?? p.origFill ?? undefined}
        />
      ))}
    </svg>
  );
};

export default SvgComponent;
