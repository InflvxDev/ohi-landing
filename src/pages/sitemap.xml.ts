import type { APIRoute } from 'astro';

const lastModified = '2026-05-25';

const pages = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/quienes-somos', priority: '0.8', changefreq: 'monthly' },
  { path: '/historia', priority: '0.7', changefreq: 'monthly' },
  { path: '/sede-principal', priority: '0.9', changefreq: 'weekly' },
  { path: '/santa-isabel', priority: '0.9', changefreq: 'weekly' },
  { path: '/pqrs', priority: '0.6', changefreq: 'monthly' },
  { path: '/politicas/actualizacion-autorizacion-tratamiento-datos-personales', priority: '0.5', changefreq: 'yearly' },
  { path: '/politicas/pppss', priority: '0.5', changefreq: 'yearly' },
  { path: '/politicas/tratamiento-datos-personales', priority: '0.5', changefreq: 'yearly' },
];

export const GET: APIRoute = ({ site }) => {
  const siteUrl = new URL(import.meta.env.PUBLIC_SITE_URL ?? site ?? 'https://ohisalud.com');
  const urls = pages
    .map(({ path, priority, changefreq }) => {
      const loc = new URL(path, siteUrl).toString();

      return [
        '  <url>',
        `    <loc>${loc}</loc>`,
        `    <lastmod>${lastModified}</lastmod>`,
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        '  </url>',
      ].join('\n');
    })
    .join('\n');

  return new Response(
    [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      urls,
      '</urlset>',
      '',
    ].join('\n'),
    {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
      },
    },
  );
};