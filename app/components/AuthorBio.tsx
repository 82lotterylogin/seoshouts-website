// app/components/AuthorBio.tsx
import Link from 'next/link';

const AuthorBio = ({ author }: { author: any }) => {
  const authorData = author?.content || {
    name: 'Rohit Sharma',
    slug: 'rohit-sharma',
    picture: { filename: '/images/team/rohit-sharma.jpg' },
  };

  return (
    <div className="ba-author-bio">
      <span className="ba-author-rail" aria-hidden="true" />
      <div className="ba-author-media">
        {authorData.picture?.filename ? (
          <div
            className="ba-author-photo"
            role="img"
            aria-label={authorData.name}
            style={{ backgroundImage: `url(${authorData.picture.filename})` }}
          />
        ) : (
          <div className="ba-author-photo-initial">
            {authorData.name.split(' ').map((n: string) => n[0]).join('')}
          </div>
        )}
      </div>
      <div className="ba-author-content">
        <div className="ba-author-role">
          <span className="ba-author-role-dot" aria-hidden="true" />
          Written by
        </div>
        <h3 className="ba-author-name">{authorData.name}</h3>
        <p className="ba-author-subtitle">{authorData.job_title || 'Author'} at SEO Shouts</p>
        <p className="ba-author-bio-text">
          {authorData.bio || `${authorData.name} is a seasoned SEO professional with over 13 years of experience helping businesses achieve top rankings on search engines.`}
        </p>
        <div className="ba-author-links">
          <Link href={`/authors/${authorData.slug}`} className="ba-author-profile-link">
            View Profile
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </Link>
          <div className="ba-author-socials">
            {authorData.linkedin_url && (
              <a href={authorData.linkedin_url} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/></svg>
              </a>
            )}
            {authorData.email && (
              <a href={`mailto:${authorData.email}`} aria-label="Email">
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorBio;
