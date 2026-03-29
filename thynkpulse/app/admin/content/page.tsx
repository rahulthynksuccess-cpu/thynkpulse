'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect, useCallback } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { useQuery, useMutation } from '@tanstack/react-query'
import { apiPost } from '@/lib/api'
import { Globe, Loader2, ChevronDown, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

/* ─── Every editable element on every page ───────────────────── */
const PAGES: { label: string; icon: string; sections: { id: string; label: string; fields: Field[] }[] }[] = [
  {
    label: 'Homepage', icon: '🏠',
    sections: [
      {
        id: 'hero', label: 'Hero Section',
        fields: [
          { id:'hero.eyebrow',       label:'Eyebrow text',         type:'text',   cssVar:'--hero-eyebrow-text',      default:'India\'s Education Community Platform' },
          { id:'hero.h1Line1',       label:'H1 Line 1',            type:'text',   cssVar:'--hero-h1-line1',          default:'Where Ideas' },
          { id:'hero.h1Line2',       label:'H1 Line 2 (italic)',   type:'text',   cssVar:'--hero-h1-line2',          default:'Shape Education' },
          { id:'hero.subtitle',      label:'Subtitle text',        type:'textarea',cssVar:'--hero-subtitle-text',   default:'Thynk Pulse is the free, open community for educators, EdTech professionals, innovators and school leaders.' },
          { id:'hero.h1Size',        label:'H1 font size',         type:'size',   cssVar:'--hero-h1-size',           default:'84', min:32, max:160 },
          { id:'hero.h1Color',       label:'H1 text colour',       type:'color',  cssVar:'--hero-h1-color',          default:'#1A1208' },
          { id:'hero.subSize',       label:'Subtitle font size',   type:'size',   cssVar:'--hero-sub-size',          default:'17', min:12, max:28 },
          { id:'hero.subColor',      label:'Subtitle colour',      type:'color',  cssVar:'--hero-sub-color',         default:'#7A6A52' },
          { id:'hero.bg',            label:'Background colour',    type:'color',  cssVar:'--hero-bg',                default:'#FDF6EC' },
          { id:'hero.btn1Text',      label:'Primary button text',  type:'text',   cssVar:'--hero-btn1-text',         default:'Start Writing Free' },
          { id:'hero.btn1Bg',        label:'Primary button background', type:'color', cssVar:'--hero-btn1-bg',      default:'#0A5F55' },
          { id:'hero.btn1Color',     label:'Primary button text colour', type:'color', cssVar:'--hero-btn1-color',  default:'#ffffff' },
          { id:'hero.btn2Text',      label:'Secondary button text',type:'text',   cssVar:'--hero-btn2-text',         default:'Explore Posts' },
          { id:'hero.btn2Bg',        label:'Secondary button background', type:'color', cssVar:'--hero-btn2-bg',   default:'transparent' },
          { id:'hero.btn2Color',     label:'Secondary button text colour', type:'color', cssVar:'--hero-btn2-color',default:'#1A1208' },
          { id:'hero.btn2Border',    label:'Secondary button border', type:'color', cssVar:'--hero-btn2-border',    default:'#EDE0C8' },
        ],
      },
      {
        id: 'stats', label: 'Stats Bar',
        fields: [
          { id:'stats.bg',           label:'Background colour',    type:'color',  cssVar:'--stats-bg',               default:'#ffffff' },
          { id:'stats.numColor',     label:'Number colour',        type:'color',  cssVar:'--stat-num-color',         default:'#1A1208' },
          { id:'stats.numSize',      label:'Number font size',     type:'size',   cssVar:'--stat-num-size',          default:'40', min:20, max:72 },
          { id:'stats.labelColor',   label:'Label colour',         type:'color',  cssVar:'--stat-label-color',       default:'#7A6A52' },
          { id:'stats.accentColor',  label:'Suffix accent colour', type:'color',  cssVar:'--stat-accent-color',      default:'#E8512A' },
          { id:'stats.1n',           label:'Stat 1 — Number',      type:'text',   cssVar:'--stat-1-n',               default:'10K' },
          { id:'stats.1l',           label:'Stat 1 — Label',       type:'text',   cssVar:'--stat-1-l',               default:'Community Members' },
          { id:'stats.2n',           label:'Stat 2 — Number',      type:'text',   cssVar:'--stat-2-n',               default:'2.4K' },
          { id:'stats.2l',           label:'Stat 2 — Label',       type:'text',   cssVar:'--stat-2-l',               default:'Articles Published' },
          { id:'stats.3n',           label:'Stat 3 — Number',      type:'text',   cssVar:'--stat-3-n',               default:'180' },
          { id:'stats.3l',           label:'Stat 3 — Label',       type:'text',   cssVar:'--stat-3-l',               default:'EdTech Companies' },
          { id:'stats.4n',           label:'Stat 4 — Number',      type:'text',   cssVar:'--stat-4-n',               default:'40' },
          { id:'stats.4l',           label:'Stat 4 — Label',       type:'text',   cssVar:'--stat-4-l',               default:'Countries' },
          { id:'stats.5n',           label:'Stat 5 — Number',      type:'text',   cssVar:'--stat-5-n',               default:'100' },
          { id:'stats.5l',           label:'Stat 5 — Label',       type:'text',   cssVar:'--stat-5-l',               default:'Free Forever' },
        ],
      },
      {
        id: 'cta', label: 'CTA / Join Section',
        fields: [
          { id:'cta.bg',             label:'Section background',   type:'color',  cssVar:'--cta-bg',                 default:'#0A5F55' },
          { id:'cta.headlineColor',  label:'Headline colour',      type:'color',  cssVar:'--cta-h2-color',           default:'#ffffff' },
          { id:'cta.headlineSize',   label:'Headline font size',   type:'size',   cssVar:'--cta-h2-size',            default:'38', min:20, max:72 },
          { id:'cta.subtitleColor',  label:'Subtitle colour',      type:'color',  cssVar:'--cta-subtitle-color',     default:'rgba(255,255,255,0.75)' },
          { id:'cta.btnBg',          label:'Button background',    type:'color',  cssVar:'--cta-btn-bg',             default:'#E8512A' },
          { id:'cta.btnColor',       label:'Button text colour',   type:'color',  cssVar:'--cta-btn-color',          default:'#ffffff' },
          { id:'cta.btnText',        label:'Button text',          type:'text',   cssVar:'--cta-btn-text',           default:'Join Free →' },
          { id:'cta.btnSize',        label:'Button font size',     type:'size',   cssVar:'--cta-btn-size',           default:'15', min:12, max:22 },
          { id:'cta.inputPlaceholder',label:'Email placeholder',   type:'text',   cssVar:'--cta-input-placeholder',  default:'Enter your work email' },
          { id:'cta.footnote',       label:'Footnote text',        type:'text',   cssVar:'--cta-footnote',           default:'🔒 No spam. No paywall. Free forever.' },
        ],
      },
    ],
  },
  {
    label: 'Navbar', icon: '📌',
    sections: [
      {
        id: 'navbar', label: 'Navigation Bar',
        fields: [
          { id:'navbar.bg',          label:'Background colour',    type:'color',  cssVar:'--nav-bg',                 default:'rgba(253,246,236,0.97)' },
          { id:'navbar.linkColor',   label:'Link text colour',     type:'color',  cssVar:'--nav-color',              default:'#7A6A52' },
          { id:'navbar.linkSize',    label:'Link font size',       type:'size',   cssVar:'--nav-size',               default:'13', min:10, max:18 },
          { id:'navbar.btnText',     label:'CTA button text',      type:'text',   cssVar:'--nav-btn-text',           default:'Start Writing' },
          { id:'navbar.btnBg',       label:'CTA button background',type:'color',  cssVar:'--nav-btn-bg',             default:'#0A5F55' },
          { id:'navbar.btnColor',    label:'CTA button text colour',type:'color', cssVar:'--nav-btn-color',          default:'#ffffff' },
          { id:'navbar.loginText',   label:'Login link text',      type:'text',   cssVar:'--nav-login-text',         default:'Login' },
        ],
      },
    ],
  },
  {
    label: 'Footer', icon: '🦶',
    sections: [
      {
        id: 'footer', label: 'Footer',
        fields: [
          { id:'footer.bg',          label:'Background colour',    type:'color',  cssVar:'--footer-bg',              default:'#0A5F55' },
          { id:'footer.textColor',   label:'Body text colour',     type:'color',  cssVar:'--footer-text-color',      default:'rgba(255,255,255,0.6)' },
          { id:'footer.linkColor',   label:'Link / accent colour', type:'color',  cssVar:'--footer-link-color',      default:'#E5B64A' },
          { id:'footer.headingColor',label:'Column heading colour',type:'color',  cssVar:'--footer-heading-color',   default:'rgba(255,255,255,0.35)' },
          { id:'footer.textSize',    label:'Text font size',       type:'size',   cssVar:'--footer-text-size',       default:'13', min:10, max:18 },
          { id:'footer.tagline',     label:'Tagline text',         type:'textarea',cssVar:'--footer-tagline',        default:'The free community platform for educators and EdTech professionals.' },
          { id:'footer.copyright',   label:'Copyright text',       type:'text',   cssVar:'--footer-copyright',      default:'© 2025 Thynk Pulse. All rights reserved.' },
        ],
      },
    ],
  },
  {
    label: 'Post Pages', icon: '📄',
    sections: [
      {
        id: 'post', label: 'Post Detail Page',
        fields: [
          { id:'post.bg',            label:'Page background',      type:'color',  cssVar:'--post-page-bg',           default:'#FDF6EC' },
          { id:'post.titleColor',    label:'Title colour',         type:'color',  cssVar:'--post-page-title-color',  default:'#1A1208' },
          { id:'post.titleSize',     label:'Title font size',      type:'size',   cssVar:'--post-page-title-size',   default:'40', min:24, max:72 },
          { id:'post.bodyColor',     label:'Body text colour',     type:'color',  cssVar:'--post-page-body-color',   default:'#1A1208' },
          { id:'post.bodySize',      label:'Body font size',       type:'size',   cssVar:'--post-page-body-size',    default:'16', min:12, max:22 },
          { id:'post.cardBg',        label:'Post card background', type:'color',  cssVar:'--post-card-bg',           default:'#ffffff' },
          { id:'post.titleColor2',   label:'Card title colour',    type:'color',  cssVar:'--post-title-color',       default:'#1A1208' },
          { id:'post.titleSize2',    label:'Card title size',      type:'size',   cssVar:'--post-title-size',        default:'20', min:14, max:32 },
          { id:'post.catColor',      label:'Category tag colour',  type:'color',  cssVar:'--post-cat-color',         default:'#0A5F55' },
        ],
      },
    ],
  },
  {
    label: 'Auth Pages', icon: '🔐',
    sections: [
      {
        id: 'login', label: 'Login Page',
        fields: [
          { id:'login.bg',           label:'Page background',      type:'color',  cssVar:'--login-bg',               default:'#FDF6EC' },
          { id:'login.cardBg',       label:'Card background',      type:'color',  cssVar:'--login-card-bg',          default:'#ffffff' },
          { id:'login.h1Color',      label:'Heading colour',       type:'color',  cssVar:'--login-h1-color',         default:'#1A1208' },
          { id:'login.h1Size',       label:'Heading font size',    type:'size',   cssVar:'--login-h1-size',          default:'30', min:20, max:48 },
          { id:'login.labelColor',   label:'Label colour',         type:'color',  cssVar:'--login-label-color',      default:'#7A6A52' },
          { id:'login.inputBorder',  label:'Input border colour',  type:'color',  cssVar:'--login-input-border',     default:'#EDE0C8' },
        ],
      },
      {
        id: 'register', label: 'Register Page',
        fields: [
          { id:'reg.bg',             label:'Page background',      type:'color',  cssVar:'--register-bg',            default:'#FDF6EC' },
          { id:'reg.h1Color',        label:'Heading colour',       type:'color',  cssVar:'--register-h1-color',      default:'#1A1208' },
          { id:'reg.h1Size',         label:'Heading font size',    type:'size',   cssVar:'--register-h1-size',       default:'28', min:20, max:48 },
        ],
      },
    ],
  },
  {
    label: 'Admin Panel', icon: '🛡️',
    sections: [
      {
        id: 'admin', label: 'Admin Dashboard',
        fields: [
          { id:'admin.bg',           label:'Page background',      type:'color',  cssVar:'--admin-bg',               default:'#F8F4EE' },
          { id:'admin.sidebarBg',    label:'Sidebar background',   type:'color',  cssVar:'--admin-sidebar-bg',       default:'#1A1208' },
          { id:'admin.sidebarActive',label:'Active item background',type:'color', cssVar:'--admin-sidebar-active',   default:'rgba(10,95,85,0.08)' },
          { id:'admin.sidebarActiveColor',label:'Active item colour',type:'color',cssVar:'--admin-sidebar-active-color',default:'#0A5F55' },
          { id:'admin.headerBg',     label:'Header/card background',type:'color', cssVar:'--admin-header-bg',        default:'#ffffff' },
        ],
      },
    ],
  },
  {
    label: 'Inner Pages', icon: '📰',
    sections: [
      {
        id: 'latest-posts', label: 'Latest Posts',
        fields: [
          { id:'lp.heroBg',          label:'Hero background',      type:'color',  cssVar:'--latest-posts-hero-bg',   default:'#0A5F55' },
          { id:'lp.heroColor',       label:'Hero text colour',     type:'color',  cssVar:'--latest-posts-hero-color',default:'#ffffff' },
          { id:'lp.pageBg',          label:'Page background',      type:'color',  cssVar:'--latest-posts-bg',        default:'#FDF6EC' },
        ],
      },
      {
        id: 'trending', label: 'Trending Page',
        fields: [
          { id:'tr.heroBg',          label:'Hero background',      type:'color',  cssVar:'--trending-hero-bg',       default:'#E8512A' },
          { id:'tr.heroColor',       label:'Hero text colour',     type:'color',  cssVar:'--trending-hero-color',    default:'#ffffff' },
          { id:'tr.pageBg',          label:'Page background',      type:'color',  cssVar:'--trending-page-bg',       default:'#ffffff' },
          { id:'tr.rankColor',       label:'Rank number colour',   type:'color',  cssVar:'--trending-rank-color',    default:'#EDE0C8' },
          { id:'tr.tagColor',        label:'Category tag colour',  type:'color',  cssVar:'--trending-tag-color',     default:'#E8512A' },
        ],
      },
      {
        id: 'community', label: 'Community Page',
        fields: [
          { id:'com.heroBg',         label:'Hero background',      type:'color',  cssVar:'--community-hero-bg',      default:'#0A5F55' },
          { id:'com.heroColor',      label:'Hero text colour',     type:'color',  cssVar:'--community-hero-color',   default:'#ffffff' },
          { id:'com.pageBg',         label:'Page background',      type:'color',  cssVar:'--community-page-bg',      default:'#ffffff' },
          { id:'com.statsBg',        label:'Stats bar background', type:'color',  cssVar:'--community-stats-bg',     default:'#ffffff' },
          { id:'com.statsNumColor',  label:'Stats number colour',  type:'color',  cssVar:'--community-stats-num-color',default:'#0A5F55' },
        ],
      },
      {
        id: 'writers', label: 'Writers Directory',
        fields: [
          { id:'wr.heroBg',          label:'Hero background',      type:'color',  cssVar:'--writers-hero-bg',        default:'#0A5F55' },
          { id:'wr.heroColor',       label:'Hero text colour',     type:'color',  cssVar:'--writers-hero-color',     default:'#ffffff' },
          { id:'wr.pageBg',          label:'Page background',      type:'color',  cssVar:'--writers-bg',             default:'#FDF6EC' },
          { id:'wr.cardBg',          label:'Writer card background',type:'color', cssVar:'--writers-card-bg',        default:'#ffffff' },
        ],
      },
    ],
  },
  {
    label: 'Legal Pages', icon: '🔒',
    sections: [
      {
        id: 'privacy', label: 'Privacy Policy',
        fields: [
          { id:'priv.heroBg',        label:'Hero background',      type:'color',  cssVar:'--privacy-hero-bg',        default:'#0A5F55' },
          { id:'priv.heroColor',     label:'Hero text colour',     type:'color',  cssVar:'--privacy-hero-color',     default:'#ffffff' },
          { id:'priv.pageBg',        label:'Page background',      type:'color',  cssVar:'--privacy-bg',             default:'#ffffff' },
          { id:'priv.headingColor',  label:'Section heading colour',type:'color', cssVar:'--privacy-heading-color',  default:'#1A1208' },
          { id:'priv.bodyColor',     label:'Body text colour',     type:'color',  cssVar:'--privacy-body-color',     default:'#7A6A52' },
        ],
      },
      {
        id: 'terms', label: 'Terms of Use',
        fields: [
          { id:'terms.heroBg',       label:'Hero background',      type:'color',  cssVar:'--terms-hero-bg',          default:'#1A1208' },
          { id:'terms.heroColor',    label:'Hero text colour',     type:'color',  cssVar:'--terms-hero-color',       default:'#ffffff' },
          { id:'terms.pageBg',       label:'Page background',      type:'color',  cssVar:'--terms-bg',               default:'#ffffff' },
          { id:'terms.headingColor', label:'Section heading colour',type:'color', cssVar:'--terms-heading-color',    default:'#1A1208' },
          { id:'terms.bodyColor',    label:'Body text colour',     type:'color',  cssVar:'--terms-body-color',       default:'#7A6A52' },
        ],
      },
    ],
  },
  {
    label: 'Posts Feed Section', icon: '📰',
    sections: [
      {
        id: 'posts-section', label: 'Posts Feed (Homepage)',
        fields: [
          { id:'posts.bg',           label:'Section background',         type:'color', cssVar:'--posts-bg',               default:'#FDF6EC' },
          { id:'posts.eyebrowColor', label:'Eyebrow text colour',        type:'color', cssVar:'--posts-eyebrow-color',    default:'#E8512A' },
          { id:'posts.eyebrowSize',  label:'Eyebrow font size',          type:'size',  cssVar:'--posts-eyebrow-size',     default:'11', min:9, max:16 },
          { id:'posts.titleColor',   label:'"Fresh Ideas" title colour', type:'color', cssVar:'--posts-section-title-color', default:'#1A1208' },
          { id:'posts.titleSize',    label:'Section title font size',    type:'size',  cssVar:'--posts-section-title-size',  default:'42', min:24, max:72 },
          { id:'posts.accentColor',  label:'Italic accent colour',       type:'color', cssVar:'--posts-section-accent',   default:'#0A5F55' },
          { id:'posts.descColor',    label:'Description text colour',    type:'color', cssVar:'--posts-desc-color',       default:'#7A6A52' },
          { id:'posts.descSize',     label:'Description font size',      type:'size',  cssVar:'--posts-desc-size',        default:'16', min:12, max:22 },
          { id:'posts.cardBg',       label:'Post card background',       type:'color', cssVar:'--post-card-bg',           default:'#ffffff' },
          { id:'posts.cardTitleColor',label:'Card title colour',         type:'color', cssVar:'--post-title-color',       default:'#1A1208' },
          { id:'posts.cardTitleSize', label:'Card title font size',      type:'size',  cssVar:'--post-title-size',        default:'20', min:14, max:32 },
          { id:'posts.cardExcerptColor',label:'Card excerpt colour',     type:'color', cssVar:'--post-excerpt-color',     default:'#7A6A52' },
          { id:'posts.cardExcerptSize', label:'Card excerpt font size',  type:'size',  cssVar:'--post-excerpt-size',      default:'13', min:10, max:18 },
          { id:'posts.catColor',     label:'Category tag colour',        type:'color', cssVar:'--post-cat-color',         default:'#0A5F55' },
          { id:'posts.filterActiveBg',label:'Active filter background',  type:'color', cssVar:'--filter-active-bg',       default:'#0A5F55' },
          { id:'posts.filterActiveColor',label:'Active filter text',     type:'color', cssVar:'--filter-active-color',    default:'#ffffff' },
        ],
      },
    ],
  },
  {
    label: 'Community Section', icon: '🤝',
    sections: [
      {
        id: 'community-section', label: 'Community Cards (Homepage)',
        fields: [
          { id:'comm.bg',            label:'Section background',         type:'color', cssVar:'--community-bg',           default:'#ffffff' },
          { id:'comm.eyebrowColor',  label:'Eyebrow text colour',        type:'color', cssVar:'--community-eyebrow-color',default:'#E8512A' },
          { id:'comm.titleColor',    label:'"One Platform" title colour',type:'color', cssVar:'--community-title-color',  default:'#1A1208' },
          { id:'comm.titleSize',     label:'Section title font size',    type:'size',  cssVar:'--community-title-size',   default:'42', min:24, max:72 },
          { id:'comm.accentColor',   label:'Italic accent colour',       type:'color', cssVar:'--community-accent-color', default:'#0A5F55' },
          { id:'comm.descColor',     label:'Description text colour',    type:'color', cssVar:'--community-desc-color',   default:'#7A6A52' },
          { id:'comm.cardTitleSize', label:'Card title font size',       type:'size',  cssVar:'--community-card-title-size', default:'20', min:14, max:28 },
          { id:'comm.cardDescSize',  label:'Card description font size', type:'size',  cssVar:'--community-card-desc-size',  default:'13', min:10, max:18 },
          { id:'comm.countSize',     label:'Member count font size',     type:'size',  cssVar:'--community-count-size',   default:'12', min:9, max:16 },
        ],
      },
    ],
  },
  {
    label: 'Trending Section', icon: '🔥',
    sections: [
      {
        id: 'trending-section', label: 'Trending This Week (Homepage)',
        fields: [
          { id:'trend.bg',           label:'Section background',         type:'color', cssVar:'--trending-bg',            default:'#ffffff' },
          { id:'trend.eyebrowColor', label:'Eyebrow text colour',        type:'color', cssVar:'--trending-eyebrow-color', default:'#E8512A' },
          { id:'trend.titleColor',   label:'"Trending" title colour',    type:'color', cssVar:'--trending-section-title', default:'#1A1208' },
          { id:'trend.titleSize',    label:'Section title font size',    type:'size',  cssVar:'--trending-section-title-size', default:'42', min:24, max:72 },
          { id:'trend.accentColor',  label:'Italic accent colour',       type:'color', cssVar:'--trending-accent-color',  default:'#0A5F55' },
          { id:'trend.rankColor',    label:'Rank number colour (01,02)', type:'color', cssVar:'--trending-num-color',     default:'#EDE0C8' },
          { id:'trend.rankSize',     label:'Rank number font size',      type:'size',  cssVar:'--trending-rank-size',     default:'32', min:20, max:56 },
          { id:'trend.catColor',     label:'Category tag colour',        type:'color', cssVar:'--trending-cat-color',     default:'#E8512A' },
          { id:'trend.catSize',      label:'Category tag font size',     type:'size',  cssVar:'--trending-cat-size',      default:'11', min:9, max:16 },
          { id:'trend.articleTitleColor',label:'Article title colour',   type:'color', cssVar:'--trending-title-color',   default:'#1A1208' },
          { id:'trend.articleTitleSize', label:'Article title font size',type:'size',  cssVar:'--trending-title-size',    default:'17', min:12, max:26 },
          { id:'trend.metaColor',    label:'Meta text colour (reads,likes)',type:'color',cssVar:'--trending-meta-color',  default:'#7A6A52' },
          { id:'trend.sidebarBg',    label:'Sidebar card background',    type:'color', cssVar:'--trending-sidebar-bg',    default:'#FDF6EC' },
          { id:'trend.topicTagBg',   label:'Topic tag background',       type:'color', cssVar:'--topic-tag-bg',           default:'#EDE0C8' },
          { id:'trend.topicTagColor',label:'Topic tag text colour',      type:'color', cssVar:'--topic-tag-color',        default:'#7A6A52' },
        ],
      },
    ],
  },
  {
    label: 'Writers Spotlight', icon: '✍️',
    sections: [
      {
        id: 'writers-section', label: 'Writers Get The Spotlight (Homepage)',
        fields: [
          { id:'writ.bg',            label:'Section background',         type:'color', cssVar:'--writers-section-bg',     default:'#FDF6EC' },
          { id:'writ.eyebrowColor',  label:'Eyebrow text colour',        type:'color', cssVar:'--writers-eyebrow-color',  default:'#E8512A' },
          { id:'writ.titleColor',    label:'"Writers Get" title colour', type:'color', cssVar:'--writers-section-title',  default:'#1A1208' },
          { id:'writ.titleSize',     label:'Section title font size',    type:'size',  cssVar:'--writers-section-title-size', default:'42', min:24, max:72 },
          { id:'writ.accentColor',   label:'Italic accent colour',       type:'color', cssVar:'--writers-accent-color',   default:'#0A5F55' },
          { id:'writ.cardBg',        label:'Profile card background',    type:'color', cssVar:'--writers-card-bg-home',   default:'#ffffff' },
          { id:'writ.nameColor',     label:'Writer name colour',         type:'color', cssVar:'--writers-name-color',     default:'#1A1208' },
          { id:'writ.nameSize',      label:'Writer name font size',      type:'size',  cssVar:'--writers-name-size',      default:'18', min:12, max:28 },
          { id:'writ.roleColor',     label:'Role / location colour',     type:'color', cssVar:'--writers-role-color',     default:'#7A6A52' },
          { id:'writ.roleSize',      label:'Role font size',             type:'size',  cssVar:'--writers-role-size',      default:'13', min:10, max:18 },
          { id:'writ.statNumColor',  label:'Stats number colour (48, 12K)', type:'color', cssVar:'--writers-stat-num-color', default:'#1A1208' },
          { id:'writ.statNumSize',   label:'Stats number font size',     type:'size',  cssVar:'--writers-stat-num-size',  default:'28', min:16, max:48 },
          { id:'writ.statLabelColor',label:'Stats label colour (Articles, Followers)', type:'color', cssVar:'--writers-stat-label-color', default:'#7A6A52' },
          { id:'writ.featureBg',     label:'Feature list item background',type:'color',cssVar:'--writers-feature-bg',    default:'rgba(10,95,85,0.06)' },
          { id:'writ.featureTitleColor',label:'Feature title colour',    type:'color', cssVar:'--writers-feature-title-color', default:'#1A1208' },
          { id:'writ.featureTitleSize', label:'Feature title font size', type:'size',  cssVar:'--writers-feature-title-size',  default:'15', min:11, max:22 },
        ],
      },
    ],
  },

  {
    label: 'Marquee Bar', icon: '📢',
    sections: [
      {
        id: 'marquee', label: 'Scrolling Marquee Bar',
        fields: [
          { id:'mq.bg',         label:'Bar background colour',    type:'color', cssVar:'--marquee-bg',         default:'#0A5F55' },
          { id:'mq.textColor',  label:'Text colour',              type:'color', cssVar:'--marquee-text-color',  default:'rgba(255,255,255,0.8)' },
          { id:'mq.dotColor',   label:'Dot separator colour',     type:'color', cssVar:'--marquee-dot-color',   default:'#12A090' },
          { id:'mq.fontSize',   label:'Font size',                type:'size',  cssVar:'--marquee-font-size',   default:'13', min:10, max:18 },
        ],
      },
    ],
  },
  {
    label: 'Write Page', icon: '✍️',
    sections: [
      {
        id: 'write', label: 'Write / Editor Page',
        fields: [
          { id:'write.bg',           label:'Page background',          type:'color', cssVar:'--write-bg',              default:'#FDF6EC' },
          { id:'write.titleColor',   label:'Page heading colour',      type:'color', cssVar:'--write-title-color',     default:'#1A1208' },
          { id:'write.titleSize',    label:'Page heading font size',   type:'size',  cssVar:'--write-title-size',      default:'36', min:20, max:56 },
          { id:'write.toolbarBg',    label:'Toolbar background',       type:'color', cssVar:'--write-toolbar-bg',      default:'rgba(253,246,236,0.95)' },
          { id:'write.btnPublishBg', label:'Publish button background',type:'color', cssVar:'--write-publish-btn-bg',  default:'#0A5F55' },
          { id:'write.btnPublishColor',label:'Publish button text',    type:'color', cssVar:'--write-publish-btn-color',default:'#ffffff' },
        ],
      },
    ],
  },
  {
    label: 'Post Detail Page', icon: '📄',
    sections: [
      {
        id: 'post-detail', label: 'Single Post View',
        fields: [
          { id:'pd.bg',             label:'Page background',          type:'color', cssVar:'--post-page-bg',           default:'#FDF6EC' },
          { id:'pd.titleColor',     label:'Article title colour',     type:'color', cssVar:'--post-page-title-color',  default:'#1A1208' },
          { id:'pd.titleSize',      label:'Article title font size',  type:'size',  cssVar:'--post-page-title-size',   default:'52', min:24, max:80 },
          { id:'pd.excerptColor',   label:'Excerpt / intro colour',   type:'color', cssVar:'--post-page-excerpt-color',default:'#7A6A52' },
          { id:'pd.excerptSize',    label:'Excerpt font size',        type:'size',  cssVar:'--post-page-excerpt-size', default:'19', min:13, max:28 },
          { id:'pd.bodyColor',      label:'Body text colour',         type:'color', cssVar:'--post-page-body-color',   default:'#1A1208' },
          { id:'pd.bodySize',       label:'Body text font size',      type:'size',  cssVar:'--post-page-body-size',    default:'16', min:13, max:22 },
          { id:'pd.authorNameColor',label:'Author name colour',       type:'color', cssVar:'--post-author-name-color', default:'#1A1208' },
          { id:'pd.metaColor',      label:'Meta text colour (date, read time)', type:'color', cssVar:'--post-meta-color', default:'#7A6A52' },
          { id:'pd.catTagColor',    label:'Category tag colour',      type:'color', cssVar:'--post-page-cat-color',    default:'#0A5F55' },
          { id:'pd.commentBg',      label:'Comments section background', type:'color', cssVar:'--post-comment-bg',    default:'#ffffff' },
          { id:'pd.commentBodyColor',label:'Comment text colour',     type:'color', cssVar:'--post-comment-color',     default:'#1A1208' },
        ],
      },
    ],
  },
  {
    label: 'Profile Page', icon: '👤',
    sections: [
      {
        id: 'profile', label: 'Public Profile Page',
        fields: [
          { id:'prof.bg',           label:'Page background',          type:'color', cssVar:'--profile-bg',             default:'#FDF6EC' },
          { id:'prof.nameColor',    label:'Name colour',              type:'color', cssVar:'--profile-name-color',     default:'#1A1208' },
          { id:'prof.nameSize',     label:'Name font size',           type:'size',  cssVar:'--profile-name-size',      default:'26', min:18, max:48 },
          { id:'prof.roleColor',    label:'Role / designation colour',type:'color', cssVar:'--profile-role-color',     default:'#7A6A52' },
          { id:'prof.roleSize',     label:'Role font size',           type:'size',  cssVar:'--profile-role-size',      default:'14', min:11, max:20 },
          { id:'prof.bioColor',     label:'Bio text colour',          type:'color', cssVar:'--profile-bio-color',      default:'#7A6A52' },
          { id:'prof.bioSize',      label:'Bio font size',            type:'size',  cssVar:'--profile-bio-size',       default:'14', min:11, max:20 },
          { id:'prof.statNumColor', label:'Stats number colour',      type:'color', cssVar:'--profile-stat-num-color', default:'#1A1208' },
          { id:'prof.statNumSize',  label:'Stats number font size',   type:'size',  cssVar:'--profile-stat-num-size',  default:'24', min:14, max:40 },
          { id:'prof.statLabelColor',label:'Stats label colour',      type:'color', cssVar:'--profile-stat-label-color',default:'#7A6A52' },
          { id:'prof.cardBg',       label:'Post card background',     type:'color', cssVar:'--profile-post-card-bg',   default:'#ffffff' },
          { id:'prof.articleTitleColor',label:'Article title colour', type:'color', cssVar:'--profile-article-title-color',default:'#1A1208' },
          { id:'prof.articleTitleSize', label:'Article title size',   type:'size',  cssVar:'--profile-article-title-size', default:'18', min:13, max:26 },
          { id:'prof.followBtnBg',  label:'Follow button background', type:'color', cssVar:'--profile-follow-btn-bg',  default:'#0A5F55' },
          { id:'prof.followBtnColor',label:'Follow button text',      type:'color', cssVar:'--profile-follow-btn-color',default:'#ffffff' },
        ],
      },
    ],
  },
  {
    label: 'Forgot / Reset Password', icon: '🔑',
    sections: [
      {
        id: 'forgot', label: 'Forgot & Reset Password Pages',
        fields: [
          { id:'fp.bg',            label:'Page background',           type:'color', cssVar:'--forgot-bg',              default:'#FDF6EC' },
          { id:'fp.cardBg',        label:'Card background',           type:'color', cssVar:'--forgot-card-bg',         default:'#ffffff' },
          { id:'fp.titleColor',    label:'Heading colour',            type:'color', cssVar:'--forgot-h1-color',        default:'#1A1208' },
          { id:'fp.titleSize',     label:'Heading font size',         type:'size',  cssVar:'--forgot-h1-size',         default:'28', min:18, max:48 },
          { id:'fp.subtitleColor', label:'Subtitle text colour',      type:'color', cssVar:'--forgot-subtitle-color',  default:'#7A6A52' },
          { id:'fp.btnBg',         label:'Submit button background',  type:'color', cssVar:'--forgot-btn-bg',          default:'#0A5F55' },
          { id:'fp.btnColor',      label:'Submit button text colour', type:'color', cssVar:'--forgot-btn-color',       default:'#ffffff' },
          { id:'fp.inputBorder',   label:'Input border colour',       type:'color', cssVar:'--forgot-input-border',    default:'#EDE0C8' },
        ],
      },
    ],
  },
  {
    label: 'Error / 404 Page', icon: '🚫',
    sections: [
      {
        id: 'error', label: 'Error & 404 Page',
        fields: [
          { id:'err.bg',           label:'Page background',           type:'color', cssVar:'--error-bg',               default:'#FDF6EC' },
          { id:'err.codeColor',    label:'Error code colour (404)',   type:'color', cssVar:'--error-code-color',       default:'#EDE0C8' },
          { id:'err.titleColor',   label:'Title colour',              type:'color', cssVar:'--error-h1-color',         default:'#1A1208' },
          { id:'err.titleSize',    label:'Title font size',           type:'size',  cssVar:'--error-title-size',       default:'28', min:18, max:48 },
          { id:'err.descColor',    label:'Description colour',        type:'color', cssVar:'--error-desc-color',       default:'#7A6A52' },
          { id:'err.btnBg',        label:'Back button background',    type:'color', cssVar:'--error-btn-bg',           default:'#0A5F55' },
          { id:'err.btnColor',     label:'Back button text colour',   type:'color', cssVar:'--error-btn-color',        default:'#ffffff' },
        ],
      },
    ],
  },
  {
    label: 'EdTech Articles Page', icon: '💡',
    sections: [
      {
        id: 'edtech-articles', label: '/edtech-articles',
        fields: [
          { id:'ea.heroBg',        label:'Hero background',           type:'color', cssVar:'--edtech-hero-bg',         default:'#0A5F55' },
          { id:'ea.heroColor',     label:'Hero text colour',          type:'color', cssVar:'--edtech-hero-color',      default:'#ffffff' },
          { id:'ea.heroTitleSize', label:'Hero title font size',      type:'size',  cssVar:'--edtech-hero-title-size', default:'48', min:24, max:80 },
          { id:'ea.pageBg',        label:'Page background',           type:'color', cssVar:'--edtech-articles-bg',     default:'#FDF6EC' },
          { id:'ea.pillBg',        label:'Topic pill background',     type:'color', cssVar:'--edtech-pill-bg',         default:'#ffffff' },
          { id:'ea.pillBorder',    label:'Topic pill border',         type:'color', cssVar:'--edtech-pill-border',     default:'#EDE0C8' },
          { id:'ea.pillTextColor', label:'Topic pill text colour',    type:'color', cssVar:'--edtech-pill-text',       default:'#1A1208' },
          { id:'ea.viewAllBg',     label:'"View All" button background', type:'color', cssVar:'--edtech-view-all-bg', default:'transparent' },
          { id:'ea.viewAllColor',  label:'"View All" button text',   type:'color', cssVar:'--edtech-view-all-color',  default:'#0A5F55' },
          { id:'ea.viewAllBorder', label:'"View All" button border',  type:'color', cssVar:'--edtech-view-all-border', default:'#0A5F55' },
        ],
      },
    ],
  },
  {
    label: 'EdTech Stories Page', icon: '✍️',
    sections: [
      {
        id: 'edtech-stories', label: '/edtech-stories',
        fields: [
          { id:'es.heroBg',        label:'Hero background',           type:'color', cssVar:'--edtech-stories-hero-bg',    default:'#3D1F5E' },
          { id:'es.heroColor',     label:'Hero text colour',          type:'color', cssVar:'--edtech-stories-hero-color', default:'#ffffff' },
          { id:'es.heroTitleSize', label:'Hero title font size',      type:'size',  cssVar:'--edtech-stories-title-size', default:'48', min:24, max:80 },
          { id:'es.pageBg',        label:'Page background',           type:'color', cssVar:'--edtech-stories-bg',         default:'#ffffff' },
          { id:'es.featuredBg',    label:'Featured story background', type:'color', cssVar:'--edtech-featured-bg',        default:'#ffffff' },
          { id:'es.ctaBg',         label:'Bottom CTA background',     type:'color', cssVar:'--edtech-stories-cta-bg',     default:'#3D1F5E' },
          { id:'es.ctaBtnBg',      label:'CTA button background',     type:'color', cssVar:'--edtech-stories-cta-btn-bg', default:'#ffffff' },
          { id:'es.ctaBtnColor',   label:'CTA button text',           type:'color', cssVar:'--edtech-stories-cta-btn-color',default:'#3D1F5E' },
        ],
      },
    ],
  },
  {
    label: 'School Leadership Page', icon: '🏆',
    sections: [
      {
        id: 'school-leadership', label: '/school-leadership',
        fields: [
          { id:'sl.heroBg',        label:'Hero background',           type:'color', cssVar:'--leadership-hero-bg',     default:'#C9922A' },
          { id:'sl.heroColor',     label:'Hero text colour',          type:'color', cssVar:'--leadership-hero-color',  default:'#ffffff' },
          { id:'sl.heroTitleSize', label:'Hero title font size',      type:'size',  cssVar:'--leadership-hero-title-size',default:'48', min:24, max:80 },
          { id:'sl.pageBg',        label:'Page background',           type:'color', cssVar:'--leadership-bg',          default:'#FDF6EC' },
          { id:'sl.pillarBg',      label:'Pillar card background',    type:'color', cssVar:'--leadership-pillar-bg',   default:'#ffffff' },
          { id:'sl.accent',        label:'Accent colour (gold)',      type:'color', cssVar:'--leadership-accent',      default:'#C9922A' },
          { id:'sl.viewAllBg',     label:'"View All" button background',type:'color',cssVar:'--leadership-view-all-bg',default:'transparent' },
          { id:'sl.viewAllColor',  label:'"View All" button text',    type:'color', cssVar:'--leadership-view-all-color',default:'#C9922A' },
        ],
      },
    ],
  },
  {
    label: 'Innovation Page', icon: '🚀',
    sections: [
      {
        id: 'innovation', label: '/innovation',
        fields: [
          { id:'in.heroBg',        label:'Hero background',           type:'color', cssVar:'--innovation-hero-bg',        default:'#3D1F5E' },
          { id:'in.heroColor',     label:'Hero text colour',          type:'color', cssVar:'--innovation-hero-color',     default:'#ffffff' },
          { id:'in.heroTitleSize', label:'Hero title font size',      type:'size',  cssVar:'--innovation-hero-title-size',default:'48', min:24, max:80 },
          { id:'in.pageBg',        label:'Page background',           type:'color', cssVar:'--innovation-bg',             default:'#FDF6EC' },
          { id:'in.tagActiveBg',   label:'Active tag background',     type:'color', cssVar:'--innovation-tag-active-bg',  default:'#0A5F55' },
          { id:'in.tagActiveColor',label:'Active tag text colour',    type:'color', cssVar:'--innovation-tag-active-color',default:'#ffffff' },
          { id:'in.tagBorder',     label:'Tag border colour',         type:'color', cssVar:'--innovation-tag-border',     default:'rgba(255,255,255,0.1)' },
          { id:'in.accent',        label:'Accent colour',             type:'color', cssVar:'--innovation-accent',         default:'#3D1F5E' },
        ],
      },
    ],
  },
]

type Field = { id:string; label:string; type:'text'|'textarea'|'color'|'size'; cssVar:string; default:string; min?:number; max?:number }

/* Build flat map of all fields */
const ALL_FIELDS: Record<string, Field> = {}
PAGES.forEach(p => p.sections.forEach(s => s.fields.forEach(f => { ALL_FIELDS[f.id] = f })))

/* ─── Convert field values → CSS var block ────────────────────── */
function buildCSSVars(values: Record<string,string>): string {
  const lines = Object.entries(ALL_FIELDS).map(([id, field]) => {
    const val = values[id] ?? field.default
    const cssVal = field.type === 'size' ? `${val}px` : val
    return `  ${field.cssVar}: ${cssVal};`
  })
  return `:root {\n${lines.join('\n')}\n}`
}

/* ─── Components ──────────────────────────────────────────────── */
const inp: React.CSSProperties = { width:'100%', padding:'9px 12px', background:'#fff', border:'1.5px solid var(--parchment)', borderRadius:'9px', fontSize:'13px', fontFamily:'var(--font-sans)', color:'var(--ink)', outline:'none', boxSizing:'border-box' as const }
const lbl: React.CSSProperties = { display:'block', fontSize:'10px', fontWeight:700, letterSpacing:'1.2px', textTransform:'uppercase' as const, color:'var(--muted)', fontFamily:'var(--font-mono)', marginBottom:'5px' }

function FieldRow({ field, value, onChange }: { field:Field; value:string; onChange:(v:string)=>void }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'12px', padding:'10px 0', borderBottom:'1px solid var(--border2)' }}>
      <label style={{ ...lbl, marginBottom:0, minWidth:'180px', flexShrink:0 }}>{field.label}</label>
      <div style={{ flex:1 }}>
        {field.type === 'color' && (
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <input type="color" value={value||field.default}
              onChange={e=>onChange(e.target.value)}
              style={{ width:36, height:32, border:'1.5px solid var(--parchment)', borderRadius:'7px', padding:'2px', cursor:'pointer', background:'none', flexShrink:0 }} />
            <input type="text" value={value||field.default}
              onChange={e=>onChange(e.target.value)}
              style={{ ...inp, fontFamily:'var(--font-mono)', fontSize:'12px', maxWidth:'160px' }} />
          </div>
        )}
        {field.type === 'size' && (
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <input type="range" min={field.min||8} max={field.max||100} value={Number(value||field.default)}
              onChange={e=>onChange(e.target.value)}
              style={{ flex:1, accentColor:'var(--teal)', cursor:'pointer' }} />
            <span style={{ fontFamily:'var(--font-mono)', fontSize:'12px', fontWeight:700, color:'var(--teal)', minWidth:'52px', textAlign:'right' as const }}>
              {value||field.default}px
            </span>
          </div>
        )}
        {field.type === 'text' && (
          <input type="text" value={value||field.default} onChange={e=>onChange(e.target.value)} style={inp} />
        )}
        {field.type === 'textarea' && (
          <textarea value={value||field.default} onChange={e=>onChange(e.target.value)}
            style={{ ...inp, resize:'vertical' as const, lineHeight:1.6 }} rows={2} />
        )}
      </div>
      <button onClick={()=>onChange(field.default)}
        title="Reset to default"
        style={{ padding:'4px 8px', borderRadius:'6px', border:'1px solid var(--border)', background:'transparent', color:'var(--muted)', cursor:'pointer', fontSize:'11px', flexShrink:0, fontFamily:'var(--font-sans)' }}>
        Reset
      </button>
    </div>
  )
}

export default function AdminContentPage() {
  const [values,    setValues]    = useState<Record<string,string>>({})
  const [openPages, setOpenPages] = useState<Record<string,boolean>>({ 'Homepage':true })
  const [unsaved,   setUnsaved]   = useState(false)

  const { data: saved } = useQuery({
    queryKey: ['admin-content-v2'],
    queryFn: async () => {
      const res = await fetch('/api/admin/content')
      const all = await res.json()
      return all['content.styles'] ?? {}
    },
    staleTime: Infinity,
  })

  useEffect(() => {
    if (saved) setValues(saved)
  }, [saved])

  const set = useCallback((id:string, v:string) => {
    setValues(p => ({ ...p, [id]: v }))
    setUnsaved(true)
    // Live preview — apply CSS var immediately to the page
    const field = ALL_FIELDS[id]
    if (field) {
      const cssVal = field.type === 'size' ? `${v}px` : v
      document.documentElement.style.setProperty(field.cssVar, cssVal)
    }
  }, [])

  const saveMutation = useMutation({
    mutationFn: () => apiPost('/admin/content', { key: 'content.styles', value: values }),
    onSuccess: async () => {
      // Also save the full CSS block as a separate key for layout.tsx to inject
      const css = buildCSSVars(values)
      await apiPost('/admin/content', { key: 'content.css', value: css })
      toast.success('✅ Saved! Changes applied to site immediately.')
      setUnsaved(false)
    },
    onError: () => toast.error('Failed to save'),
  })

  const togglePage = (label:string) => setOpenPages(p => ({ ...p, [label]: !p[label] }))

  return (
    <AdminLayout title="Content & Style Manager" subtitle="Change any text, colour, font size or button style — updates apply live instantly">

      {/* Top bar */}
      <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'20px', padding:'12px 16px', background:'#fff', border:'1px solid var(--border)', borderRadius:'12px' }}>
        <div style={{ width:9, height:9, borderRadius:'50%', background: unsaved?'var(--gold)':'#4ADE80', boxShadow: unsaved?'0 0 8px rgba(201,146,42,.5)':'0 0 8px rgba(74,222,128,.4)' }} />
        <span style={{ fontSize:'12px', color:'var(--muted)', flex:1, fontFamily:'var(--font-sans)' }}>
          {unsaved ? '⚠ Unsaved changes — click Save to apply to live site' : '✓ All changes saved and live'}
        </span>
        <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || !unsaved}
          style={{ display:'flex', alignItems:'center', gap:'7px', padding:'10px 24px', borderRadius:'9px', background:'var(--teal)', border:'none', color:'#fff', cursor: (saveMutation.isPending||!unsaved)?'not-allowed':'pointer', fontSize:'13px', fontWeight:700, fontFamily:'var(--font-sans)', opacity:(saveMutation.isPending||!unsaved)?.6:1, boxShadow:'0 4px 14px rgba(10,95,85,.3)' }}>
          {saveMutation.isPending ? <><Loader2 style={{width:14,height:14,animation:'spin 1s linear infinite'}}/>Saving…</> : <><Globe style={{width:14,height:14}}/>Save to Site</>}
        </button>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
        {PAGES.map(page => (
          <div key={page.label} style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'14px', overflow:'hidden' }}>
            {/* Page header */}
            <button onClick={()=>togglePage(page.label)}
              style={{ width:'100%', display:'flex', alignItems:'center', gap:'12px', padding:'14px 18px', border:'none', background: openPages[page.label] ? 'rgba(10,95,85,.04)' : '#fff', cursor:'pointer', textAlign:'left' as const }}>
              <span style={{ fontSize:'18px' }}>{page.icon}</span>
              <span style={{ fontFamily:'var(--font-serif)', fontSize:'15px', fontWeight:700, color:'var(--ink)', flex:1 }}>{page.label}</span>
              <span style={{ fontSize:'11px', color:'var(--muted)', fontFamily:'var(--font-mono)' }}>{page.sections.reduce((a,s)=>a+s.fields.length,0)} controls</span>
              {openPages[page.label] ? <ChevronDown style={{width:16,height:16,color:'var(--muted)'}} /> : <ChevronRight style={{width:16,height:16,color:'var(--muted)'}} />}
            </button>

            {openPages[page.label] && page.sections.map(section => (
              <div key={section.id} style={{ borderTop:'1px solid var(--border2)' }}>
                <div style={{ padding:'10px 18px 6px', fontFamily:'var(--font-mono)', fontSize:'9px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase' as const, color:'var(--teal)', background:'rgba(10,95,85,.02)' }}>
                  {section.label}
                </div>
                <div style={{ padding:'0 18px 8px' }}>
                  {section.fields.map(field => (
                    <FieldRow key={field.id} field={field} value={values[field.id]??''} onChange={v=>set(field.id,v)} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </AdminLayout>
  )
}