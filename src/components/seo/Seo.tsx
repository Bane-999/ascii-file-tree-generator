import {useEffect} from 'react';
import {siteSeo} from './seoConfig';

interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

const managedMetaSelectors = [
  'name="description"',
  'property="og:title"',
  'property="og:description"',
  'property="og:image"',
  'property="og:url"',
  'property="og:type"',
  'property="og:site_name"',
  'name="twitter:card"',
  'name="twitter:title"',
  'name="twitter:description"',
  'name="twitter:image"',
];

export function Seo({
  title = siteSeo.title,
  description = siteSeo.description,
  image = siteSeo.image,
  url = siteSeo.url,
  type = 'website',
}: SeoProps) {
  useEffect(() => {
    document.title = title;

    setMetaTag('name', 'description', description);
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', image);
    setMetaTag('property', 'og:url', url);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:site_name', siteSeo.siteName);
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', image);
  }, [description, image, title, type, url]);

  return null;
}

function setMetaTag(attribute: 'name' | 'property', key: string, content: string): void {
  const selector = `meta[${attribute}="${key}"]`;
  const tag = document.head.querySelector<HTMLMetaElement>(selector) ?? createMetaTag(attribute, key);
  tag.content = content;
}

function createMetaTag(attribute: 'name' | 'property', key: string): HTMLMetaElement {
  const tag = document.createElement('meta');
  tag.setAttribute(attribute, key);
  tag.dataset.managedBy = 'react-seo';
  document.head.appendChild(tag);
  return tag;
}

export function getManagedMetaSelectors(): string[] {
  return managedMetaSelectors.map((selector) => `meta[${selector}]`);
}
