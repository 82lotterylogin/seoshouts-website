import { permanentRedirect } from 'next/navigation'

// Permanently redirect old anchor-cloud URL to new internal-link-checker URL
export default function AnchorCloudRedirect() {
  permanentRedirect('/tools/internal-link-checker/')
}