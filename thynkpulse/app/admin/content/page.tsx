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
  {
    label: 'Community Cards Text', icon: '🤝',
    sections: [
      {
        id: 'communities-text', label: 'Edit Each Community Card',
        fields: [
          { id:'comm1.title', label:'Card 1 — Title',       type:'text',    cssVar:'--comm-1-title',  default:'Educators & Teachers' },
          { id:'comm1.desc',  label:'Card 1 — Description', type:'textarea',cssVar:'--comm-1-desc',   default:'Share classroom innovations, teaching methods, and real challenges.' },
          { id:'comm1.count', label:'Card 1 — Member count',type:'text',    cssVar:'--comm-1-count',  default:'3,200+ educators' },
          { id:'comm2.title', label:'Card 2 — Title',       type:'text',    cssVar:'--comm-2-title',  default:'EdTech Companies' },
          { id:'comm2.desc',  label:'Card 2 — Description', type:'textarea',cssVar:'--comm-2-desc',   default:'Publish thought leadership, product insights, and case studies.' },
          { id:'comm2.count', label:'Card 2 — Member count',type:'text',    cssVar:'--comm-2-count',  default:'180+ companies' },
          { id:'comm3.title', label:'Card 3 — Title',       type:'text',    cssVar:'--comm-3-title',  default:'Sales Professionals' },
          { id:'comm3.desc',  label:'Card 3 — Description', type:'textarea',cssVar:'--comm-3-desc',   default:'Real conversations about selling in education.' },
          { id:'comm3.count', label:'Card 3 — Member count',type:'text',    cssVar:'--comm-3-count',  default:'840+ professionals' },
          { id:'comm4.title', label:'Card 4 — Title',       type:'text',    cssVar:'--comm-4-title',  default:'School Leaders' },
          { id:'comm4.desc',  label:'Card 4 — Description', type:'textarea',cssVar:'--comm-4-desc',   default:'Principals and administrators sharing governance insights.' },
          { id:'comm4.count', label:'Card 4 — Member count',type:'text',    cssVar:'--comm-4-count',  default:'620+ leaders' },
          { id:'comm5.title', label:'Card 5 — Title',       type:'text',    cssVar:'--comm-5-title',  default:'Researchers & Innovators' },
          { id:'comm5.desc',  label:'Card 5 — Description', type:'textarea',cssVar:'--comm-5-desc',   default:'Bridge the gap between academic research and classroom practice.' },
          { id:'comm5.count', label:'Card 5 — Member count',type:'text',    cssVar:'--comm-5-count',  default:'290+ researchers' },
          { id:'comm6.title', label:'Card 6 — Title',       type:'text',    cssVar:'--comm-6-title',  default:'International Educators' },
          { id:'comm6.desc',  label:'Card 6 — Description', type:'textarea',cssVar:'--comm-6-desc',   default:'Education challenges are global. Connect with practitioners from 40+ countries.' },
          { id:'comm6.count', label:'Card 6 — Member count',type:'text',    cssVar:'--comm-6-count',  default:'40+ countries' },
        ],
      },
    ],
  },
  {
    label: 'Trending Items Text', icon: '🔥',
    sections: [
      {
        id: 'trending-text', label: 'Edit Trending Articles & Topics',
        fields: [
          { id:'tr1.tag',   label:'Item 1 — Category tag', type:'text', cssVar:'--tr-1-tag',   default:'EdTech · AI' },
          { id:'tr1.title', label:'Item 1 — Title',        type:'text', cssVar:'--tr-1-title', default:"GPT in the Classroom: A Teacher's 6-Month Honest Review" },
          { id:'tr2.tag',   label:'Item 2 — Category tag', type:'text', cssVar:'--tr-2-tag',   default:'School Leadership' },
          { id:'tr2.title', label:'Item 2 — Title',        type:'text', cssVar:'--tr-2-title', default:'Why I Turned Down a ₹50L EdTech Deal (And What I Learned)' },
          { id:'tr3.tag',   label:'Item 3 — Category tag', type:'text', cssVar:'--tr-3-tag',   default:'Sales · Career' },
          { id:'tr3.title', label:'Item 3 — Title',        type:'text', cssVar:'--tr-3-title', default:'The Education Sales Playbook Nobody Talks About' },
          { id:'tr4.tag',   label:'Item 4 — Category tag', type:'text', cssVar:'--tr-4-tag',   default:'Educator · Story' },
          { id:'tr4.title', label:'Item 4 — Title',        type:'text', cssVar:'--tr-4-title', default:'I Quit a Private School to Teach in a Government School. Here is Why.' },
          { id:'tr5.tag',   label:'Item 5 — Category tag', type:'text', cssVar:'--tr-5-tag',   default:'EdTech · Funding' },
          { id:'tr5.title', label:'Item 5 — Title',        type:'text', cssVar:'--tr-5-title', default:'What EdTech Investors Actually Look for in 2025' },
          { id:'topics.all',label:'Browse Topics (comma separated)', type:'textarea', cssVar:'--topics-all', default:'AI in Education,School Leadership,EdTech Sales,NEP 2020,Teacher Training,Ed-Finance,STEM,Ed Policy' },
        ],
      },
    ],
  },
  {
    label: 'Writers Spotlight Text', icon: '✍️',
    sections: [
      {
        id: 'writers-text', label: 'Profile Card & Features',
        fields: [
          { id:'ws.writerName',  label:'Writer name',          type:'text',    cssVar:'--ws-writer-name',  default:'Ananya Krishnan' },
          { id:'ws.writerRole',  label:'Writer role / location',type:'text',   cssVar:'--ws-writer-role',  default:'EdTech Product Lead · Mumbai' },
          { id:'ws.writerQuote', label:'Writer quote / bio',   type:'textarea',cssVar:'--ws-writer-quote', default:'Building products for the next 200 million learners. Writing about EdTech, product strategy, and what failure in education tech actually looks like from the inside.' },
          { id:'ws.stat1n',      label:'Stat 1 — Number',      type:'text',    cssVar:'--ws-stat1-n',      default:'48' },
          { id:'ws.stat1l',      label:'Stat 1 — Label',        type:'text',    cssVar:'--ws-stat1-l',      default:'Articles' },
          { id:'ws.stat2n',      label:'Stat 2 — Number',      type:'text',    cssVar:'--ws-stat2-n',      default:'12K' },
          { id:'ws.stat2l',      label:'Stat 2 — Label',        type:'text',    cssVar:'--ws-stat2-l',      default:'Followers' },
          { id:'ws.stat3n',      label:'Stat 3 — Number',      type:'text',    cssVar:'--ws-stat3-n',      default:'340K' },
          { id:'ws.stat3l',      label:'Stat 3 — Label',        type:'text',    cssVar:'--ws-stat3-l',      default:'Reads' },
          { id:'ws.badgeMonth',  label:'Floating badge number',type:'text',    cssVar:'--ws-badge-month',  default:'+1.4K' },
          { id:'ws.badgeLabel',  label:'Floating badge label',  type:'text',    cssVar:'--ws-badge-label',  default:'↑ New followers' },
          { id:'ws.sectionDesc', label:'Section description',   type:'textarea',cssVar:'--ws-section-desc', default:'Every writer on Thynk Pulse gets a rich, professional profile that showcases expertise, audience, and impact.' },
          { id:'ws.ctaLabel',    label:'CTA button text',       type:'text',    cssVar:'--ws-cta-label',    default:'Create Your Profile →' },
          { id:'ws.feat1title',  label:'Feature 1 — Title',    type:'text',    cssVar:'--ws-feat1-title',  default:'Verified Expert Badges' },
          { id:'ws.feat1desc',   label:'Feature 1 — Description',type:'textarea',cssVar:'--ws-feat1-desc',default:'Get recognized as an Educator, EdTech Professional, Researcher, or School Leader.' },
          { id:'ws.feat2title',  label:'Feature 2 — Title',    type:'text',    cssVar:'--ws-feat2-title',  default:'Rich Analytics Dashboard' },
          { id:'ws.feat2desc',   label:'Feature 2 — Description',type:'textarea',cssVar:'--ws-feat2-desc',default:'Track reads, followers, engagement, and article performance.' },
          { id:'ws.feat3title',  label:'Feature 3 — Title',    type:'text',    cssVar:'--ws-feat3-title',  default:'Shareable Public Profile' },
          { id:'ws.feat3desc',   label:'Feature 3 — Description',type:'textarea',cssVar:'--ws-feat3-desc',default:'Your Thynk Pulse profile is a living portfolio — share it on LinkedIn and resumes.' },
          { id:'ws.feat4title',  label:'Feature 4 — Title',    type:'text',    cssVar:'--ws-feat4-title',  default:'Community Amplification' },
          { id:'ws.feat4desc',   label:'Feature 4 — Description',type:'textarea',cssVar:'--ws-feat4-desc',default:'Top articles get featured in our weekly newsletter reaching 10K+ professionals.' },
        ],
      },
    ],
  },
  {
    label: 'CTA Section Text', icon: '📣',
    sections: [
      {
        id: 'cta-text', label: 'Join / CTA Section',
        fields: [
          { id:'cta.badge',       label:'Badge text',              type:'text',    cssVar:'--cta-badge',       default:'Completely Free · No Credit Card' },
          { id:'cta.headline',    label:'Headline (use \n for line break)', type:'textarea', cssVar:'--cta-headline', default:"Join Thynk Pulse. Shape Education's Future." },
          { id:'cta.subtitle',    label:'Subtitle paragraph',      type:'textarea',cssVar:'--cta-subtitle',    default:"Be part of India's most vibrant education community. Share your story, build your audience." },
          { id:'cta.placeholder', label:'Email input placeholder', type:'text',    cssVar:'--cta-placeholder', default:'Enter your work email' },
          { id:'cta.btnText',     label:'Button text',             type:'text',    cssVar:'--cta-btn-text',    default:'Join Free →' },
          { id:'cta.footnote',    label:'Footnote text',           type:'text',    cssVar:'--cta-footnote',    default:'🔒 No spam. No paywall. Free forever.' },
          { id:'cta.feat1icon',   label:'Feature 1 — Icon (emoji)',type:'text',    cssVar:'--cta-feat1-icon',  default:'✍️' },
          { id:'cta.feat1title',  label:'Feature 1 — Title',       type:'text',    cssVar:'--cta-feat1-title', default:'Write & Publish' },
          { id:'cta.feat1desc',   label:'Feature 1 — Description', type:'textarea',cssVar:'--cta-feat1-desc',  default:'Share your experiences and build a readership of 10,000+ education professionals.' },
          { id:'cta.feat2icon',   label:'Feature 2 — Icon (emoji)',type:'text',    cssVar:'--cta-feat2-icon',  default:'🤝' },
          { id:'cta.feat2title',  label:'Feature 2 — Title',       type:'text',    cssVar:'--cta-feat2-title', default:'Connect & Collaborate' },
          { id:'cta.feat2desc',   label:'Feature 2 — Description', type:'textarea',cssVar:'--cta-feat2-desc',  default:'Network with educators, EdTech founders, and innovators across India and beyond.' },
          { id:'cta.feat3icon',   label:'Feature 3 — Icon (emoji)',type:'text',    cssVar:'--cta-feat3-icon',  default:'📈' },
          { id:'cta.feat3title',  label:'Feature 3 — Title',       type:'text',    cssVar:'--cta-feat3-title', default:'Grow Your Brand' },
          { id:'cta.feat3desc',   label:'Feature 3 — Description', type:'textarea',cssVar:'--cta-feat3-desc',  default:'Build authentic authority in the education space with your verified expert profile.' },
        ],
      },
    ],
  },
  {
    label: 'Marquee Items Text', icon: '📢',
    sections: [
      {
        id: 'marquee-text', label: 'Scrolling Bar Items',
        fields: [
          { id:'mq.item1', label:'Item 1', type:'text', cssVar:'--mq-item1', default:'🎓 For Educators' },
          { id:'mq.item2', label:'Item 2', type:'text', cssVar:'--mq-item2', default:'💡 For Innovators' },
          { id:'mq.item3', label:'Item 3', type:'text', cssVar:'--mq-item3', default:'🏢 For EdTech Companies' },
          { id:'mq.item4', label:'Item 4', type:'text', cssVar:'--mq-item4', default:'📊 For Sales Professionals' },
          { id:'mq.item5', label:'Item 5', type:'text', cssVar:'--mq-item5', default:'🏫 For School Leaders' },
          { id:'mq.item6', label:'Item 6', type:'text', cssVar:'--mq-item6', default:'🔬 For Researchers' },
          { id:'mq.item7', label:'Item 7', type:'text', cssVar:'--mq-item7', default:'🌍 For Global Educators' },
          { id:'mq.item8', label:'Item 8', type:'text', cssVar:'--mq-item8', default:'✍️ Share Your Story' },
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
  const [values,      setValues]      = useState<Record<string,string>>({})
  const [openPages,   setOpenPages]   = useState<Record<string,boolean>>({ 'Homepage':true })
  const [activeGroup, setActiveGroup] = useState<string>('Homepage')
  const [savedGroups, setSavedGroups] = useState<Record<string,boolean>>({})
  const [dirtyGroups, setDirtyGroups] = useState<Record<string,boolean>>({})

  const { data: saved } = useQuery({
    queryKey: ['admin-content-v2'],
    queryFn: async () => {
      const res = await fetch('/api/admin/content')
      const all = await res.json()
      const styles = all['content.styles'] ?? {}

      // Pre-populate text fields from saved component data
      const comms = all['content.communities'] ?? []
      comms.forEach((comm:any, i:number) => {
        const n = i+1
        if (comm.title) styles[`comm${n}.title`] = comm.title
        if (comm.desc)  styles[`comm${n}.desc`]  = comm.desc
        if (comm.count) styles[`comm${n}.count`] = comm.count
      })

      const ts = all['content.trending-section'] ?? {}
      if (Array.isArray(ts.items)) ts.items.forEach((t:any,i:number) => {
        const n = i+1
        if (t.tag)   styles[`tr${n}.tag`]   = t.tag
        if (t.title) styles[`tr${n}.title`] = t.title
      })
      if (Array.isArray(ts.topics)) styles['topics.all'] = ts.topics.join(',')

      const ws = all['content.writers-spotlight'] ?? {}
      if (ws.writerName)  styles['ws.writerName']  = ws.writerName
      if (ws.writerRole)  styles['ws.writerRole']  = ws.writerRole
      if (ws.writerQuote) styles['ws.writerQuote'] = ws.writerQuote
      if (ws.badgeMonth)  styles['ws.badgeMonth']  = ws.badgeMonth
      if (ws.badgeLabel)  styles['ws.badgeLabel']  = ws.badgeLabel
      if (ws.sectionDesc) styles['ws.sectionDesc'] = ws.sectionDesc
      if (ws.ctaLabel)    styles['ws.ctaLabel']    = ws.ctaLabel
      if (Array.isArray(ws.writerStats)) ws.writerStats.forEach(([n,l]:string[],i:number) => {
        styles[`ws.stat${i+1}n`] = n; styles[`ws.stat${i+1}l`] = l
      })
      if (Array.isArray(ws.features)) ws.features.forEach((f:any,i:number) => {
        styles[`ws.feat${i+1}title`] = f.title; styles[`ws.feat${i+1}desc`] = f.desc
      })

      const cs = all['content.cta-section'] ?? {}
      if (cs.badge)       styles['cta.badge']       = cs.badge
      if (cs.headline)    styles['cta.headline']    = cs.headline
      if (cs.subtitle)    styles['cta.subtitle']    = cs.subtitle
      if (cs.placeholder) styles['cta.placeholder'] = cs.placeholder
      if (cs.btnLabel)    styles['cta.btnText']     = cs.btnLabel
      if (cs.footnote)    styles['cta.footnote']    = cs.footnote
      if (Array.isArray(cs.features)) cs.features.forEach((f:any,i:number) => {
        styles[`cta.feat${i+1}icon`]  = f.icon
        styles[`cta.feat${i+1}title`] = f.title
        styles[`cta.feat${i+1}desc`]  = f.desc
      })

      const mq = all['content.marquee'] ?? {}
      if (Array.isArray(mq.items)) mq.items.forEach((item:string,i:number) => {
        styles[`mq.item${i+1}`] = item
      })

      return styles
    },
    staleTime: Infinity,
  })

  useEffect(() => { if (saved) setValues(saved) }, [saved])

  const set = useCallback((id:string, v:string) => {
    setValues(p => ({ ...p, [id]: v }))
    setDirtyGroups(p => ({ ...p, [activeGroup]: true }))
    setSavedGroups(p => ({ ...p, [activeGroup]: false }))
    const field = ALL_FIELDS[id]
    if (field) {
      const cssVal = field.type === 'size' ? `${v}px` : v
      document.documentElement.style.setProperty(field.cssVar, cssVal)
    }
  }, [activeGroup])

  // Save current group locally (in-memory, marks it ready to push)
  const saveGroup = () => {
    setSavedGroups(p => ({ ...p, [activeGroup]: true }))
    setDirtyGroups(p => ({ ...p, [activeGroup]: false }))
    toast.success(`✅ "${activeGroup}" saved — click Push to Site when ready.`)
  }

  // Push ALL saved groups to the live site database
  const pushMutation = useMutation({
    mutationFn: async () => {
      await apiPost('/admin/content', { key: 'content.styles', value: values })
      const css = buildCSSVars(values)
      await apiPost('/admin/content', { key: 'content.css', value: css })

      const comms = [1,2,3,4,5,6].map(n => ({
        title: values[`comm${n}.title`] || ['Educators & Teachers','EdTech Companies','Sales Professionals','School Leaders','Researchers & Innovators','International Educators'][n-1],
        desc:  values[`comm${n}.desc`]  || '',
        count: values[`comm${n}.count`] || '',
        emoji: ['🏫','💡','📊','🏆','🔬','🌍'][n-1],
        gradient: ['linear-gradient(135deg,#EAF4F1,#D5EDE8)','linear-gradient(135deg,#FEF0EA,#FAD8CB)','linear-gradient(135deg,#F5F0FD,#E4D7F7)','linear-gradient(135deg,#FEF9EC,#F7E8BE)','linear-gradient(135deg,#EAF4F1,#C4E4DC)','linear-gradient(135deg,#FDF0F0,#F5CBCB)'][n-1],
        countColor: ['var(--teal)','var(--coral)','var(--plum)','var(--gold)','var(--teal)','var(--coral)'][n-1],
        dotColor:   ['var(--teal)','var(--coral)','var(--plum)','var(--gold)','var(--teal)','var(--coral)'][n-1],
      }))
      await apiPost('/admin/content', { key: 'content.communities', value: comms })

      const trending = { items: [1,2,3,4,5].map(n => ({ num:`0${n}`, tag:values[`tr${n}.tag`]||'', title:values[`tr${n}.title`]||'', reads:'', likes:'', comments:'' })), topics: (values['topics.all']||'').split(',').map((t:string)=>t.trim()).filter(Boolean) }
      await apiPost('/admin/content', { key: 'content.trending-section', value: trending })

      const ws = { writerName:values['ws.writerName']||'', writerRole:values['ws.writerRole']||'', writerQuote:values['ws.writerQuote']||'', writerStats:[[values['ws.stat1n']||'48',values['ws.stat1l']||'Articles'],[values['ws.stat2n']||'12K',values['ws.stat2l']||'Followers'],[values['ws.stat3n']||'340K',values['ws.stat3l']||'Reads']], badgeMonth:values['ws.badgeMonth']||'+1.4K', badgeLabel:values['ws.badgeLabel']||'↑ New followers', sectionDesc:values['ws.sectionDesc']||'', ctaLabel:values['ws.ctaLabel']||'Create Your Profile →', features:[1,2,3,4].map(n=>({ icon:['🏅','📊','🔗','📣'][n-1], bg:['rgba(10,95,85,.08)','rgba(232,81,42,.08)','rgba(201,146,42,.1)','rgba(61,31,94,.08)'][n-1], title:values[`ws.feat${n}title`]||'', desc:values[`ws.feat${n}desc`]||'' })) }
      await apiPost('/admin/content', { key: 'content.writers-spotlight', value: ws })

      const ctaSection = { badge:values['cta.badge']||'', headline:values['cta.headline']||'', subtitle:values['cta.subtitle']||'', placeholder:values['cta.placeholder']||'', btnLabel:values['cta.btnText']||'Join Free →', footnote:values['cta.footnote']||'', features:[1,2,3].map(n=>({ icon:values[`cta.feat${n}icon`]||'', title:values[`cta.feat${n}title`]||'', desc:values[`cta.feat${n}desc`]||'' })) }
      await apiPost('/admin/content', { key: 'content.cta-section', value: ctaSection })

      const mqItems = [1,2,3,4,5,6,7,8].map(n=>values[`mq.item${n}`]).filter(Boolean)
      if (mqItems.length) await apiPost('/admin/content', { key: 'content.marquee', value: { items: mqItems } })
    },
    onSuccess: () => { toast.success('🚀 All changes pushed to live site!'); setSavedGroups({}); setDirtyGroups({}) },
    onError: () => toast.error('Push failed — try again'),
  })

  const v = (id: string) => values[id] || ALL_FIELDS[id]?.default || ''
  const sz = (id: string) => `${v(id)}px`

  const activePage = PAGES.find(p => p.label === activeGroup)

  return (
    <AdminLayout title="Content & Style Manager" subtitle="Edit any text, colour, size or button — live preview updates instantly">

      {/* Top bar */}
      <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'16px', padding:'11px 16px', background:'#fff', border:'1px solid var(--border)', borderRadius:'12px' }}>
        <span style={{ fontSize:'12px', color:'var(--muted)', flex:1, fontFamily:'var(--font-sans)' }}>
          {Object.keys(savedGroups).filter(k=>savedGroups[k]).length > 0
            ? `${Object.keys(savedGroups).filter(k=>savedGroups[k]).length} group(s) ready to push`
            : 'Edit a section, save it, then push all changes to site'}
        </span>
        <button onClick={saveGroup} disabled={!dirtyGroups[activeGroup]}
          style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 18px', borderRadius:'8px', background: dirtyGroups[activeGroup] ? 'var(--gold)' : '#e5e7eb', border:'none', color: dirtyGroups[activeGroup] ? '#1A1208' : '#9ca3af', cursor:dirtyGroups[activeGroup]?'pointer':'not-allowed', fontSize:'13px', fontWeight:700, fontFamily:'var(--font-sans)' }}>
          ✓ Save {activeGroup}
        </button>
        <button onClick={() => pushMutation.mutate()} disabled={pushMutation.isPending || Object.keys(savedGroups).filter(k=>savedGroups[k]).length===0}
          style={{ display:'flex', alignItems:'center', gap:'7px', padding:'9px 22px', borderRadius:'9px', background:'var(--teal)', border:'none', color:'#fff', cursor:(pushMutation.isPending||Object.keys(savedGroups).filter(k=>savedGroups[k]).length===0)?'not-allowed':'pointer', fontSize:'13px', fontWeight:700, fontFamily:'var(--font-sans)', opacity:(pushMutation.isPending||Object.keys(savedGroups).filter(k=>savedGroups[k]).length===0)?.5:1, boxShadow:'0 4px 14px rgba(10,95,85,.3)' }}>
          {pushMutation.isPending ? <><Loader2 style={{width:13,height:13,animation:'spin 1s linear infinite'}}/>Pushing…</> : <><Globe style={{width:13,height:13}}/>Push to Site</>}
        </button>
      </div>

      {/* 3-column layout: sidebar | controls | preview */}
      <div style={{ display:'grid', gridTemplateColumns:'200px 1fr 420px', gap:'14px', alignItems:'start' }}>

        {/* LEFT: Page group selector */}
        <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'12px', overflow:'hidden', position:'sticky', top:'80px' }}>
          {PAGES.map(page => (
            <button key={page.label} onClick={() => setActiveGroup(page.label)}
              style={{ width:'100%', display:'flex', alignItems:'center', gap:'10px', padding:'11px 14px', border:'none', borderBottom:'1px solid var(--border2)', cursor:'pointer', textAlign:'left' as const, transition:'all .15s',
                background: activeGroup===page.label ? 'rgba(10,95,85,.07)' : '#fff',
                borderLeft: activeGroup===page.label ? '3px solid var(--teal)' : '3px solid transparent' }}>
              <span style={{ fontSize:'16px', flexShrink:0 }}>{page.icon}</span>
              <span style={{ fontFamily:'var(--font-sans)', fontSize:'12px', fontWeight: activeGroup===page.label ? 700 : 500, color: activeGroup===page.label ? 'var(--teal)' : 'var(--ink)' }}>{page.label}</span>
            </button>
          ))}
        </div>

        {/* MIDDLE: Controls for selected page */}
        <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
          {activePage?.sections.map(section => (
            <div key={section.id} style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'12px', overflow:'hidden' }}>
              <div style={{ padding:'10px 16px', background:'rgba(10,95,85,.03)', borderBottom:'1px solid var(--border2)', fontFamily:'var(--font-mono)', fontSize:'9px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase' as const, color:'var(--teal)' }}>
                {section.label}
              </div>
              <div style={{ padding:'4px 16px 10px' }}>
                {section.fields.map(field => (
                  <FieldRow key={field.id} field={field} value={values[field.id]??''} onChange={vv=>set(field.id,vv)} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT: Live Preview */}
        <div style={{ position:'sticky', top:'80px', background:'#fff', border:'1px solid var(--border)', borderRadius:'14px', overflow:'hidden' }}>
          <div style={{ padding:'10px 14px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:'8px' }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:'#E8512A' }} />
            <div style={{ width:8, height:8, borderRadius:'50%', background:'#F5A623' }} />
            <div style={{ width:8, height:8, borderRadius:'50%', background:'#4ADE80' }} />
            <span style={{ fontFamily:'var(--font-mono)', fontSize:'9px', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase' as const, color:'var(--muted)', marginLeft:'6px' }}>Live Preview</span>
            <span style={{ marginLeft:'auto', fontSize:'10px', color:'var(--teal)', fontFamily:'var(--font-mono)', fontWeight:700 }}>{activeGroup}</span>
          </div>
          <div style={{ padding:'16px', maxHeight:'82vh', overflowY:'auto', background:'#F9F6F0' }}>
            <ContentPreview group={activeGroup} v={v} sz={sz} />
          </div>
        </div>

      </div>
    </AdminLayout>
  )
}

/* ─── LIVE PREVIEW COMPONENT ─────────────────────────────────── */
function ContentPreview({ group, v, sz }: { group:string; v:(id:string)=>string; sz:(id:string)=>string }) {

  const Card = ({ emoji, cat, title, excerpt }: { emoji:string; cat:string; title:string; excerpt:string }) => (
    <div style={{ background:v('posts.cardBg')||'#fff', border:'1px solid rgba(26,18,8,.08)', borderRadius:'14px', overflow:'hidden', marginBottom:'8px' }}>
      <div style={{ height:56, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', background:'linear-gradient(135deg,#EAF4F0,#C0E6DC)' }}>{emoji}</div>
      <div style={{ padding:'10px 12px' }}>
        <div style={{ fontSize:'9px', fontWeight:700, textTransform:'uppercase' as const, color:v('posts.catColor')||'#0A5F55', background:'rgba(10,95,85,.07)', display:'inline-block', padding:'2px 6px', borderRadius:'4px', marginBottom:'5px' }}>{cat}</div>
        <div style={{ fontFamily:'var(--font-serif)', fontSize:sz('posts.cardTitleSize'), fontWeight:700, color:v('posts.cardTitleColor')||'#1A1208', lineHeight:1.3 }}>{title}</div>
        <div style={{ fontSize:sz('posts.cardExcerptSize'), color:v('posts.cardExcerptColor')||'#7A6A52', lineHeight:1.5, marginTop:'4px' }}>{excerpt}</div>
      </div>
    </div>
  )

  const SectionHead = ({ eyebrowId, titleLine1, titleLine2, titleId, accentId, descId }: any) => (
    <div style={{ marginBottom:'14px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px' }}>
        <div style={{ width:'20px', height:'2px', background:v(eyebrowId)||'#E8512A' }} />
        <span style={{ fontFamily:'var(--font-mono)', fontSize:'9px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase' as const, color:v(eyebrowId)||'#E8512A' }}>{titleLine1}</span>
      </div>
      <div style={{ fontFamily:'var(--font-serif)', fontSize:`${Math.min(Number(v(titleId)||42)*0.55, 26)}px`, fontWeight:900, color:v(accentId.replace('accent','title').replace('section-accent','section-title-color'))||'#1A1208', lineHeight:1.1 }}>
        {titleLine1}<br /><em style={{ fontStyle:'italic', color:v(accentId)||'#0A5F55' }}>{titleLine2}</em>
      </div>
    </div>
  )

  switch(group) {
    case 'Homepage': return (
      <div>
        {/* Navbar preview */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', background:v('navbar.bg')||'rgba(253,246,236,0.97)', borderRadius:'8px', marginBottom:'10px', border:'1px solid rgba(26,18,8,.06)' }}>
          <span style={{ fontFamily:'var(--font-serif)', fontSize:'14px', fontWeight:900, color:'var(--ink)' }}>Thynk <em style={{ fontStyle:'normal', color:'var(--teal)' }}>Pulse</em></span>
          <div style={{ display:'flex', gap:'12px' }}>
            {['Latest Posts','Trending','Community'].map(l=>(
              <span key={l} style={{ fontSize:sz('navbar.linkSize'), color:v('navbar.linkColor')||'#7A6A52' }}>{l}</span>
            ))}
          </div>
          <span style={{ padding:'6px 14px', borderRadius:'8px', background:v('navbar.btnBg')||'#0A5F55', color:v('navbar.btnColor')||'#fff', fontSize:sz('navbar.linkSize'), fontWeight:600 }}>{v('navbar.btnText')||'Start Writing'}</span>
        </div>
        {/* Hero preview */}
        <div style={{ padding:'20px', background:v('hero.bg')||'#FDF6EC', borderRadius:'10px', marginBottom:'10px', border:'1px solid rgba(26,18,8,.06)' }}>
          <div style={{ fontFamily:'var(--font-serif)', fontSize:`${Math.min(Number(v('hero.h1Size')||84)*0.4,36)}px`, fontWeight:900, color:v('hero.h1Color')||'#1A1208', lineHeight:1.05, letterSpacing:'-1px', marginBottom:'8px' }}>
            {v('hero.h1Line1')||'Where Ideas'}<br />
            <em style={{ fontStyle:'italic', color:'var(--gold)' }}>{v('hero.h1Line2')||'Shape Education'}</em>
          </div>
          <p style={{ fontSize:sz('hero.subSize'), color:v('hero.subColor')||'#7A6A52', lineHeight:1.7, marginBottom:'12px', fontWeight:300 }}>
            {(v('hero.subtitle')||'Thynk Pulse is the free, open community for educators...').slice(0,80)}...
          </p>
          <div style={{ display:'flex', gap:'8px' }}>
            <span style={{ padding:'8px 18px', borderRadius:'8px', background:v('hero.btn1Bg')||'#0A5F55', color:v('hero.btn1Color')||'#fff', fontSize:sz('hero.btn1FontSize')||'13px', fontWeight:600 }}>{v('hero.btn1Text')||'Start Writing Free'}</span>
            <span style={{ padding:'7px 16px', borderRadius:'8px', border:`1.5px solid ${v('hero.btn2Border')||'#EDE0C8'}`, background:v('hero.btn2Bg')||'transparent', color:v('hero.btn2Color')||'#1A1208', fontSize:'12px' }}>{v('hero.btn2Text')||'Explore Posts'}</span>
          </div>
        </div>
        {/* Stats preview */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', background:v('stats.bg')||'#fff', borderRadius:'10px', overflow:'hidden', border:'1px solid rgba(26,18,8,.06)', marginBottom:'10px' }}>
          {[['10K','+','Members'],['2.4K','+','Articles'],['180','+','Companies'],['40','+','Countries'],['100','%','Free']].map(([n,s,l],i)=>(
            <div key={l} style={{ padding:'12px 4px', textAlign:'center' as const, borderRight:i<4?'1px solid rgba(26,18,8,.06)':'none' }}>
              <div style={{ fontFamily:'var(--font-serif)', fontWeight:900, fontSize:`${Math.min(Number(v('stats.numSize')||40)*0.55,22)}px`, color:v('stats.numColor')||'#1A1208', lineHeight:1 }}>{n}<sup style={{ color:v('stats.accentColor')||'#E8512A', fontSize:'10px' }}>{s}</sup></div>
              <div style={{ fontSize:'9px', color:v('stats.labelColor')||'#7A6A52', marginTop:'3px' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    )

    case 'Posts Feed Section': return (
      <div>
        <SectionHead eyebrowId="posts.eyebrowColor" titleLine1="Latest from the community" titleLine2="Real Voices" titleId="posts.titleSize" accentId="posts.section-accent" descId="posts.descColor" />
        <div style={{ fontSize:sz('posts.descSize'), color:v('posts.descColor')||'#7A6A52', marginBottom:'12px' }}>Articles from educators, EdTech founders and innovators.</div>
        <div style={{ display:'flex', gap:'6px', marginBottom:'10px', flexWrap:'wrap' as const }}>
          {['All Posts','Educators','EdTech','Leadership'].map((cat,i)=>(
            <span key={cat} style={{ padding:'5px 12px', borderRadius:'100px', fontSize:'11px', fontWeight:600,
              background: i===0 ? v('posts.filterActiveBg')||'#0A5F55' : '#fff',
              color: i===0 ? v('posts.filterActiveColor')||'#fff' : '#7A6A52',
              border:'1px solid rgba(26,18,8,.1)' }}>{cat}</span>
          ))}
        </div>
        <Card emoji="🤖" cat="EdTech" title="AI in Classroom Engagement" excerpt="What works across 200 schools." />
        <Card emoji="🌱" cat="Educator" title="Experiential Learning" excerpt="From rote to real-world projects." />
      </div>
    )

    case 'Community Section': return (
      <div>
        <div style={{ background:v('comm.bg')||'#fff', padding:'16px', borderRadius:'10px' }}>
          <div style={{ fontFamily:'var(--font-serif)', fontSize:`${Math.min(Number(v('comm.titleSize')||42)*0.55,26)}px`, fontWeight:900, color:v('comm.titleColor')||'#1A1208', marginBottom:'6px' }}>
            One Platform, <em style={{ fontStyle:'italic', color:v('comm.accentColor')||'#0A5F55' }}>Every Voice</em>
          </div>
          <div style={{ fontSize:sz('comm.descColor'), color:v('comm.descColor')||'#7A6A52', marginBottom:'12px' }}>Whether you teach a class or run an EdTech company.</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
            {[['🏫','Educators & Teachers','3,200+ educators','#EAF4F1'],['💡','EdTech Companies','180+ companies','#FEF0EA'],['📊','Sales Professionals','840+ professionals','#F5F0FD'],['🏆','School Leaders','620+ leaders','#FEF9EC']].map(([e,t,c,bg])=>(
              <div key={t as string} style={{ borderRadius:'12px', padding:'12px', background:bg as string }}>
                <div style={{ fontSize:'20px', marginBottom:'6px' }}>{e}</div>
                <div style={{ fontFamily:'var(--font-serif)', fontSize:sz('comm.cardTitleSize'), fontWeight:700, color:'var(--ink)', marginBottom:'4px' }}>{t}</div>
                <div style={{ fontSize:sz('comm.countSize'), color:v('comm.accentColor')||'#0A5F55', fontWeight:600 }}>● {c}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )

    case 'Trending Section': return (
      <div style={{ background:v('trend.bg')||'#fff', padding:'16px', borderRadius:'10px' }}>
        <div style={{ fontFamily:'var(--font-serif)', fontSize:`${Math.min(Number(v('trend.titleSize')||42)*0.55,26)}px`, fontWeight:900, color:v('trend.titleColor')||'#1A1208', marginBottom:'14px' }}>
          Trending <em style={{ fontStyle:'italic', color:v('trend.accentColor')||'#0A5F55' }}>This Week</em>
        </div>
        {[['01','EdTech · AI','GPT in the Classroom: 6-Month Review'],['02','Leadership','Why I Turned Down a ₹50L EdTech Deal'],['03','Sales','The Education Sales Playbook Nobody Talks About']].map(([num,tag,title])=>(
          <div key={num} style={{ display:'flex', gap:'10px', padding:'10px 0', borderBottom:'1px solid rgba(26,18,8,.06)', alignItems:'flex-start' }}>
            <div style={{ fontFamily:'var(--font-serif)', fontSize:sz('trend.rankSize'), fontWeight:900, color:v('trend.rankColor')||'#EDE0C8', lineHeight:1, minWidth:'32px', flexShrink:0 }}>{num}</div>
            <div>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:sz('trend.catSize'), fontWeight:700, letterSpacing:'1px', textTransform:'uppercase' as const, color:v('trend.catColor')||'#E8512A', marginBottom:'4px' }}>{tag}</div>
              <div style={{ fontFamily:'var(--font-serif)', fontSize:sz('trend.articleTitleSize'), fontWeight:600, color:v('trend.articleTitleColor')||'#1A1208', lineHeight:1.35 }}>{title}</div>
              <div style={{ fontSize:'11px', color:v('trend.metaColor')||'#7A6A52', marginTop:'4px' }}>👁 28.7K reads · ❤️ 645</div>
            </div>
          </div>
        ))}
        <div style={{ background:v('trend.sidebarBg')||'#FDF6EC', borderRadius:'8px', padding:'10px', marginTop:'10px' }}>
          <div style={{ fontSize:'11px', fontWeight:700, color:'var(--ink)', marginBottom:'8px' }}>Browse Topics</div>
          <div style={{ display:'flex', flexWrap:'wrap' as const, gap:'5px' }}>
            {['AI in Education','School Leadership','EdTech Sales','NEP 2020'].map(t=>(
              <span key={t} style={{ padding:'4px 8px', borderRadius:'100px', background:v('trend.topicTagBg')||'#EDE0C8', color:v('trend.topicTagColor')||'#7A6A52', fontSize:'10px' }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    )

    case 'Writers Spotlight': return (
      <div style={{ background:v('writ.bg')||'var(--cream)', padding:'16px', borderRadius:'10px' }}>
        <div style={{ fontFamily:'var(--font-serif)', fontSize:`${Math.min(Number(v('writ.titleSize')||42)*0.55,26)}px`, fontWeight:900, color:v('writ.titleColor')||'#1A1208', marginBottom:'14px' }}>
          Writers Get <em style={{ fontStyle:'italic', color:v('writ.accentColor')||'#0A5F55' }}>The Spotlight</em>
        </div>
        <div style={{ background:v('writ.cardBg')||'#fff', borderRadius:'12px', padding:'16px', border:'1px solid rgba(26,18,8,.08)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'12px' }}>
            <div style={{ width:44, height:44, borderRadius:'12px', background:'linear-gradient(135deg,#E8512A,#F07250)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-serif)', fontWeight:900, fontSize:'18px', color:'#fff' }}>AK</div>
            <div>
              <div style={{ fontFamily:'var(--font-serif)', fontSize:sz('writ.nameSize'), fontWeight:700, color:v('writ.nameColor')||'#1A1208' }}>Ananya Krishnan</div>
              <div style={{ fontSize:sz('writ.roleSize'), color:v('writ.roleColor')||'#7A6A52' }}>EdTech Product Lead · Mumbai</div>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px', marginBottom:'12px' }}>
            {[['48','Articles'],['12K','Followers'],['340K','Reads']].map(([n,l])=>(
              <div key={l} style={{ background:'var(--cream)', borderRadius:'8px', padding:'8px', textAlign:'center' as const }}>
                <div style={{ fontFamily:'var(--font-serif)', fontSize:sz('writ.statNumSize'), fontWeight:900, color:v('writ.statNumColor')||'#1A1208' }}>{n}</div>
                <div style={{ fontSize:'10px', color:v('writ.statLabelColor')||'#7A6A52', marginTop:'2px' }}>{l}</div>
              </div>
            ))}
          </div>
          {[['🏅','Verified Expert Badges'],['📊','Rich Analytics Dashboard'],['🔗','Shareable Public Profile']].map(([icon,title])=>(
            <div key={title as string} style={{ display:'flex', gap:'10px', alignItems:'center', padding:'7px 0', borderBottom:'1px solid rgba(26,18,8,.05)' }}>
              <div style={{ width:32, height:32, borderRadius:'8px', background:v('writ.featureBg')||'rgba(10,95,85,.06)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', flexShrink:0 }}>{icon}</div>
              <div style={{ fontSize:sz('writ.featureTitleSize'), fontWeight:600, color:v('writ.featureTitleColor')||'#1A1208' }}>{title}</div>
            </div>
          ))}
        </div>
      </div>
    )

    case 'Navbar': return (
      <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', background:v('navbar.bg')||'rgba(253,246,236,0.97)', borderRadius:'10px', border:'1px solid rgba(26,18,8,.06)' }}>
          <span style={{ fontFamily:'var(--font-serif)', fontSize:'16px', fontWeight:900, color:'var(--ink)' }}>Thynk <em style={{ fontStyle:'normal', color:'var(--teal)' }}>Pulse</em></span>
          <div style={{ display:'flex', gap:'14px' }}>
            {['Latest Posts','Trending','Community','Writers'].map(l=>(
              <span key={l} style={{ fontSize:sz('navbar.linkSize'), color:v('navbar.linkColor')||'#7A6A52' }}>{l}</span>
            ))}
          </div>
          <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
            <span style={{ fontSize:sz('navbar.linkSize'), color:v('navbar.linkColor')||'#7A6A52' }}>{v('navbar.loginText')||'Login'}</span>
            <span style={{ padding:'8px 16px', borderRadius:'8px', background:v('navbar.btnBg')||'#0A5F55', color:v('navbar.btnColor')||'#fff', fontSize:sz('navbar.linkSize'), fontWeight:700 }}>{v('navbar.btnText')||'Start Writing'}</span>
          </div>
        </div>
        <div style={{ background:'rgba(10,95,85,.04)', borderRadius:'8px', padding:'10px 12px', fontSize:'11px', color:'var(--muted)', fontFamily:'var(--font-mono)' }}>
          ↑ This bar appears at the top of every page
        </div>
      </div>
    )

    case 'Footer': return (
      <div style={{ background:v('footer.bg')||'#0A5F55', borderRadius:'12px', padding:'20px' }}>
        <div style={{ fontFamily:'var(--font-serif)', fontSize:'16px', fontWeight:900, color:'#fff', marginBottom:'6px' }}>
          Thynk <em style={{ fontStyle:'normal', color:v('footer.linkColor')||'#E5B64A' }}>Pulse</em>
        </div>
        <div style={{ fontSize:sz('footer.textSize'), color:v('footer.textColor')||'rgba(255,255,255,0.6)', lineHeight:1.7, marginBottom:'14px', maxWidth:'260px' }}>
          {(v('footer.tagline')||'The free community platform for educators and EdTech professionals.').slice(0,80)}
        </div>
        <div style={{ display:'flex', gap:'12px', flexWrap:'wrap' as const, paddingTop:'12px', borderTop:`1px solid rgba(255,255,255,.12)` }}>
          {['Explore','Community','Privacy','Terms'].map(l=>(
            <span key={l} style={{ fontSize:sz('footer.textSize'), color:v('footer.linkColor')||'#E5B64A', fontFamily:'var(--font-sans)' }}>{l}</span>
          ))}
        </div>
        <div style={{ fontSize:'11px', color:v('footer.textColor')||'rgba(255,255,255,0.4)', marginTop:'10px' }}>
          {v('footer.copyright')||'© 2025 Thynk Pulse. All rights reserved.'}
        </div>
      </div>
    )

    case 'Post Pages': return (
      <div style={{ background:v('pd.bg')||'#FDF6EC', borderRadius:'12px', padding:'16px', border:'1px solid rgba(26,18,8,.06)' }}>
        <div style={{ fontSize:'9px', fontWeight:700, textTransform:'uppercase' as const, color:v('pd.catTagColor')||'#0A5F55', background:'rgba(10,95,85,.08)', display:'inline-block', padding:'3px 8px', borderRadius:'4px', marginBottom:'8px' }}>EdTech</div>
        <div style={{ fontFamily:'var(--font-serif)', fontSize:`${Math.min(Number(v('pd.titleSize')||52)*0.6,32)}px`, fontWeight:900, color:v('pd.titleColor')||'#1A1208', lineHeight:1.1, marginBottom:'8px', letterSpacing:'-1px' }}>How AI is Rewriting Classroom Engagement</div>
        <div style={{ fontSize:`${Math.min(Number(v('pd.excerptSize')||19)*0.85,17)}px`, color:v('pd.excerptColor')||'#7A6A52', lineHeight:1.65, marginBottom:'12px', fontWeight:300 }}>From adaptive learning paths to AI-powered feedback loops...</div>
        <div style={{ display:'flex', alignItems:'center', gap:'10px', paddingBottom:'12px', borderBottom:'1px solid rgba(26,18,8,.06)', marginBottom:'12px' }}>
          <div style={{ width:34, height:34, borderRadius:'9px', background:'linear-gradient(135deg,#EAF4F0,#C0E6DC)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-serif)', fontWeight:900, fontSize:'13px', color:'var(--teal)' }}>R</div>
          <div>
            <div style={{ fontSize:'13px', fontWeight:600, color:v('pd.authorNameColor')||'#1A1208' }}>Rajesh Kumar</div>
            <div style={{ fontSize:'11px', color:v('pd.metaColor')||'#7A6A52' }}>EdTech Founder · 8 min read</div>
          </div>
        </div>
        <div style={{ fontSize:sz('pd.bodySize'), color:v('pd.bodyColor')||'#1A1208', lineHeight:1.8, fontWeight:300 }}>
          From adaptive learning paths to AI-powered feedback loops — what is actually working in Indian classrooms today. The evidence suggests that...
        </div>
      </div>
    )

    case 'Auth Pages': return (
      <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
        <div style={{ background:v('login.bg')||'#FDF6EC', borderRadius:'12px', padding:'12px', border:'1px solid rgba(26,18,8,.06)' }}>
          <div style={{ background:v('login.cardBg')||'#fff', borderRadius:'10px', padding:'16px', maxWidth:'300px', margin:'0 auto' }}>
            <div style={{ fontFamily:'var(--font-serif)', fontSize:sz('login.h1Size'), fontWeight:900, color:v('login.h1Color')||'#1A1208', marginBottom:'4px' }}>Welcome back</div>
            <div style={{ fontSize:'12px', color:'var(--muted)', marginBottom:'14px' }}>Sign in to your account</div>
            <div style={{ fontSize:sz('login.labelSize'), fontWeight:700, letterSpacing:'1px', textTransform:'uppercase' as const, color:v('login.labelColor')||'#7A6A52', marginBottom:'5px', fontFamily:'var(--font-mono)' }}>EMAIL OR PHONE</div>
            <div style={{ padding:'9px 12px', background:v('login.inputBg')||'#fff', border:`1.5px solid ${v('login.inputBorder')||'#EDE0C8'}`, borderRadius:'8px', fontSize:'13px', color:'var(--muted)', marginBottom:'10px' }}>you@example.com</div>
            <div style={{ padding:'10px', background:'var(--teal)', borderRadius:'8px', textAlign:'center' as const, color:'#fff', fontWeight:600, fontSize:'13px' }}>Sign In</div>
          </div>
        </div>
      </div>
    )

    case 'Admin Panel': return (
      <div style={{ background:v('admin.bg')||'#F8F4EE', borderRadius:'12px', overflow:'hidden', border:'1px solid rgba(26,18,8,.06)' }}>
        <div style={{ display:'flex', height:'160px' }}>
          <div style={{ width:'120px', background:v('admin.sidebarBg')||'#1A1208', display:'flex', flexDirection:'column', padding:'10px 0' }}>
            {['Dashboard','Posts','Users','Theme','Content'].map((item,i)=>(
              <div key={item} style={{ padding:'8px 12px', fontSize:'11px',
                background: i===0 ? v('admin.sidebarActive')||'rgba(10,95,85,.08)' : 'transparent',
                color: i===0 ? v('admin.sidebarActiveColor')||'#0A5F55' : 'rgba(255,255,255,.4)',
                fontWeight: i===0 ? 700 : 400,
                borderLeft: i===0 ? `3px solid ${v('admin.sidebarActiveColor')||'#0A5F55'}` : '3px solid transparent' }}>
                {item}
              </div>
            ))}
          </div>
          <div style={{ flex:1, padding:'12px', background:v('admin.bg')||'#F8F4EE' }}>
            <div style={{ background:v('admin.headerBg')||'#fff', borderRadius:'8px', padding:'10px 12px', marginBottom:'10px', fontSize:'13px', fontWeight:700, color:'var(--ink)' }}>Admin Dashboard</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'6px' }}>
              {[['42','Posts'],['1.2K','Users'],['98%','Uptime']].map(([n,l])=>(
                <div key={l} style={{ background:v('admin.headerBg')||'#fff', borderRadius:'8px', padding:'8px', textAlign:'center' as const }}>
                  <div style={{ fontFamily:'var(--font-serif)', fontWeight:900, fontSize:'16px', color:'var(--teal)' }}>{n}</div>
                  <div style={{ fontSize:'10px', color:'var(--muted)' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )

    case 'Marquee Bar': return (
      <div>
        <div style={{ background:v('mq.bg')||'#0A5F55', padding:'12px 0', borderRadius:'8px', overflow:'hidden' }}>
          <div style={{ display:'flex', gap:'0', whiteSpace:'nowrap' as const }}>
            {['🎓 For Educators','💡 For Innovators','🏢 For EdTech Companies','📊 For Sales Professionals','🏫 For School Leaders'].map((item,i)=>(
              <span key={i} style={{ padding:'0 24px', fontSize:sz('mq.fontSize'), fontWeight:500, color:v('mq.textColor')||'rgba(255,255,255,0.8)', display:'inline-flex', alignItems:'center', gap:'8px' }}>
                {item} <span style={{ color:v('mq.dotColor')||'#12A090', fontSize:'14px' }}>·</span>
              </span>
            ))}
          </div>
        </div>
        <div style={{ marginTop:'8px', fontSize:'10px', color:'var(--muted)', fontFamily:'var(--font-mono)', textAlign:'center' as const }}>↑ Scrolling bar below the navbar</div>
      </div>
    )

    case 'Write Page': return (
      <div style={{ background:v('write.bg')||'#FDF6EC', borderRadius:'12px', padding:'16px', border:'1px solid rgba(26,18,8,.06)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:v('write.toolbarBg')||'rgba(253,246,236,0.95)', padding:'10px 14px', borderRadius:'8px', marginBottom:'14px', border:'1px solid rgba(26,18,8,.06)' }}>
          <span style={{ fontSize:'13px', color:'var(--muted)' }}>← Feed</span>
          <span style={{ fontFamily:'var(--font-serif)', fontSize:sz('write.titleSize'), fontWeight:900, color:v('write.titleColor')||'#1A1208' }}>Write a Post</span>
          <span style={{ padding:'7px 16px', borderRadius:'8px', background:v('write.btnPublishBg')||'#0A5F55', color:v('write.btnPublishColor')||'#fff', fontSize:'12px', fontWeight:600 }}>Publish</span>
        </div>
        <div style={{ fontFamily:'var(--font-serif)', fontSize:'22px', fontWeight:900, color:v('write.titleColor')||'#1A1208', opacity:.25, marginBottom:'8px', letterSpacing:'-0.5px' }}>Your article title here...</div>
        <div style={{ fontSize:'14px', color:'var(--muted)', opacity:.4, lineHeight:1.7 }}>Write your introduction. Share your expertise with 10,000+ education professionals...</div>
      </div>
    )

    case 'Error / 404 Page': return (
      <div style={{ background:v('err.bg')||'#FDF6EC', borderRadius:'12px', padding:'32px 16px', textAlign:'center' as const, border:'1px solid rgba(26,18,8,.06)' }}>
        <div style={{ fontFamily:'var(--font-serif)', fontSize:'48px', fontWeight:900, color:v('err.codeColor')||'#EDE0C8', lineHeight:1, marginBottom:'8px' }}>404</div>
        <div style={{ fontFamily:'var(--font-serif)', fontSize:sz('err.titleSize'), fontWeight:700, color:v('err.titleColor')||'#1A1208', marginBottom:'8px' }}>Page Not Found</div>
        <div style={{ fontSize:'13px', color:v('err.descColor')||'#7A6A52', marginBottom:'16px' }}>The page you are looking for does not exist.</div>
        <span style={{ padding:'10px 20px', borderRadius:'8px', background:v('err.btnBg')||'#0A5F55', color:v('err.btnColor')||'#fff', fontSize:'13px', fontWeight:600 }}>← Go Home</span>
      </div>
    )

    case 'Forgot / Reset Password': return (
      <div style={{ background:v('fp.bg')||'#FDF6EC', borderRadius:'12px', padding:'16px', border:'1px solid rgba(26,18,8,.06)' }}>
        <div style={{ background:v('fp.cardBg')||'#fff', borderRadius:'10px', padding:'20px', maxWidth:'300px', margin:'0 auto' }}>
          <div style={{ fontFamily:'var(--font-serif)', fontSize:sz('fp.titleSize'), fontWeight:900, color:v('fp.titleColor')||'#1A1208', marginBottom:'6px' }}>Forgot Password?</div>
          <div style={{ fontSize:'12px', color:v('fp.subtitleColor')||'#7A6A52', marginBottom:'14px' }}>Enter your email to receive a reset link.</div>
          <div style={{ padding:'9px 12px', border:`1.5px solid ${v('fp.inputBorder')||'#EDE0C8'}`, borderRadius:'8px', fontSize:'13px', color:'var(--muted)', marginBottom:'10px' }}>you@example.com</div>
          <div style={{ padding:'10px', background:v('fp.btnBg')||'#0A5F55', borderRadius:'8px', textAlign:'center' as const, color:v('fp.btnColor')||'#fff', fontWeight:600, fontSize:'13px' }}>Send Reset Link</div>
        </div>
      </div>
    )

    case 'Profile Page': return (
      <div style={{ background:v('prof.bg')||'#FDF6EC', borderRadius:'12px', padding:'16px', border:'1px solid rgba(26,18,8,.06)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'14px', marginBottom:'16px' }}>
          <div style={{ width:56, height:56, borderRadius:'14px', background:'linear-gradient(135deg,var(--teal),var(--teal3))', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-serif)', fontWeight:900, fontSize:'22px', color:'#fff', flexShrink:0 }}>R</div>
          <div>
            <div style={{ fontFamily:'var(--font-serif)', fontSize:sz('prof.nameSize'), fontWeight:900, color:v('prof.nameColor')||'#1A1208', letterSpacing:'-0.5px' }}>Rajesh Kumar</div>
            <div style={{ fontSize:sz('prof.roleSize'), color:v('prof.roleColor')||'#7A6A52', marginTop:'2px' }}>EdTech Founder · Bangalore</div>
            <div style={{ fontSize:sz('prof.bioSize'), color:v('prof.bioColor')||'#7A6A52', marginTop:'4px', lineHeight:1.5 }}>Building EdTech products for Tier-2 India...</div>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px', marginBottom:'14px' }}>
          {[['48','Articles'],['12K','Followers'],['340K','Reads']].map(([n,l])=>(
            <div key={l} style={{ background:v('prof.bg')||'#FDF6EC', borderRadius:'8px', padding:'10px', textAlign:'center' as const }}>
              <div style={{ fontFamily:'var(--font-serif)', fontSize:sz('prof.statNumSize'), fontWeight:900, color:v('prof.statNumColor')||'#1A1208' }}>{n}</div>
              <div style={{ fontSize:'10px', color:v('prof.statLabelColor')||'#7A6A52', marginTop:'2px' }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', gap:'8px' }}>
          <span style={{ flex:1, padding:'9px', borderRadius:'8px', border:'1px solid rgba(26,18,8,.1)', fontSize:'12px', fontWeight:600, textAlign:'center' as const, color:'var(--ink)' }}>View Articles</span>
          <span style={{ padding:'9px 16px', borderRadius:'8px', background:v('prof.followBtnBg')||'#0A5F55', color:v('prof.followBtnColor')||'#fff', fontSize:'12px', fontWeight:600 }}>+ Follow</span>
        </div>
      </div>
    )

    default: return (
      <div style={{ padding:'32px', textAlign:'center' as const, color:'var(--muted)' }}>
        <div style={{ fontSize:'36px', marginBottom:'10px' }}>👆</div>
        <div style={{ fontFamily:'var(--font-serif)', fontSize:'15px', fontWeight:600, marginBottom:'4px' }}>Select a page group</div>
        <div style={{ fontSize:'12px' }}>Choose from the left panel to see a live preview</div>
      </div>
    )
  }
}