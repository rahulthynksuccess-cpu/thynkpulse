'use client'
import Link from 'next/link'
import { useContent } from '@/hooks/useContent'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export default function PrivacyPolicyPage() {
  const pageContent = useContent('content.privacy')
  const LAST_UPDATED = pageContent?.lastUpdated || 'March 2025'
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', background: '#fff' }}>
        {/* Header */}
        <div className="legal-hero" style={{ background: 'var(--teal)', padding: '64px 5% 56px' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)', marginBottom: 14 }}>
              Legal
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px,5vw,48px)', fontWeight: 900, color: '#fff', marginBottom: 12 }}>
              Privacy Policy
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,.6)' }}>
              Last updated: {LAST_UPDATED}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="legal-content" style={{ maxWidth: 800, margin: '0 auto', padding: '64px 5% 80px' }}>
          <div style={{ background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: 16, padding: '24px 28px', marginBottom: 40, fontSize: 14, color: 'var(--muted)', lineHeight: 1.8 }}>
            <strong style={{ color: 'var(--teal)' }}>Summary:</strong> Thynk Pulse is a free community platform for education professionals. We collect only what we need to operate the platform, we never sell your data, and you can delete your account at any time.
          </div>

          <Section title="1. About Thynk Pulse">
            <P>Thynk Pulse ("we," "us," or "our") is operated by Thynk Success, a platform dedicated to India's education community. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.</P>
            <P>By using Thynk Pulse, you agree to the collection and use of information in accordance with this policy.</P>
          </Section>

          <Section title="2. Information We Collect">
            <SubHeading>2.1 Information You Provide</SubHeading>
            <UL items={[
              'Account information: name, email address, phone number, and password when you register',
              'Profile information: designation, institution/company name, years of experience, biography, and profile photo',
              'Content you create: articles, comments, and other posts you publish on the platform',
              'Communications: messages you send to us via email or contact forms',
            ]} />

            <SubHeading>2.2 Information Collected Automatically</SubHeading>
            <UL items={[
              'Usage data: pages viewed, articles read, time spent on the platform, and features used',
              'Device information: browser type, operating system, IP address, and device identifiers',
              'Cookies and similar technologies: session cookies to keep you logged in, and preference cookies to remember your settings',
            ]} />

            <SubHeading>2.3 Information from Third Parties</SubHeading>
            <P>We may receive information about you if you sign in using third-party services. This information is governed by the privacy practices of those services.</P>
          </Section>

          <Section title="3. How We Use Your Information">
            <P>We use the information we collect for the following purposes:</P>
            <UL items={[
              'To create and manage your account and provide platform features',
              'To display your profile and published content to other community members',
              'To send you platform notifications (new comments, followers, etc.) — you can opt out at any time',
              'To send you our newsletter if you subscribe — you can unsubscribe at any time',
              'To moderate content and ensure community guidelines are followed',
              'To improve platform features and fix technical issues',
              'To comply with legal obligations',
            ]} />
          </Section>

          <Section title="4. Sharing Your Information">
            <P>We do not sell, trade, or rent your personal information to third parties. We may share your information only in these limited circumstances:</P>
            <UL items={[
              'Service providers: Trusted third parties who help us operate the platform (hosting, email delivery, analytics) — bound by confidentiality agreements',
              'Legal requirements: When required by law, court order, or governmental authority',
              'Safety: To protect the rights, property, or safety of Thynk Pulse, our users, or the public',
              'Business transfers: In the event of a merger or acquisition, with appropriate notice to you',
            ]} />
            <P><strong>Your public profile information</strong> (name, bio, articles, follower count) is visible to all users of the platform by design — this is core to the community experience.</P>
          </Section>

          <Section title="5. Cookies and Tracking">
            <P>We use cookies and similar tracking technologies to operate the platform. Here's what we use:</P>
            <UL items={[
              'Essential cookies: Required for login, security, and basic platform functionality. These cannot be disabled.',
              'Analytics cookies: Help us understand how the platform is used (page views, popular content). You can opt out via your browser settings.',
              'Preference cookies: Remember your settings and preferences.',
            ]} />
            <P>You can control cookies through your browser settings. Disabling essential cookies will prevent you from logging in.</P>
          </Section>

          <Section title="6. Data Storage and Security">
            <P>Your data is stored on secure servers. We implement industry-standard security measures including:</P>
            <UL items={[
              'Encrypted passwords (we never store your password in plain text)',
              'HTTPS encryption for all data transmitted between your browser and our servers',
              'Regular security reviews and updates',
              'Limited access to personal data by our team members',
            ]} />
            <P>No method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.</P>
          </Section>

          <Section title="7. Data Retention">
            <P>We retain your personal information for as long as your account is active or as needed to provide services. If you delete your account:</P>
            <UL items={[
              'Your profile information is permanently deleted within 30 days',
              'Published articles may remain on the platform in anonymous form unless you request deletion',
              'Backup copies may persist for up to 90 days for operational purposes',
            ]} />
          </Section>

          <Section title="8. Your Rights">
            <P>You have the following rights regarding your personal data:</P>
            <UL items={[
              'Access: Request a copy of the personal data we hold about you',
              'Correction: Ask us to correct inaccurate or incomplete information',
              'Deletion: Request that we delete your account and associated data',
              'Portability: Request your data in a structured, machine-readable format',
              'Opt-out: Unsubscribe from marketing emails at any time using the link in any email',
            ]} />
            <P>To exercise any of these rights, email us at <a href="mailto:privacy@thynksuccess.com" style={{ color: 'var(--teal)' }}>privacy@thynksuccess.com</a>. We will respond within 30 days.</P>
          </Section>

          <Section title="9. Children's Privacy">
            <P>Thynk Pulse is designed for education professionals and is not intended for use by persons under 18 years of age. We do not knowingly collect personal information from minors. If we learn we have collected such information, we will promptly delete it.</P>
          </Section>

          <Section title="10. Changes to This Policy">
            <P>We may update this Privacy Policy from time to time. We will notify you of significant changes by:</P>
            <UL items={[
              'Sending an email to the address on your account',
              'Displaying a prominent notice on the platform',
              'Updating the "Last updated" date at the top of this page',
            ]} />
            <P>Continued use of Thynk Pulse after changes constitutes acceptance of the updated policy.</P>
          </Section>

          <Section title="11. Contact Us">
            <P>If you have questions, concerns, or requests regarding this Privacy Policy, please contact us:</P>
            <div style={{ background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: 12, padding: '20px 24px', marginTop: 16 }}>
              <div style={{ fontSize: 14, lineHeight: 2 }}>
                <div><strong>Email:</strong> <a href="mailto:privacy@thynksuccess.com" style={{ color: 'var(--teal)' }}>privacy@thynksuccess.com</a></div>
                <div><strong>Website:</strong> <a href="https://thynksuccess.com/contact-us/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal)' }}>thynksuccess.com/contact-us</a></div>
                <div><strong>Platform:</strong> <Link href="/" style={{ color: 'var(--teal)' }}>thynkpulse.in</Link></div>
              </div>
            </div>
          </Section>

          {/* Nav to Terms */}
          <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--border)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link href="/terms" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--teal)', fontWeight: 600, textDecoration: 'none' }}>
              Terms of Use →
            </Link>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--muted)', textDecoration: 'none' }}>
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

/* ── Helper components ─────────────────────────────────────── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 700, color: 'var(--ink)', marginBottom: 16, paddingBottom: 10, borderBottom: '2px solid var(--border)' }}>
        {title}
      </h2>
      {children}
    </div>
  )
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', marginBottom: 10, marginTop: 20 }}>{children}</h3>
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 12 }}>{children}</p>
}

function UL({ items }: { items: string[] }) {
  return (
    <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
      {items.map((item, i) => (
        <li key={i} style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 6 }}>{item}</li>
      ))}
    </ul>
  )
}
