// State-specific data for unique content on each state page
// This helps differentiate pages and avoid duplicate content issues

export interface StateInfo {
  name: string
  slug: string
  capital: string
  population: string
  gdp: string
  majorIndustries: string[]
  businessEnvironment: string
  digitalAdoption: string
  keyMarkets: string[]
  seoOpportunities: string[]
  topCities: string[]
}

export const stateData: Record<string, StateInfo> = {
  california: {
    name: 'California',
    slug: 'california',
    capital: 'Sacramento',
    population: '39.5 million',
    gdp: '$3.9 trillion',
    majorIndustries: [
      'Technology & Software',
      'Entertainment & Media',
      'Agriculture',
      'Tourism & Hospitality',
      'Manufacturing',
      'Biotechnology'
    ],
    businessEnvironment: 'California is the world\'s 5th largest economy and home to the most competitive digital market in the United States. With Silicon Valley driving tech innovation, Hollywood leading entertainment, and major metros like Los Angeles, San Francisco, and San Diego hosting millions of businesses, standing out online isn\'t optional—it\'s essential for survival and growth.',
    digitalAdoption: '91% of California businesses have a digital presence, with e-commerce growing at 15% annually',
    keyMarkets: [
      'San Francisco Bay Area - Technology & SaaS',
      'Los Angeles - Entertainment & E-commerce',
      'San Diego - Biotech & Defense',
      'Sacramento - Government & Agriculture Tech',
      'Orange County - Manufacturing & Retail'
    ],
    seoOpportunities: [
      'Highly competitive digital landscape requires advanced SEO strategies',
      'Rich local search volume across major metros',
      'Strong consumer purchasing power drives e-commerce growth',
      'Multilingual SEO opportunities in diverse markets',
      'Mobile-first indexing critical for tech-savvy population'
    ],
    topCities: [
      'Los Angeles',
      'San Diego',
      'San Jose',
      'San Francisco',
      'Fresno',
      'Sacramento',
      'Long Beach',
      'Oakland'
    ]
  },
  // More states will be added here
}

export function getStateInfo(slug: string): StateInfo | null {
  return stateData[slug] || null
}
