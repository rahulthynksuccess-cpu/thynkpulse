import { useQuery } from '@tanstack/react-query'

const DEFAULTS: Record<string,any> = {
  'content.hero': {
    eyebrow:'India\'s Education Community Platform',
    h1Line1:'Where Ideas', h1Line2:'Shape Education',
    subtitle:'Thynk Pulse is the free, open community for educators, EdTech professionals, innovators and school leaders.',
    ctaPrimary:'Start Writing Free', ctaSecondary:'Explore Posts',
    socialProof:'Join 10,000+ professionals already on Thynk Pulse',
  },
  'content.stats': [
    {n:'10K',sup:'+',l:'Community Members'},{n:'2.4K',sup:'+',l:'Articles Published'},
    {n:'180',sup:'+',l:'EdTech Companies'},{n:'40',sup:'+',l:'Countries Represented'},{n:'100',sup:'%',l:'Free Forever'},
  ],
  'content.cta': {
    badge:'Completely Free · No Credit Card',
    h2Line1:'Join', h2Brand:'Thynk Pulse', h2Line2:'Shape Education\'s Future.',
    subtitle:'Be part of India\'s most vibrant education community.',
    inputPlaceholder:'Enter your work email', btnLabel:'Join Free →',
    footnote:'🔒 No spam. No paywall. Free forever.',
  },
  'content.navbar': {
    brandName:'Thynk Pulse', ctaLabel:'Start Writing', loginLabel:'Login',
    links:[{label:'Explore',href:'/#posts'},{label:'Community',href:'/#community'},{label:'Writers',href:'/#writers'},{label:'Trending',href:'/#trending'}],
  },
  'content.footer': {
    tagline:'The free community platform for educators, EdTech professionals, innovators and school leaders.',
    copyright:'© 2025 Thynk Pulse. All rights reserved.',
    links:[{label:'About',href:'/about'},{label:'Blog',href:'/blog'},{label:'Privacy',href:'/privacy'},{label:'Terms',href:'/terms'}],
  },
}

export function useContent(key: string) {
  const { data } = useQuery({
    queryKey: ['site-content', key],
    queryFn: async () => {
      const res = await fetch('/api/admin/content')
      const all = await res.json()
      return all[key] ?? DEFAULTS[key]
    },
    staleTime: 60 * 1000,
    initialData: DEFAULTS[key],
  })
  return data ?? DEFAULTS[key]
}
