'use client'
import Link from 'next/link'
import { useContent } from '@/hooks/useContent'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export default function TermsOfUsePage() {
  const pageContent = useContent('content.terms')
  const LAST_UPDATED = pageContent?.lastUpdated || 'March 2025'
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', background: '#fff' }}>
        {/* Header */}
        <div className="legal-hero" style={{ background: 'linear-gradient(135deg,var(--ink) 0%,var(--ink2) 100%)', padding: '64px 5% 56px' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: 14 }}>
              Legal
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px,5vw,48px)', fontWeight: 900, color: '#fff', marginBottom: 12 }}>
              Terms of Use
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,.5)' }}>
              Last updated: {LAST_UPDATED}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="legal-content" style={{ maxWidth: 800, margin: '0 auto', padding: '64px 5% 80px' }}>
          <div style={{ background: '#FFF9E6', border: '1.5px solid rgba(201,146,42,.2)', borderRadius: 16, padding: '24px 28px', marginBottom: 40, fontSize: 14, color: 'var(--muted)', lineHeight: 1.8 }}>
            <strong style={{ color: 'var(--gold)' }}>Please read carefully:</strong> By creating an account or using Thynk Pulse, you agree to these Terms of Use. If you do not agree, please do not use the platform.
          </div>

          <Section title="1. About Thynk Pulse">
            <P>Thynk Pulse is a free community platform operated by Thynk Success for education professionals — educators, EdTech companies, school leaders, sales professionals, and researchers. These Terms of Use ("Terms") govern your use of the Thynk Pulse website and all associated services.</P>
            <P>By accessing or using Thynk Pulse, you represent that you are at least 18 years old and have the legal capacity to enter into these Terms.</P>
          </Section>

          <Section title="2. Account Registration">
            <P>To access most features of Thynk Pulse, you must create an account. When registering, you agree to:</P>
            <UL items={[
              'Provide accurate, complete, and current information about yourself',
              'Maintain the security of your password and not share it with others',
              'Notify us immediately of any unauthorized use of your account',
              'Be responsible for all activity that occurs under your account',
              'Not create accounts for others without their permission',
            ]} />
            <P>We reserve the right to terminate accounts that contain inaccurate information or violate these Terms.</P>
          </Section>

          <Section title="3. Content You Post">
            <SubHeading>3.1 Your Ownership</SubHeading>
            <P>You retain ownership of all content you create and post on Thynk Pulse. By publishing content, you grant Thynk Pulse a non-exclusive, royalty-free license to display, distribute, and promote your content on the platform and associated channels (e.g., newsletters, social media).</P>

            <SubHeading>3.2 Content Standards</SubHeading>
            <P>All content you post must:</P>
            <UL items={[
              'Be related to education, EdTech, school leadership, or professional development',
              'Be original or properly attributed if referencing others\' work',
              'Be accurate to the best of your knowledge',
              'Comply with applicable laws, including copyright and defamation laws',
              'Be respectful and professional in tone',
            ]} />

            <SubHeading>3.3 Prohibited Content</SubHeading>
            <P>You must not post content that:</P>
            <UL items={[
              'Is false, misleading, or deliberately deceptive',
              'Contains spam, unsolicited promotions, or affiliate links without disclosure',
              'Is abusive, harassing, discriminatory, or hateful',
              'Contains personal attacks on individuals or organisations',
              'Violates any person\'s privacy or confidentiality',
              'Infringes any third party\'s intellectual property rights',
              'Contains malware, viruses, or harmful code',
              'Is sexually explicit or inappropriate for a professional context',
              'Promotes illegal activities',
            ]} />
          </Section>

          <Section title="4. Community Guidelines">
            <P>Thynk Pulse is a professional community. All members are expected to:</P>
            <UL items={[
              'Engage respectfully with other members, even when disagreeing',
              'Provide constructive feedback and commentary',
              'Disclose any conflicts of interest (e.g., if you\'re reviewing a product you\'re affiliated with)',
              'Not impersonate other individuals, organizations, or brands',
              'Not use the platform to solicit other members outside of the platform\'s intended purpose',
              'Not engage in coordinated campaigns to manipulate votes, followers, or visibility',
            ]} />
          </Section>

          <Section title="5. Content Moderation">
            <P>Thynk Pulse reserves the right to review, edit, or remove any content that violates these Terms or our community guidelines, without prior notice. We may:</P>
            <UL items={[
              'Remove content that violates these Terms',
              'Issue warnings to users who violate community guidelines',
              'Temporarily suspend accounts for repeat violations',
              'Permanently ban accounts for serious or repeated violations',
            ]} />
            <P>Content moderation decisions are at our sole discretion. If you believe content has been incorrectly removed, you may contact us at <a href="mailto:community@thynksuccess.com" style={{ color: 'var(--teal)' }}>community@thynksuccess.com</a>.</P>
          </Section>

          <Section title="6. Intellectual Property">
            <SubHeading>6.1 Platform Content</SubHeading>
            <P>All platform design, logos, trademarks, and non-user-generated content are owned by Thynk Success and protected by intellectual property laws. You may not use, copy, or distribute platform materials without explicit written permission.</P>

            <SubHeading>6.2 User Content Rights</SubHeading>
            <P>You confirm that you have all necessary rights to post the content you publish on Thynk Pulse. If you post content that infringes someone else's intellectual property rights, you are solely responsible for any resulting claims or legal liability.</P>

            <SubHeading>6.3 Reporting Infringement</SubHeading>
            <P>If you believe your intellectual property rights have been infringed, please contact us at <a href="mailto:legal@thynksuccess.com" style={{ color: 'var(--teal)' }}>legal@thynksuccess.com</a> with details of the alleged infringement.</P>
          </Section>

          <Section title="7. Privacy">
            <P>Your use of Thynk Pulse is also governed by our <Link href="/privacy" style={{ color: 'var(--teal)' }}>Privacy Policy</Link>, which is incorporated into these Terms by reference. By using the platform, you consent to our data practices as described therein.</P>
          </Section>

          <Section title="8. Disclaimers">
            <P>Thynk Pulse is provided "as is" without warranties of any kind, express or implied. We do not warrant that:</P>
            <UL items={[
              'The platform will be uninterrupted, error-free, or secure at all times',
              'Any content posted by users is accurate, complete, or reliable',
              'The platform will be available in all geographic regions',
            ]} />
            <P>Content posted by community members represents their personal views and experiences, not those of Thynk Pulse or Thynk Success. We do not endorse or verify user-generated content.</P>
          </Section>

          <Section title="9. Limitation of Liability">
            <P>To the maximum extent permitted by applicable law, Thynk Success shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of (or inability to use) Thynk Pulse, including damages related to:</P>
            <UL items={[
              'Loss of data, revenue, profits, or business opportunities',
              'Reliance on information posted by other users',
              'Unauthorized access to your account',
              'Any other matters relating to the platform',
            ]} />
          </Section>

          <Section title="10. Indemnification">
            <P>You agree to indemnify, defend, and hold harmless Thynk Success and its officers, directors, employees, and agents from any claims, damages, liabilities, costs, or expenses arising from:</P>
            <UL items={[
              'Your use of the platform in violation of these Terms',
              'Content you post on the platform',
              'Your violation of any third party\'s rights',
            ]} />
          </Section>

          <Section title="11. Changes to These Terms">
            <P>We may update these Terms from time to time. For significant changes, we will:</P>
            <UL items={[
              'Send notice to your registered email address',
              'Display a prominent notice on the platform',
              'Update the "Last updated" date at the top of this page',
            ]} />
            <P>Your continued use of Thynk Pulse after changes become effective constitutes your acceptance of the updated Terms.</P>
          </Section>

          <Section title="12. Termination">
            <P>You may delete your account at any time from your profile settings. We may terminate or suspend your account at any time if you violate these Terms, with or without notice.</P>
            <P>Upon termination, your right to use the platform ceases immediately. Provisions that by their nature should survive termination (including content ownership, indemnification, and limitations of liability) shall survive.</P>
          </Section>

          <Section title="13. Governing Law">
            <P>These Terms are governed by the laws of India. Any disputes arising out of or relating to these Terms or your use of Thynk Pulse shall be subject to the exclusive jurisdiction of the courts of India.</P>
          </Section>

          <Section title="14. Contact">
            <P>For questions about these Terms, please contact:</P>
            <div style={{ background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: 12, padding: '20px 24px', marginTop: 16 }}>
              <div style={{ fontSize: 14, lineHeight: 2 }}>
                <div><strong>Email:</strong> <a href="mailto:legal@thynksuccess.com" style={{ color: 'var(--teal)' }}>legal@thynksuccess.com</a></div>
                <div><strong>Website:</strong> <a href="https://thynksuccess.com/contact-us/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal)' }}>thynksuccess.com/contact-us</a></div>
              </div>
            </div>
          </Section>

          {/* Nav */}
          <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--border)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link href="/privacy" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--teal)', fontWeight: 600, textDecoration: 'none' }}>
              Privacy Policy →
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
