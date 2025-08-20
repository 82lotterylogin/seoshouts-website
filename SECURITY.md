# Security Headers Implementation

This document outlines the security headers implemented for the SEOShouts website, including HSTS (HTTP Strict Transport Security) and other important security measures.

## HSTS Implementation

### What is HSTS?
HTTP Strict Transport Security (HSTS) is a web security policy mechanism that helps protect websites against man-in-the-middle attacks such as protocol downgrade attacks and cookie hijacking. It allows web servers to declare that web browsers should interact with it using only HTTPS connections.

### HSTS Configuration
```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

- **max-age=63072000**: 2 years (730 days) in seconds
- **includeSubDomains**: Applies HSTS policy to all subdomains
- **preload**: Eligible for browser preload lists

## Security Headers Implemented

### 1. Strict-Transport-Security (HSTS)
- **Purpose**: Forces HTTPS connections
- **Value**: `max-age=63072000; includeSubDomains; preload`

### 2. X-Frame-Options
- **Purpose**: Prevents clickjacking attacks
- **Value**: `DENY`

### 3. X-Content-Type-Options
- **Purpose**: Prevents MIME type sniffing
- **Value**: `nosniff`

### 4. Referrer-Policy
- **Purpose**: Controls referrer information
- **Value**: `strict-origin-when-cross-origin`

### 5. X-XSS-Protection
- **Purpose**: Enables XSS filtering (legacy browsers)
- **Value**: `1; mode=block`

### 6. Permissions-Policy
- **Purpose**: Controls browser permissions
- **Value**: `camera=(), microphone=(), geolocation=(), payment=(), usb=(), vr=(), accelerometer=(), gyroscope=(), magnetometer=(), clipboard-write=()`

### 7. Content-Security-Policy
- **Purpose**: Prevents XSS and data injection attacks
- **Value**: Configured to allow trusted sources for scripts, styles, and resources

## Deployment Instructions

### For Netlify Deployment
1. The `public/_headers` file is automatically deployed
2. The `public/_redirects` file handles HTTPS redirects
3. No additional configuration needed

### For Vercel Deployment
1. The `vercel.json` file configures security headers
2. Headers are applied automatically on deployment
3. No additional configuration needed

### For Other Hosting Providers

#### Apache (.htaccess)
Create a `.htaccess` file in your public directory:
```apache
# HSTS Header
Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"

# Other Security Headers
Header always set X-Frame-Options "DENY"
Header always set X-Content-Type-Options "nosniff"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set X-XSS-Protection "1; mode=block"
```

#### Nginx
Add to your nginx configuration:
```nginx
# Security Headers
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header X-XSS-Protection "1; mode=block" always;
```

#### Cloudflare
Configure security headers in Cloudflare Dashboard:
1. Go to Rules > Transform Rules
2. Add HTTP Response Header Modification Rules
3. Apply the security headers listed above

## HSTS Preload Submission

To maximize security, submit your domain to the HSTS preload list:

1. Visit [hstspreload.org](https://hstspreload.org/)
2. Enter your domain: `seoshouts.com`
3. Verify all requirements are met:
   - Valid HSTS header with max-age ≥ 31536000 (1 year)
   - includeSubDomains directive
   - preload directive
   - Redirect from HTTP to HTTPS
   - Valid certificate

## Testing HSTS Implementation

### Online Tools
- [SSL Labs SSL Test](https://www.ssllabs.com/ssltest/)
- [Security Headers Checker](https://securityheaders.com/)
- [HSTS Preload Test](https://hstspreload.org/)

### Browser Developer Tools
1. Open Developer Tools (F12)
2. Go to Network tab
3. Check response headers for your requests
4. Verify `Strict-Transport-Security` header is present

### Command Line Test
```bash
curl -I https://seoshouts.com
```
Look for the `Strict-Transport-Security` header in the response.

## Security Considerations

1. **Gradual Rollout**: Start with a shorter max-age (e.g., 1 month) and gradually increase
2. **Subdomain Impact**: includeSubDomains affects all subdomains - ensure they support HTTPS
3. **Removal Difficulty**: Once preloaded, removal takes months via browser updates
4. **Certificate Monitoring**: Monitor SSL certificate expiration to prevent lockouts

## Maintenance

- Monitor certificate expiration dates
- Regularly test security headers
- Update CSP as needed when adding new third-party services
- Review and update security policies annually

## Resources

- [OWASP HSTS Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet.html)
- [MDN HSTS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security)
- [Google HSTS Best Practices](https://developers.google.com/web/fundamentals/security/encrypt-in-transit/enable-https)