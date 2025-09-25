import { redirect } from 'next/navigation'

// Redirect old anchor-cloud URL to new internal-link-checker URL
export default function AnchorCloudRedirect() {
  redirect('/tools/internal-link-checker')
}