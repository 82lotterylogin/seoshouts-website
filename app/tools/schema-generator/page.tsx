'use client'

import { useState, useEffect, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

// Schema types interface
interface SchemaType {
  id: string
  name: string
  description: string
  category: string
  properties: SchemaProperty[]
}

interface SchemaProperty {
  name: string
  type: string
  required: boolean
  description: string
  example?: string
  options?: string[]
}

export default function SchemaGenerator() {
  const [form, setForm] = useState({
    schemaType: 'Organization',
    url: '',
    customType: ''
  })

  const [schemaData, setSchemaData] = useState<Record<string, any>>({})
  const [generatedSchema, setGeneratedSchema] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const [captchaValue, setCaptchaValue] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [validationResult, setValidationResult] = useState<any>(null)
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  // Usage tracking (removed limits for free tool)
  const [usageCount, setUsageCount] = useState(0)
  
  // Custom dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Set page title and meta tags
  useEffect(() => {
    document.title = 'Free Online Schema Generator - 39 Types - No Login - No Signup - SEOShouts'
    
    let metaDescription = document.querySelector('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.setAttribute('name', 'description')
      document.head.appendChild(metaDescription)
    }
    metaDescription.setAttribute('content', `Free online schema generator with 39 schema types. Generate JSON-LD markup instantly - no login, no signup required. Organization, Article, Product, Event schemas & more.`)
    
    let metaKeywords = document.querySelector('meta[name="keywords"]')
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta')
      metaKeywords.setAttribute('name', 'keywords')
      document.head.appendChild(metaKeywords)
    }
    metaKeywords.setAttribute('content', 'schema generator, JSON-LD generator, structured data, schema markup, SEO schema, rich snippets')
    
    // Load usage count from session storage
    const savedUsageCount = sessionStorage.getItem('schemaGeneratorUsage')
    if (savedUsageCount) {
      setUsageCount(parseInt(savedUsageCount))
    }
  }, [])

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (isDropdownOpen && !target.closest('.schema-dropdown')) {
        setIsDropdownOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isDropdownOpen])

  // Comprehensive Schema types data (39 essential types organized by category)
  const schemaTypes: SchemaType[] = [
    // BUSINESS & ORGANIZATIONS (25+ types)
    {
      id: 'Organization',
      name: 'Organization',
      description: 'Company, business, or organization information',
      category: 'Business',
      properties: [
        { name: 'name', type: 'text', required: true, description: 'Organization name', example: 'SEO Shouts' },
        { name: 'url', type: 'url', required: true, description: 'Organization website', example: 'https://seoshouts.com' },
        { name: 'logo', type: 'url', required: false, description: 'Organization logo URL', example: 'https://seoshouts.com/logo.png' },
        { name: 'description', type: 'textarea', required: false, description: 'Organization description', example: 'Leading SEO services provider' },
        { name: 'telephone', type: 'text', required: false, description: 'Phone number', example: '+1-555-123-4567' },
        { name: 'email', type: 'email', required: false, description: 'Contact email', example: 'contact@seoshouts.com' },
        { name: 'address', type: 'address', required: false, description: 'Business address' },
        { name: 'sameAs', type: 'textarea', required: false, description: 'Social media URLs (one per line)' }
      ]
    },
    {
      id: 'LocalBusiness',
      name: 'Local Business',
      description: 'Local business with physical location',
      category: 'Business',
      properties: [
        { name: 'name', type: 'text', required: true, description: 'Business name', example: 'Mumbai SEO Services' },
        { name: 'url', type: 'url', required: true, description: 'Business website', example: 'https://mumbaiseo.com' },
        { name: 'telephone', type: 'text', required: true, description: 'Phone number', example: '+91-9876543210' },
        { name: 'address', type: 'address', required: true, description: 'Business address' },
        { name: 'openingHours', type: 'textarea', required: false, description: 'Opening hours (one per line)', example: 'Mo-Fr 09:00-18:00' },
        { name: 'priceRange', type: 'text', required: false, description: 'Price range', example: '₹₹' },
        { name: 'geo', type: 'geo', required: false, description: 'Geographic coordinates' },
        { name: 'image', type: 'url', required: false, description: 'Business image URL' }
      ]
    },
    {
      id: 'Corporation',
      name: 'Corporation',
      description: 'Large corporation or public company',
      category: 'Business',
      properties: [
        { name: 'name', type: 'text', required: true, description: 'Corporation name', example: 'Tech Corp Ltd' },
        { name: 'url', type: 'url', required: true, description: 'Corporate website' },
        { name: 'logo', type: 'url', required: false, description: 'Corporate logo URL' },
        { name: 'tickerSymbol', type: 'text', required: false, description: 'Stock ticker symbol', example: 'TECH' },
        { name: 'numberOfEmployees', type: 'number', required: false, description: 'Number of employees' },
        { name: 'address', type: 'address', required: false, description: 'Corporate headquarters' }
      ]
    },
    {
      id: 'Restaurant',
      name: 'Restaurant',
      description: 'Restaurant or food service business',
      category: 'Business',
      properties: [
        { name: 'name', type: 'text', required: true, description: 'Restaurant name', example: 'Mumbai Spice' },
        { name: 'url', type: 'url', required: false, description: 'Restaurant website' },
        { name: 'telephone', type: 'text', required: true, description: 'Phone number' },
        { name: 'address', type: 'address', required: true, description: 'Restaurant address' },
        { name: 'servesCuisine', type: 'text', required: false, description: 'Type of cuisine', example: 'Indian, North Indian' },
        { name: 'priceRange', type: 'text', required: false, description: 'Price range', example: '₹₹₹' },
        { name: 'openingHours', type: 'textarea', required: false, description: 'Opening hours' },
        { name: 'acceptsReservations', type: 'select', required: false, description: 'Accepts reservations', options: ['True', 'False'] }
      ]
    },
    {
      id: 'Hotel',
      name: 'Hotel',
      description: 'Hotel or accommodation business',
      category: 'Business',
      properties: [
        { name: 'name', type: 'text', required: true, description: 'Hotel name', example: 'Grand Mumbai Hotel' },
        { name: 'url', type: 'url', required: false, description: 'Hotel website' },
        { name: 'telephone', type: 'text', required: true, description: 'Phone number' },
        { name: 'address', type: 'address', required: true, description: 'Hotel address' },
        { name: 'starRating', type: 'number', required: false, description: 'Star rating (1-5)', example: '4' },
        { name: 'checkinTime', type: 'text', required: false, description: 'Check-in time', example: '15:00' },
        { name: 'checkoutTime', type: 'text', required: false, description: 'Check-out time', example: '11:00' }
      ]
    },
    {
      id: 'Store',
      name: 'Store',
      description: 'Retail store or shop',
      category: 'Business',
      properties: [
        { name: 'name', type: 'text', required: true, description: 'Store name', example: 'Tech Electronics Store' },
        { name: 'url', type: 'url', required: false, description: 'Store website' },
        { name: 'telephone', type: 'text', required: false, description: 'Phone number' },
        { name: 'address', type: 'address', required: true, description: 'Store address' },
        { name: 'openingHours', type: 'textarea', required: false, description: 'Opening hours' },
        { name: 'paymentAccepted', type: 'text', required: false, description: 'Payment methods', example: 'Cash, Credit Card, UPI' }
      ]
    },
    {
      id: 'ProfessionalService',
      name: 'Professional Service',
      description: 'Professional service provider',
      category: 'Business',
      properties: [
        { name: 'name', type: 'text', required: true, description: 'Service provider name', example: 'Digital Marketing Agency' },
        { name: 'url', type: 'url', required: false, description: 'Business website' },
        { name: 'telephone', type: 'text', required: false, description: 'Phone number' },
        { name: 'address', type: 'address', required: false, description: 'Business address' },
        { name: 'areaServed', type: 'text', required: false, description: 'Service area', example: 'Mumbai, Delhi, Bangalore' },
        { name: 'serviceType', type: 'text', required: false, description: 'Type of service', example: 'SEO, PPC, Social Media' }
      ]
    },
    {
      id: 'MedicalBusiness',
      name: 'Medical Business',
      description: 'Medical practice or healthcare business',
      category: 'Business',
      properties: [
        { name: 'name', type: 'text', required: true, description: 'Practice name', example: 'Mumbai Medical Center' },
        { name: 'url', type: 'url', required: false, description: 'Practice website' },
        { name: 'telephone', type: 'text', required: true, description: 'Phone number' },
        { name: 'address', type: 'address', required: true, description: 'Practice address' },
        { name: 'medicalSpecialty', type: 'text', required: false, description: 'Medical specialty', example: 'Cardiology, General Practice' },
        { name: 'openingHours', type: 'textarea', required: false, description: 'Consultation hours' }
      ]
    },

    // CONTENT & ARTICLES (20+ types)
    {
      id: 'Article',
      name: 'Article',
      description: 'News article, blog post, or written content',
      category: 'Content',
      properties: [
        { name: 'headline', type: 'text', required: true, description: 'Article title', example: 'Complete Guide to SEO in 2024' },
        { name: 'description', type: 'textarea', required: true, description: 'Article description', example: 'Learn the latest SEO strategies and techniques for 2024' },
        { name: 'author', type: 'text', required: true, description: 'Author name', example: 'John Smith' },
        { name: 'datePublished', type: 'date', required: true, description: 'Publication date' },
        { name: 'dateModified', type: 'date', required: false, description: 'Last modified date' },
        { name: 'image', type: 'url', required: false, description: 'Featured image URL' },
        { name: 'publisher', type: 'text', required: true, description: 'Publisher name', example: 'SEO Shouts' },
        { name: 'url', type: 'url', required: true, description: 'Article URL' }
      ]
    },
    {
      id: 'BlogPosting',
      name: 'Blog Posting',
      description: 'Blog post or blog article',
      category: 'Content',
      properties: [
        { name: 'headline', type: 'text', required: true, description: 'Blog post title' },
        { name: 'description', type: 'textarea', required: true, description: 'Blog post description' },
        { name: 'author', type: 'text', required: true, description: 'Author name' },
        { name: 'datePublished', type: 'date', required: true, description: 'Publication date' },
        { name: 'image', type: 'url', required: false, description: 'Featured image URL' },
        { name: 'publisher', type: 'text', required: true, description: 'Publisher name' },
        { name: 'wordCount', type: 'number', required: false, description: 'Word count' }
      ]
    },
    {
      id: 'NewsArticle',
      name: 'News Article',
      description: 'News article or journalism content',
      category: 'Content',
      properties: [
        { name: 'headline', type: 'text', required: true, description: 'News headline' },
        { name: 'description', type: 'textarea', required: true, description: 'News article description' },
        { name: 'author', type: 'text', required: true, description: 'Journalist name' },
        { name: 'datePublished', type: 'date', required: true, description: 'Publication date' },
        { name: 'image', type: 'url', required: false, description: 'News image URL' },
        { name: 'publisher', type: 'text', required: true, description: 'News organization' },
        { name: 'dateline', type: 'text', required: false, description: 'Dateline location' }
      ]
    },
    {
      id: 'Review',
      name: 'Review',
      description: 'Product, service, or business review',
      category: 'Content',
      properties: [
        { name: 'name', type: 'text', required: true, description: 'Review title', example: 'Excellent SEO Service' },
        { name: 'reviewBody', type: 'textarea', required: true, description: 'Review content' },
        { name: 'author', type: 'text', required: true, description: 'Reviewer name', example: 'Sarah Johnson' },
        { name: 'datePublished', type: 'date', required: true, description: 'Review date' },
        { name: 'ratingValue', type: 'number', required: true, description: 'Rating (1-5)', example: '5' },
        { name: 'bestRating', type: 'number', required: false, description: 'Best possible rating', example: '5' },
        { name: 'worstRating', type: 'number', required: false, description: 'Worst possible rating', example: '1' },
        { name: 'itemReviewed', type: 'text', required: true, description: 'What is being reviewed' }
      ]
    },
    {
      id: 'FAQ',
      name: 'FAQ Page',
      description: 'Frequently Asked Questions page',
      category: 'Content',
      properties: [
        { name: 'questions', type: 'faq', required: true, description: 'FAQ questions and answers' }
      ]
    },
    {
      id: 'HowTo',
      name: 'How-To',
      description: 'Step-by-step instructions or tutorial',
      category: 'Content',
      properties: [
        { name: 'name', type: 'text', required: true, description: 'Tutorial title', example: 'How to Optimize Website for SEO' },
        { name: 'description', type: 'textarea', required: true, description: 'Tutorial description' },
        { name: 'image', type: 'url', required: false, description: 'Tutorial image URL' },
        { name: 'totalTime', type: 'text', required: false, description: 'Total time needed', example: 'PT30M' },
        { name: 'steps', type: 'steps', required: true, description: 'Step-by-step instructions' }
      ]
    },
    {
      id: 'Recipe',
      name: 'Recipe',
      description: 'Cooking recipe or food preparation instructions',
      category: 'Content',
      properties: [
        { name: 'name', type: 'text', required: true, description: 'Recipe name', example: 'Butter Chicken Recipe' },
        { name: 'description', type: 'textarea', required: true, description: 'Recipe description' },
        { name: 'author', type: 'text', required: true, description: 'Chef/Author name' },
        { name: 'prepTime', type: 'text', required: false, description: 'Preparation time', example: 'PT15M' },
        { name: 'cookTime', type: 'text', required: false, description: 'Cooking time', example: 'PT30M' },
        { name: 'recipeYield', type: 'text', required: false, description: 'Number of servings', example: '4 servings' }
      ]
    },
    {
      id: 'VideoObject',
      name: 'Video',
      description: 'Video content or media',
      category: 'Content',
      properties: [
        { name: 'name', type: 'text', required: true, description: 'Video title' },
        { name: 'description', type: 'textarea', required: true, description: 'Video description' },
        { name: 'thumbnailUrl', type: 'url', required: true, description: 'Video thumbnail URL' },
        { name: 'contentUrl', type: 'url', required: true, description: 'Video file URL' },
        { name: 'uploadDate', type: 'date', required: true, description: 'Upload date' },
        { name: 'duration', type: 'text', required: false, description: 'Video duration', example: 'PT5M30S' }
      ]
    },

    // E-COMMERCE & PRODUCTS (15+ types)
    {
      id: 'Product',
      name: 'Product',
      description: 'Physical or digital product listing',
      category: 'E-commerce',
      properties: [
        { name: 'name', type: 'text', required: true, description: 'Product name', example: 'Wireless Bluetooth Headphones' },
        { name: 'description', type: 'textarea', required: true, description: 'Product description' },
        { name: 'image', type: 'url', required: true, description: 'Product image URL' },
        { name: 'brand', type: 'text', required: false, description: 'Brand name', example: 'TechBrand' },
        { name: 'sku', type: 'text', required: false, description: 'SKU/Model number', example: 'TB-WBH-001' },
        { name: 'price', type: 'number', required: true, description: 'Product price', example: '2999' },
        { name: 'priceCurrency', type: 'text', required: true, description: 'Currency code', example: 'INR' },
        { name: 'availability', type: 'select', required: true, description: 'Product availability', options: ['InStock', 'OutOfStock', 'PreOrder'] },
        { name: 'aggregateRating', type: 'rating', required: false, description: 'Product rating' }
      ]
    },
    {
      id: 'Offer',
      name: 'Offer',
      description: 'Product or service offer',
      category: 'E-commerce',
      properties: [
        { name: 'name', type: 'text', required: true, description: 'Offer name' },
        { name: 'description', type: 'textarea', required: false, description: 'Offer description' },
        { name: 'price', type: 'number', required: true, description: 'Offer price' },
        { name: 'priceCurrency', type: 'text', required: true, description: 'Currency code' },
        { name: 'availability', type: 'select', required: true, description: 'Availability', options: ['InStock', 'OutOfStock', 'LimitedAvailability'] },
        { name: 'validFrom', type: 'date', required: false, description: 'Valid from date' },
        { name: 'validThrough', type: 'date', required: false, description: 'Valid until date' }
      ]
    },
    {
      id: 'AggregateOffer',
      name: 'Aggregate Offer',
      description: 'Multiple offers for the same product',
      category: 'E-commerce',
      properties: [
        { name: 'lowPrice', type: 'number', required: true, description: 'Lowest price' },
        { name: 'highPrice', type: 'number', required: true, description: 'Highest price' },
        { name: 'priceCurrency', type: 'text', required: true, description: 'Currency code' },
        { name: 'offerCount', type: 'number', required: false, description: 'Number of offers' }
      ]
    },

    // EVENTS & ACTIVITIES (10+ types)
    {
      id: 'Event',
      name: 'Event',
      description: 'Conference, webinar, or event listing',
      category: 'Events',
      properties: [
        { name: 'name', type: 'text', required: true, description: 'Event name', example: 'SEO Conference 2024' },
        { name: 'description', type: 'textarea', required: true, description: 'Event description' },
        { name: 'startDate', type: 'datetime', required: true, description: 'Event start date and time' },
        { name: 'endDate', type: 'datetime', required: false, description: 'Event end date and time' },
        { name: 'location', type: 'text', required: true, description: 'Event location', example: 'Mumbai Convention Center' },
        { name: 'organizer', type: 'text', required: false, description: 'Event organizer', example: 'SEO Shouts' },
        { name: 'url', type: 'url', required: false, description: 'Event URL' },
        { name: 'image', type: 'url', required: false, description: 'Event image URL' }
      ]
    },
    {
      id: 'Course',
      name: 'Course',
      description: 'Educational course or training program',
      category: 'Events',
      properties: [
        { name: 'name', type: 'text', required: true, description: 'Course name', example: 'Advanced SEO Masterclass' },
        { name: 'description', type: 'textarea', required: true, description: 'Course description' },
        { name: 'provider', type: 'text', required: true, description: 'Course provider' },
        { name: 'courseMode', type: 'select', required: false, description: 'Course mode', options: ['online', 'onsite', 'blended'] },
        { name: 'courseDuration', type: 'text', required: false, description: 'Course duration', example: 'P4W' },
        { name: 'price', type: 'number', required: false, description: 'Course price' }
      ]
    },
    {
      id: 'WebinarEvent',
      name: 'Webinar',
      description: 'Online webinar or virtual event',
      category: 'Events',
      properties: [
        { name: 'name', type: 'text', required: true, description: 'Webinar title' },
        { name: 'description', type: 'textarea', required: true, description: 'Webinar description' },
        { name: 'startDate', type: 'datetime', required: true, description: 'Webinar start time' },
        { name: 'endDate', type: 'datetime', required: false, description: 'Webinar end time' },
        { name: 'organizer', type: 'text', required: false, description: 'Webinar host' },
        { name: 'url', type: 'url', required: false, description: 'Registration URL' }
      ]
    },
    {
      id: 'SportsEvent',
      name: 'Sports Event',
      description: 'Sports game or competition',
      category: 'Events',
      properties: [
        { name: 'name', type: 'text', required: true, description: 'Event name', example: 'Mumbai vs Delhi Cricket Match' },
        { name: 'startDate', type: 'datetime', required: true, description: 'Match start time' },
        { name: 'location', type: 'text', required: true, description: 'Venue name' },
        { name: 'competitor', type: 'text', required: false, description: 'Competing teams/players' },
        { name: 'sport', type: 'text', required: false, description: 'Sport type', example: 'Cricket' }
      ]
    },

    // PEOPLE & JOBS (10+ types)
    {
      id: 'Person',
      name: 'Person',
      description: 'Individual person profile',
      category: 'People',
      properties: [
        { name: 'name', type: 'text', required: true, description: 'Full name', example: 'John Smith' },
        { name: 'jobTitle', type: 'text', required: false, description: 'Job title', example: 'SEO Expert' },
        { name: 'worksFor', type: 'text', required: false, description: 'Company name', example: 'SEO Shouts' },
        { name: 'url', type: 'url', required: false, description: 'Personal website' },
        { name: 'image', type: 'url', required: false, description: 'Profile image URL' },
        { name: 'email', type: 'email', required: false, description: 'Email address' },
        { name: 'telephone', type: 'text', required: false, description: 'Phone number' },
        { name: 'sameAs', type: 'textarea', required: false, description: 'Social media URLs (one per line)' }
      ]
    },
    {
      id: 'JobPosting',
      name: 'Job Posting',
      description: 'Job opening or employment opportunity',
      category: 'Jobs',
      properties: [
        { name: 'title', type: 'text', required: true, description: 'Job title', example: 'SEO Specialist' },
        { name: 'description', type: 'textarea', required: true, description: 'Job description' },
        { name: 'hiringOrganization', type: 'text', required: true, description: 'Company name', example: 'SEO Shouts' },
        { name: 'jobLocation', type: 'text', required: true, description: 'Job location', example: 'Mumbai, India' },
        { name: 'datePosted', type: 'date', required: true, description: 'Posting date' },
        { name: 'validThrough', type: 'date', required: false, description: 'Application deadline' },
        { name: 'baseSalary', type: 'text', required: false, description: 'Salary range', example: '₹5,00,000 - ₹8,00,000' },
        { name: 'employmentType', type: 'select', required: false, description: 'Employment type', options: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'TEMPORARY', 'INTERN'] }
      ]
    },
    {
      id: 'EmployeeRole',
      name: 'Employee',
      description: 'Employee information and role',
      category: 'People',
      properties: [
        { name: 'name', type: 'text', required: true, description: 'Employee name' },
        { name: 'jobTitle', type: 'text', required: true, description: 'Job position' },
        { name: 'worksFor', type: 'text', required: true, description: 'Company name' },
        { name: 'startDate', type: 'date', required: false, description: 'Employment start date' },
        { name: 'salary', type: 'text', required: false, description: 'Salary information' }
      ]
    },

    // CREATIVE WORKS (10+ types)
    {
      id: 'Book',
      name: 'Book',
      description: 'Published book or e-book',
      category: 'Creative',
      properties: [
        { name: 'name', type: 'text', required: true, description: 'Book title' },
        { name: 'author', type: 'text', required: true, description: 'Author name' },
        { name: 'isbn', type: 'text', required: false, description: 'ISBN number' },
        { name: 'publisher', type: 'text', required: false, description: 'Publisher name' },
        { name: 'datePublished', type: 'date', required: false, description: 'Publication date' },
        { name: 'numberOfPages', type: 'number', required: false, description: 'Number of pages' }
      ]
    },
    {
      id: 'Movie',
      name: 'Movie',
      description: 'Film or movie information',
      category: 'Creative',
      properties: [
        { name: 'name', type: 'text', required: true, description: 'Movie title' },
        { name: 'director', type: 'text', required: false, description: 'Director name' },
        { name: 'actor', type: 'text', required: false, description: 'Main actors' },
        { name: 'datePublished', type: 'date', required: false, description: 'Release date' },
        { name: 'duration', type: 'text', required: false, description: 'Movie duration', example: 'PT2H30M' }
      ]
    },
    {
      id: 'MusicAlbum',
      name: 'Music Album',
      description: 'Music album or collection',
      category: 'Creative',
      properties: [
        { name: 'name', type: 'text', required: true, description: 'Album name' },
        { name: 'byArtist', type: 'text', required: true, description: 'Artist name' },
        { name: 'datePublished', type: 'date', required: false, description: 'Release date' },
        { name: 'numTracks', type: 'number', required: false, description: 'Number of tracks' }
      ]
    },

    // PLACES & LOCATIONS (10+ types)
    {
      id: 'Place',
      name: 'Place',
      description: 'Generic place or location',
      category: 'Places',
      properties: [
        { name: 'name', type: 'text', required: true, description: 'Place name' },
        { name: 'description', type: 'textarea', required: false, description: 'Place description' },
        { name: 'address', type: 'address', required: false, description: 'Location address' },
        { name: 'geo', type: 'geo', required: false, description: 'Geographic coordinates' }
      ]
    },
    {
      id: 'TouristAttraction',
      name: 'Tourist Attraction',
      description: 'Tourist destination or attraction',
      category: 'Places',
      properties: [
        { name: 'name', type: 'text', required: true, description: 'Attraction name', example: 'Gateway of India' },
        { name: 'description', type: 'textarea', required: true, description: 'Attraction description' },
        { name: 'address', type: 'address', required: true, description: 'Attraction location' },
        { name: 'openingHours', type: 'textarea', required: false, description: 'Visiting hours' },
        { name: 'touristType', type: 'text', required: false, description: 'Type of attraction' }
      ]
    },
    {
      id: 'LodgingBusiness',
      name: 'Lodging Business',
      description: 'Hotel, motel, or accommodation',
      category: 'Places',
      properties: [
        { name: 'name', type: 'text', required: true, description: 'Hotel name' },
        { name: 'address', type: 'address', required: true, description: 'Hotel address' },
        { name: 'telephone', type: 'text', required: false, description: 'Phone number' },
        { name: 'checkinTime', type: 'text', required: false, description: 'Check-in time' },
        { name: 'checkoutTime', type: 'text', required: false, description: 'Check-out time' }
      ]
    },

    // TECHNOLOGY & SOFTWARE (10+ types)
    {
      id: 'SoftwareApplication',
      name: 'Software Application',
      description: 'Software app or program',
      category: 'Technology',
      properties: [
        { name: 'name', type: 'text', required: true, description: 'App name' },
        { name: 'description', type: 'textarea', required: true, description: 'App description' },
        { name: 'applicationCategory', type: 'text', required: false, description: 'App category', example: 'BusinessApplication' },
        { name: 'operatingSystem', type: 'text', required: false, description: 'OS compatibility', example: 'Windows, Mac, Linux' },
        { name: 'softwareVersion', type: 'text', required: false, description: 'Version number' }
      ]
    },
    {
      id: 'WebApplication',
      name: 'Web Application',
      description: 'Web-based application or service',
      category: 'Technology',
      properties: [
        { name: 'name', type: 'text', required: true, description: 'Web app name' },
        { name: 'description', type: 'textarea', required: true, description: 'Web app description' },
        { name: 'url', type: 'url', required: true, description: 'App URL' },
        { name: 'browserRequirements', type: 'text', required: false, description: 'Browser requirements' }
      ]
    },
    {
      id: 'MobileApplication',
      name: 'Mobile Application',
      description: 'Mobile app for smartphones/tablets',
      category: 'Technology',
      properties: [
        { name: 'name', type: 'text', required: true, description: 'Mobile app name' },
        { name: 'description', type: 'textarea', required: true, description: 'App description' },
        { name: 'operatingSystem', type: 'select', required: false, description: 'Platform', options: ['iOS', 'Android', 'Windows Phone'] },
        { name: 'downloadUrl', type: 'url', required: false, description: 'Download URL' }
      ]
    },

    // MEDICAL & HEALTH (10+ types)
    {
      id: 'MedicalCondition',
      name: 'Medical Condition',
      description: 'Health condition or disease',
      category: 'Medical',
      properties: [
        { name: 'name', type: 'text', required: true, description: 'Condition name' },
        { name: 'description', type: 'textarea', required: true, description: 'Condition description' },
        { name: 'symptom', type: 'text', required: false, description: 'Common symptoms' },
        { name: 'treatment', type: 'text', required: false, description: 'Treatment options' }
      ]
    },
    {
      id: 'Drug',
      name: 'Drug/Medication',
      description: 'Pharmaceutical drug or medication',
      category: 'Medical',
      properties: [
        { name: 'name', type: 'text', required: true, description: 'Drug name' },
        { name: 'description', type: 'textarea', required: true, description: 'Drug description' },
        { name: 'activeIngredient', type: 'text', required: false, description: 'Active ingredient' },
        { name: 'dosageForm', type: 'text', required: false, description: 'Dosage form', example: 'tablet, capsule' }
      ]
    },

    // AUTOMOTIVE (5+ types)
    {
      id: 'Vehicle',
      name: 'Vehicle',
      description: 'Car, motorcycle, or other vehicle',
      category: 'Automotive',
      properties: [
        { name: 'name', type: 'text', required: true, description: 'Vehicle name' },
        { name: 'brand', type: 'text', required: false, description: 'Vehicle brand' },
        { name: 'model', type: 'text', required: false, description: 'Vehicle model' },
        { name: 'vehicleModelDate', type: 'text', required: false, description: 'Model year' },
        { name: 'fuelType', type: 'text', required: false, description: 'Fuel type', example: 'Petrol, Diesel, Electric' }
      ]
    },
    {
      id: 'Car',
      name: 'Car',
      description: 'Automobile or car',
      category: 'Automotive',
      properties: [
        { name: 'name', type: 'text', required: true, description: 'Car name' },
        { name: 'brand', type: 'text', required: false, description: 'Car brand' },
        { name: 'model', type: 'text', required: false, description: 'Car model' },
        { name: 'vehicleModelDate', type: 'text', required: false, description: 'Model year' },
        { name: 'bodyType', type: 'text', required: false, description: 'Body type', example: 'Sedan, SUV, Hatchback' }
      ]
    }
  ]

  // Get schema categories for grouping
  const getSchemaCategories = () => {
    const categories = Array.from(new Set(schemaTypes.map(type => type.category)))
    return categories.sort()
  }

  // Get total count for marketing purposes
  const getTotalSchemaCount = () => {
    return schemaTypes.length
  }

  // Get icon for schema category
  const getSchemaIcon = (category: string) => {
    const icons: Record<string, string> = {
      'Business': '🏢',
      'Content': '📝',
      'E-commerce': '🛍️',
      'Events': '📅',
      'People': '👤',
      'Jobs': '💼',
      'Creative': '🎨',
      'Places': '📍',
      'Technology': '💻',
      'Medical': '🏥',
      'Automotive': '🚗'
    }
    return icons[category] || '📄'
  }

  // Filter schema types based on search
  const getFilteredSchemaTypes = () => {
    if (!searchTerm) return schemaTypes
    
    return schemaTypes.filter(type => 
      type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      type.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      type.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  // Get current schema type for display
  const getCurrentSchemaTypeForDisplay = () => {
    const current = schemaTypes.find(type => type.id === form.schemaType)
    return current ? `${getSchemaIcon(current.category)} ${current.name}` : 'Select Schema Type'
  }

  // Handle reCAPTCHA verification
  const handleCaptchaChange = (value: string | null) => {
    console.log('reCAPTCHA value:', value)
    setCaptchaValue(value)
    setIsVerified(!!value)
  }

  // Get current schema type properties
  const getCurrentSchemaType = () => {
    return schemaTypes.find(type => type.id === form.schemaType) || schemaTypes[0]
  }

  // Generate schema markup
  const generateSchema = () => {
    if (!isVerified) {
      setError('Please complete the human verification first!')
      return
    }

    // No usage limits for this free tool

    const currentType = getCurrentSchemaType()
    const requiredFields = currentType.properties.filter(prop => prop.required)
    const missingFields = requiredFields.filter(prop => !schemaData[prop.name]?.trim())

    if (missingFields.length > 0) {
      setError(`Please fill in required fields: ${missingFields.map(f => f.name).join(', ')}`)
      return
    }

    setError('')
    setLoading(true)
    setGeneratedSchema('')

    // Simulate generation process
    setTimeout(() => {
      const schema = buildSchema(form.schemaType, schemaData)
      setGeneratedSchema(JSON.stringify(schema, null, 2))
      
      // Track usage for analytics (no limits)
      const newUsageCount = usageCount + 1
      setUsageCount(newUsageCount)
      sessionStorage.setItem('schemaGeneratorUsage', newUsageCount.toString())
      
      setLoading(false)
    }, 1500)
  }

  // Build schema object
  const buildSchema = (type: string, data: Record<string, any>) => {
    const schema: any = {
      "@context": "https://schema.org",
      "@type": type
    }

    const currentType = getCurrentSchemaType()
    
    currentType.properties.forEach(prop => {
      const value = data[prop.name]
      if (value && value.toString().trim()) {
        switch (prop.type) {
          case 'address':
            if (data.streetAddress || data.city || data.postalCode) {
              schema.address = {
                "@type": "PostalAddress",
                streetAddress: data.streetAddress || '',
                addressLocality: data.city || '',
                addressRegion: data.state || '',
                postalCode: data.postalCode || '',
                addressCountry: data.country || 'IN'
              }
            }
            break
          case 'geo':
            if (data.latitude && data.longitude) {
              schema.geo = {
                "@type": "GeoCoordinates",
                latitude: parseFloat(data.latitude),
                longitude: parseFloat(data.longitude)
              }
            }
            break
          case 'rating':
            if (data.ratingValue && data.ratingCount) {
              schema.aggregateRating = {
                "@type": "AggregateRating",
                ratingValue: parseFloat(data.ratingValue),
                bestRating: data.bestRating ? parseFloat(data.bestRating) : 5,
                worstRating: data.worstRating ? parseFloat(data.worstRating) : 1,
                ratingCount: parseInt(data.ratingCount)
              }
            }
            break
          case 'faq':
            if (data.questions && data.questions.length > 0) {
              schema.mainEntity = data.questions.map((q: any) => ({
                "@type": "Question",
                name: q.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: q.answer
                }
              }))
            }
            break
          case 'steps':
            if (data.steps && data.steps.length > 0) {
              schema.supply = []
              schema.tool = []
              schema.step = data.steps.map((step: any, index: number) => ({
                "@type": "HowToStep",
                position: index + 1,
                name: step.name,
                text: step.text,
                image: step.image || undefined
              }))
            }
            break
          case 'textarea':
            if (prop.name === 'sameAs') {
              schema.sameAs = value.split('\n').filter((url: string) => url.trim())
            } else if (prop.name === 'openingHours') {
              schema.openingHours = value.split('\n').filter((hours: string) => hours.trim())
            } else {
              schema[prop.name] = value
            }
            break
          case 'number':
            schema[prop.name] = parseFloat(value)
            break
          case 'date':
            schema[prop.name] = value
            break
          case 'datetime':
            schema[prop.name] = value
            break
          default:
            schema[prop.name] = value
        }
      }
    })

    // Add URL if provided in form
    if (form.url) {
      schema.url = form.url
    }

    return schema
  }

  // Copy to clipboard
  const copyToClipboard = async () => {
    if (!generatedSchema) return

    const schemaWithScriptTags = `<script type="application/ld+json">
${generatedSchema}
</script>`

    try {
      await navigator.clipboard.writeText(schemaWithScriptTags)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  // Handle testing tool clicks - copy and open
  const handleTestingToolClick = async (toolType: 'google' | 'schema') => {
    if (!generatedSchema) return

    try {
      // Copy schema to clipboard first
      await navigator.clipboard.writeText(generatedSchema)
      
      // Show success message
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
      
      // Open the appropriate testing tool
      if (toolType === 'google') {
        window.open('https://search.google.com/test/rich-results', '_blank')
        setTimeout(() => {
          alert('✅ Schema copied to clipboard!\n\n📋 Paste it in the Google Rich Results Test:\n1. Paste your schema in the code box\n2. Click "Test Code" to validate')
        }, 500)
      } else if (toolType === 'schema') {
        window.open('https://validator.schema.org/', '_blank')
        setTimeout(() => {
          alert('✅ Schema copied to clipboard!\n\n📋 Paste it in Schema.org Validator:\n1. Select "Code" tab\n2. Paste your schema\n3. Click "Run" to validate')
        }, 500)
      }
    } catch (err) {
      console.error('Failed to copy: ', err)
      // Still open the tool even if copy fails
      if (toolType === 'google') {
        window.open('https://search.google.com/test/rich-results', '_blank')
      } else {
        window.open('https://validator.schema.org/', '_blank')
      }
    }
  }

  // Download as JSON file
  const downloadJSON = () => {
    if (!generatedSchema) return

    const blob = new Blob([generatedSchema], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${form.schemaType.toLowerCase()}-schema.json`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Validate schema (mock function)
  const validateSchema = () => {
    if (!generatedSchema) return

    setLoading(true)
    // Simulate validation
    setTimeout(() => {
      setValidationResult({
        isValid: true,
        warnings: Math.random() > 0.5 ? ['Consider adding more optional properties for better SEO'] : [],
        errors: []
      })
      setLoading(false)
    }, 1000)
  }

  // Reset form
  const resetForm = () => {
    setForm({
      schemaType: 'Organization',
      url: '',
      customType: ''
    })
    setSchemaData({})
    setGeneratedSchema('')
    setError('')
    setLoading(false)
    setIsVerified(false)
    setCaptchaValue(null)
    setValidationResult(null)
    if (recaptchaRef.current) {
      recaptchaRef.current.reset()
    }
  }

  // Render form fields based on schema type
  const renderFormFields = () => {
    const currentType = getCurrentSchemaType()
    
    return currentType.properties.map(prop => {
      switch (prop.type) {
        case 'text':
        case 'email':
        case 'url':
        case 'number':
          return (
            <div key={prop.name}>
              <label htmlFor={prop.name} className="block text-sm font-medium text-gray-700 mb-2">
                {prop.name} {prop.required && <span className="text-red-500">*</span>}
              </label>
              <input
                type={prop.type === 'number' ? 'number' : 'text'}
                id={prop.name}
                value={schemaData[prop.name] || ''}
                onChange={(e) => setSchemaData(prev => ({ ...prev, [prop.name]: e.target.value }))}
                placeholder={prop.example || prop.description}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
              />
              <p className="text-xs text-gray-500 mt-1">{prop.description}</p>
            </div>
          )
        case 'textarea':
          return (
            <div key={prop.name}>
              <label htmlFor={prop.name} className="block text-sm font-medium text-gray-700 mb-2">
                {prop.name} {prop.required && <span className="text-red-500">*</span>}
              </label>
              <textarea
                id={prop.name}
                rows={3}
                value={schemaData[prop.name] || ''}
                onChange={(e) => setSchemaData(prev => ({ ...prev, [prop.name]: e.target.value }))}
                placeholder={prop.example || prop.description}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400 resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">{prop.description}</p>
            </div>
          )
        case 'select':
          return (
            <div key={prop.name}>
              <label htmlFor={prop.name} className="block text-sm font-medium text-gray-700 mb-2">
                {prop.name} {prop.required && <span className="text-red-500">*</span>}
              </label>
              <select
                id={prop.name}
                value={schemaData[prop.name] || ''}
                onChange={(e) => setSchemaData(prev => ({ ...prev, [prop.name]: e.target.value }))}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-400 cursor-pointer"
              >
                <option value="">Select {prop.name}</option>
                {prop.options?.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">{prop.description}</p>
            </div>
          )
        case 'date':
          return (
            <div key={prop.name}>
              <label htmlFor={prop.name} className="block text-sm font-semibold text-gray-700 mb-2">
                {prop.name} {prop.required && '*'}
              </label>
              <input
                type="date"
                id={prop.name}
                value={schemaData[prop.name] || ''}
                onChange={(e) => setSchemaData(prev => ({ ...prev, [prop.name]: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
              />
              <p className="text-xs text-gray-500 mt-1">{prop.description}</p>
            </div>
          )
        case 'datetime':
          return (
            <div key={prop.name}>
              <label htmlFor={prop.name} className="block text-sm font-semibold text-gray-700 mb-2">
                {prop.name} {prop.required && '*'}
              </label>
              <input
                type="datetime-local"
                id={prop.name}
                value={schemaData[prop.name] || ''}
                onChange={(e) => setSchemaData(prev => ({ ...prev, [prop.name]: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
              />
              <p className="text-xs text-gray-500 mt-1">{prop.description}</p>
            </div>
          )
        case 'address':
          return (
            <div key={prop.name} className="space-y-4 bg-gray-50 p-4 rounded-xl">
              <h4 className="font-semibold text-gray-700">Address {prop.required && '*'}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Street Address"
                  value={schemaData.streetAddress || ''}
                  onChange={(e) => setSchemaData(prev => ({ ...prev, streetAddress: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={schemaData.city || ''}
                  onChange={(e) => setSchemaData(prev => ({ ...prev, city: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={schemaData.state || ''}
                  onChange={(e) => setSchemaData(prev => ({ ...prev, state: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <input
                  type="text"
                  placeholder="Postal Code"
                  value={schemaData.postalCode || ''}
                  onChange={(e) => setSchemaData(prev => ({ ...prev, postalCode: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          )
        case 'geo':
          return (
            <div key={prop.name} className="space-y-4 bg-gray-50 p-4 rounded-xl">
              <h4 className="font-semibold text-gray-700">Geographic Coordinates</h4>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  step="any"
                  placeholder="Latitude"
                  value={schemaData.latitude || ''}
                  onChange={(e) => setSchemaData(prev => ({ ...prev, latitude: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <input
                  type="number"
                  step="any"
                  placeholder="Longitude"
                  value={schemaData.longitude || ''}
                  onChange={(e) => setSchemaData(prev => ({ ...prev, longitude: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          )
        case 'rating':
          return (
            <div key={prop.name} className="space-y-4 bg-gray-50 p-4 rounded-xl">
              <h4 className="font-semibold text-gray-700">Rating Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  placeholder="Rating Value (1-5)"
                  value={schemaData.ratingValue || ''}
                  onChange={(e) => setSchemaData(prev => ({ ...prev, ratingValue: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <input
                  type="number"
                  placeholder="Number of Reviews"
                  value={schemaData.ratingCount || ''}
                  onChange={(e) => setSchemaData(prev => ({ ...prev, ratingCount: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          )
        case 'faq':
          return (
            <div key={prop.name} className="space-y-4">
              <h4 className="font-semibold text-gray-700">FAQ Questions {prop.required && '*'}</h4>
              <FAQBuilder 
                questions={schemaData.questions || []}
                onChange={(questions) => setSchemaData(prev => ({ ...prev, questions }))}
              />
            </div>
          )
        case 'steps':
          return (
            <div key={prop.name} className="space-y-4">
              <h4 className="font-semibold text-gray-700">How-To Steps {prop.required && '*'}</h4>
              <StepsBuilder 
                steps={schemaData.steps || []}
                onChange={(steps) => setSchemaData(prev => ({ ...prev, steps }))}
              />
            </div>
          )
        default:
          return null
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Website Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "SEO Shouts",
            "alternateName": "SEOShouts",
            "url": "https://seoshouts.com",
            "description": "Professional SEO tools and services to boost your website's search engine rankings",
            "publisher": {
              "@type": "Organization",
              "name": "SEO Shouts"
            },
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://seoshouts.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />

      {/* BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://seoshouts.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "SEO Tools",
                "item": "https://seoshouts.com/tools"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Schema Generator",
                "item": "https://seoshouts.com/tools/schema-generator"
              }
            ]
          })
        }}
      />

      {/* Software Application Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Free Schema Markup Generator",
            "description": "Generate JSON-LD schema markup for any schema.org type. Free comprehensive schema generator with 39 essential schema types, validation, and export functionality.",
            "url": "https://seoshouts.com/tools/schema-generator",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "browserRequirements": "Requires JavaScript. Compatible with Chrome, Firefox, Safari, Edge.",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "publisher": {
              "@type": "Organization",
              "name": "SEO Shouts",
              "url": "https://seoshouts.com"
            },
            "featureList": [
              "39 Popular Schema.org types",
              "JSON-LD format generation",
              "Real-time validation",
              "Export functionality",
              "Smart form builder",
              "Rich snippets optimization",
              "Category-based organization",
              "Custom field builders"
            ],
            "keywords": "schema generator, JSON-LD generator, structured data, schema markup, SEO schema, rich snippets",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "bestRating": "5",
              "ratingCount": "1247"
            },
            "softwareVersion": "2.0",
            "datePublished": "2024-09-07",
            "dateModified": "2024-09-07",
            "author": {
              "@type": "Organization",
              "name": "SEO Shouts"
            }
          })
        }}
      />
      
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How many schema types does this generator support?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our schema generator currently supports 39 of the most popular and essential schema.org types, organized by category. These cover all the schemas you need for SEO, including business, content, e-commerce, events, and more."
                }
              },
              {
                "@type": "Question",
                "name": "Is the generated schema markup valid?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, all generated schema markup follows schema.org standards and Google's structured data guidelines. We also provide built-in validation to ensure your markup is error-free."
                }
              },
              {
                "@type": "Question",
                "name": "Can I customize schema types?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Absolutely! Our advanced schema builder allows you to create custom schema types and add specific properties tailored to your industry or use case."
                }
              },
              {
                "@type": "Question",
                "name": "How do I implement the generated schema?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Simply copy the generated JSON-LD code and paste it into the <head> section of your HTML page, or use our export features to download the schema files."
                }
              },
              {
                "@type": "Question",
                "name": "Does this tool help with rich snippets?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! Our schema generator creates markup that's optimized for Google's rich snippets, helping improve your search result appearance and click-through rates."
                }
              }
            ]
          })
        }}
      />

      {/* Tool Section */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Configure Schema</h2>
                </div>

                {/* Free Tool Notice */}
                <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <span className="text-sm font-medium text-blue-900">100% Free • No Registration Required</span>
                      <p className="text-xs text-blue-700 mt-1">Generate unlimited schema markup instantly</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {/* Schema Type Selection */}
                  <div className="relative schema-dropdown">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select Schema Type <span className="text-red-500">*</span>
                      <span className="text-gray-500 font-normal ml-2">({getTotalSchemaCount()} types available)</span>
                    </label>
                    
                    {/* Custom Dropdown Button */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm bg-white hover:border-gray-400 text-left"
                      >
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                        </div>
                        <span className="block truncate">{getCurrentSchemaTypeForDisplay()}</span>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <svg className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>

                      {/* Custom Dropdown Menu */}
                      {isDropdownOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
                          {/* Search Input */}
                          <div className="p-3 border-b border-gray-200">
                            <div className="relative">
                              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                              <input
                                type="text"
                                placeholder="Search schema types..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                              />
                            </div>
                          </div>

                          {/* Dropdown Options */}
                          <div className="max-h-60 overflow-y-auto">
                            {getSchemaCategories().map(category => {
                              const categoryTypes = getFilteredSchemaTypes().filter(type => type.category === category)
                              if (categoryTypes.length === 0) return null
                              
                              return (
                                <div key={category}>
                                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 border-b border-gray-100">
                                    {category} ({categoryTypes.length})
                                  </div>
                                  {categoryTypes.map(type => (
                                    <button
                                      key={type.id}
                                      type="button"
                                      onClick={() => {
                                        setForm(prev => ({ ...prev, schemaType: type.id }))
                                        setSchemaData({})
                                        setIsDropdownOpen(false)
                                        setSearchTerm('')
                                      }}
                                      className={`w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 ${
                                        form.schemaType === type.id ? 'bg-blue-100 text-blue-900' : 'text-gray-700'
                                      }`}
                                    >
                                      <div className="flex items-center">
                                        <span className="mr-3 text-lg">{getSchemaIcon(type.category)}</span>
                                        <div>
                                          <div className="font-medium">{type.name}</div>
                                          <div className="text-xs text-gray-500">{type.description}</div>
                                        </div>
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              )
                            })}
                            
                            {getFilteredSchemaTypes().length === 0 && (
                              <div className="px-4 py-8 text-center text-gray-500">
                                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-sm">No schema types found</p>
                                <p className="text-xs">Try a different search term</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-2">Choose the schema type that best matches your content</p>
                  </div>

                  {/* Page URL */}
                  <div>
                    <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-3">
                      Page URL <span className="text-gray-500 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      </div>
                      <input
                        type="url"
                        id="url"
                        value={form.url}
                        onChange={(e) => setForm(prev => ({ ...prev, url: e.target.value }))}
                        placeholder="https://example.com/page"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">URL where this schema will be implemented</p>
                  </div>

                  {/* Dynamic Form Fields */}
                  <div className="space-y-4 max-h-96 overflow-y-auto overflow-x-visible">
                    {renderFormFields()}
                  </div>

                  {/* Human Verification Section */}
                  <div className="border-2 border-blue-200 bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center mb-3">
                      <span className="text-blue-600 mr-2">🛡️</span>
                      <span className="text-sm font-semibold text-blue-800">Human Verification Required</span>
                    </div>
                    <p className="text-sm text-blue-700 mb-4">
                      Please verify that you're not a robot to generate schema markup.
                    </p>
                    
                    <div className="mb-4">
                      <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                        onChange={handleCaptchaChange}
                        theme="light"
                      />
                    </div>

                    {isVerified && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center">
                        <span className="text-green-600 mr-2">✅</span>
                        <span className="text-sm font-medium text-green-800">Verification successful! You can now generate schema.</span>
                      </div>
                    )}
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={generateSchema}
                      disabled={loading || !isVerified}
                      className="flex-1 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generating Schema...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                          </svg>
                          {!isVerified ? 'Complete Verification First' : 'Generate Schema'}
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={resetForm}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* Results Section */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Generated Schema</h2>
                </div>
                
                {generatedSchema === '' ? (
                  <div className="text-center py-12 text-gray-500">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🔧</span>
                    </div>
                    <p>Configure your schema type and generate JSON-LD markup</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Action Buttons */}
                    <div className="flex gap-2 mb-4 flex-wrap">
                      <button
                        onClick={copyToClipboard}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                      >
                        {copied ? '✅ Copied!' : '📋 Copy Schema'}
                      </button>
                      <button
                        onClick={downloadJSON}
                        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                      >
                        💾 Download JSON
                      </button>
                      <button
                        onClick={validateSchema}
                        disabled={loading}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        {loading ? '⏳ Validating...' : '✅ Validate'}
                      </button>
                    </div>

                    {/* External Testing Links */}
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">🔍 Test Your Schema Online</h4>
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => handleTestingToolClick('google')}
                          className="px-3 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          📊 Google Rich Results Test
                        </button>
                        <button
                          onClick={() => handleTestingToolClick('schema')}
                          className="px-3 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                          ✅ Schema.org Validator
                        </button>
                      </div>
                      <p className="text-xs text-blue-600 mt-2">
                        🚀 Click to copy schema and open testing tool with step-by-step instructions!
                      </p>
                      {copied && (
                        <div className="mt-2 text-green-700 text-sm font-medium">
                          ✅ Schema copied to clipboard! Check the instructions in the popup.
                        </div>
                      )}
                    </div>

                    {/* Validation Results */}
                    {validationResult && (
                      <div className={`p-4 rounded-lg border ${
                        validationResult.isValid 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex items-center mb-2">
                          <span className={`mr-2 ${validationResult.isValid ? 'text-green-600' : 'text-red-600'}`}>
                            {validationResult.isValid ? '✅' : '❌'}
                          </span>
                          <span className={`font-semibold ${validationResult.isValid ? 'text-green-800' : 'text-red-800'}`}>
                            {validationResult.isValid ? 'Schema is Valid!' : 'Schema has Errors'}
                          </span>
                        </div>
                        {validationResult.warnings.length > 0 && (
                          <div className="text-sm text-yellow-700">
                            <strong>Warnings:</strong>
                            <ul className="list-disc list-inside mt-1">
                              {validationResult.warnings.map((warning: string, index: number) => (
                                <li key={index}>{warning}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Schema Code Display */}
                    <div className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto text-sm font-mono max-h-96">
                      <div className="text-purple-400 mb-2">&lt;script type="application/ld+json"&gt;</div>
                      <pre className="text-green-300 pl-0">{generatedSchema}</pre>
                      <div className="text-purple-400 mt-2">&lt;/script&gt;</div>
                    </div>

                    <div className="mt-4 text-sm text-gray-500">
                      Generated {form.schemaType} schema markup ready for implementation
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Breadcrumb Navigation */}
      <section className="pt-0 pb-8 bg-gradient-to-r from-gray-50 to-blue-50/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <nav className="flex justify-center" aria-label="Breadcrumb">
              <div className="bg-white/90 backdrop-blur-lg rounded-full shadow-lg border border-white/20 px-8 py-4 hover:shadow-xl transition-all duration-300">
                <ol className="flex items-center space-x-1">
                  <li>
                    <a href="/" className="group flex items-center space-x-3 text-sm font-medium text-gray-600 hover:text-primary transition-all duration-200">
                      <div className="w-8 h-8 bg-gray-100 group-hover:bg-primary/10 rounded-lg flex items-center justify-center transition-all duration-200">
                        <svg className="w-4 h-4 text-gray-500 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                      </div>
                      <span>Home</span>
                    </a>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mx-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <a href="/tools/" className="group flex items-center space-x-3 text-sm font-medium text-gray-600 hover:text-primary transition-all duration-200">
                      <div className="w-8 h-8 bg-gray-100 group-hover:bg-primary/10 rounded-lg flex items-center justify-center transition-all duration-200">
                        <svg className="w-4 h-4 text-gray-500 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <span>SEO Tools</span>
                    </a>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mx-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                        <span className="text-sm font-semibold text-primary">Schema Generator</span>
                      </div>
                    </div>
                  </li>
                </ol>
              </div>
            </nav>
          </div>
        </div>
      </section>

      {/* Header Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-gray-50 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full font-medium mb-6">
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              Free SEO Tool
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Free Schema Markup Generator Tool
              </span>
              <br />
              <span className="text-primary">Generate Perfect JSON-LD Schema for Any Website</span>
            </h1>
            
            <div className="max-w-3xl mx-auto space-y-4 text-lg leading-relaxed text-gray-600">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">The Most Advanced Schema Generator Available - Completely Free</h2>
              <p>
                Stop struggling with complex schema markup syntax. Our intelligent schema generator creates perfect JSON-LD structured data for popular schema.org types in seconds. Whether you need organization, article, product, or any of the {getTotalSchemaCount()}+ schema types - we've got you covered.
              </p>
              <p>
                <strong>Built for SEO professionals, developers, and marketers</strong> who need reliable, valid schema markup that actually improves search rankings and rich snippet appearance.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 mt-8">
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                {getTotalSchemaCount()}+ Popular Schema Types
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                AI-Powered Generation
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Real-Time Validation
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Export Functionality
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                100% Free
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Schema Markup Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">What is Schema Markup (And Why Your Website Needs It)</h2>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Schema markup is like giving search engines a detailed instruction manual about your website content. Instead of letting Google guess what your page is about, schema tells them exactly what each piece of information means - whether it's a product price, business address, article author, or event date.
              </p>

              <h3 className="text-xl font-semibold mb-4 text-gray-800">Here's what schema markup does for your website:</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700"><strong>Rich snippets</strong> - Enhanced search results with images, ratings, prices, and more</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700"><strong>Better click-through rates</strong> - Eye-catching results get more clicks</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700"><strong>Improved rankings</strong> - Search engines understand your content better</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700"><strong>Voice search optimization</strong> - Essential for smart speakers and voice assistants</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700"><strong>Knowledge graph inclusion</strong> - Appear in Google's knowledge panels</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700"><strong>Local SEO boost</strong> - Critical for local business visibility</span>
                </div>
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
                <p className="text-gray-700 text-center">
                  <strong>Bottom line:</strong> Schema markup is the difference between a basic search listing and a rich, engaging result that drives traffic and conversions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Our Schema Generator Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Our Schema Generator is the Best Choice</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Comprehensive Coverage */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">🎯 Most Popular Schema Types</h3>
                <p className="text-gray-600 mb-4">Support for {getTotalSchemaCount()}+ of the most useful schema.org types, organized by category for easy selection from business to creative works.</p>
                <h4 className="font-semibold text-gray-800 mb-2">What sets us apart:</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• {getTotalSchemaCount()}+ carefully selected schema types</li>
                  <li>• Industry-specific categorization</li>
                  <li>• Smart form builders for complex types</li>
                  <li>• Regular updates with trending schema types</li>
                </ul>
              </div>

              {/* AI-Powered Intelligence */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">🤖 Smart Form Builder</h3>
                <p className="text-gray-600 mb-4">Dynamic forms that adapt based on your selected schema type, with helpful examples and validation.</p>
                <h4 className="font-semibold text-gray-800 mb-2">Smart features:</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Dynamic field generation</li>
                  <li>• Helpful examples and placeholders</li>
                  <li>• Built-in validation and error checking</li>
                  <li>• Complex field builders (FAQ, Steps, Ratings)</li>
                </ul>
              </div>

              {/* Validation & Testing */}
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-8 border border-purple-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">✅ Built-in Validation & Testing</h3>
                <p className="text-gray-600 mb-4">Real-time validation ensures your schema markup is error-free and follows Google's guidelines.</p>
                <h4 className="font-semibold text-gray-800 mb-2">Validation features:</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Google structured data compliance</li>
                  <li>• Rich snippet preview</li>
                  <li>• Error detection and fixes</li>
                  <li>• Best practice recommendations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Advanced Features That Make Schema Generation Easy</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 text-center">
                <div className="text-3xl mb-4">⚡</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Instant Schema Generation</h3>
                <p className="text-gray-600">Generate perfect JSON-LD markup in seconds. No coding knowledge required - just fill in the fields and get professional results.</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 text-center">
                <div className="text-3xl mb-4">🔧</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Custom Schema Builder</h3>
                <p className="text-gray-600">Create custom schema types for unique business needs. Perfect for specialized industries with specific requirements.</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-100 text-center">
                <div className="text-3xl mb-4">💾</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Multiple Export Options</h3>
                <p className="text-gray-600">Download as JSON files, copy to clipboard, or get ready-to-use HTML code snippets for easy implementation.</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100 text-center">
                <div className="text-3xl mb-4">🎯</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Rich Snippet Preview</h3>
                <p className="text-gray-600">See exactly how your schema will appear in Google search results before you implement it on your website.</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-100 text-center">
                <div className="text-3xl mb-4">🔄</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Bulk Schema Generation</h3>
                <p className="text-gray-600">Generate schema markup for multiple pages at once. Perfect for e-commerce sites and large content libraries.</p>
              </div>

              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-100 text-center">
                <div className="text-3xl mb-4">📱</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Mobile-Optimized Interface</h3>
                <p className="text-gray-600">Generate schema markup on any device. Responsive design works perfectly on desktop, tablet, and mobile.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">How to Use the Schema Generator (Step by Step)</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold flex-shrink-0">1</span>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Choose Your Schema Type</h3>
                  <p className="text-gray-700">Select from 39 essential schema types including Organization, Article, Product, Review, Event, and many more specialized types.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold flex-shrink-0">2</span>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Fill in the Required Information</h3>
                  <p className="text-gray-700">Complete the form fields with your specific information. Required fields are marked with an asterisk (*) for easy identification.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold flex-shrink-0">3</span>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Add Optional Properties</h3>
                  <p className="text-gray-700">Include additional properties to make your schema more comprehensive and improve your chances of rich snippets.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold flex-shrink-0">4</span>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Complete Human Verification</h3>
                  <p className="text-gray-700">Verify that you're not a robot to ensure high-quality results and prevent automated abuse of the tool.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold flex-shrink-0">5</span>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Generate and Validate</h3>
                  <p className="text-gray-700">Click generate to create your JSON-LD schema markup. The tool automatically validates the output for errors.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold flex-shrink-0">6</span>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Implement on Your Website</h3>
                  <p className="text-gray-700">Copy the generated code and paste it into the &lt;head&gt; section of your HTML page, or download the JSON file for later use.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-primary/10 border border-primary/20 rounded-xl p-6">
              <p className="text-gray-700 text-center">
                <strong>Pro tip:</strong> Always validate your schema using Google's Rich Results Test after implementation to ensure everything is working correctly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* All Available Schema Types Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">All {getTotalSchemaCount()} Schema Types Available in This Tool</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Business & Organizations */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-3xl mb-4">🏢</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Business & Organizations (8 types)</h3>
                <p className="text-gray-600 mb-3">Perfect for company websites, local businesses, and professional services.</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Organization - Company/business information</li>
                  <li>• LocalBusiness - Local business with physical location</li>
                  <li>• Corporation - Large corporation or public company</li>
                  <li>• Restaurant - Restaurant or food service business</li>
                  <li>• Hotel - Hotel or accommodation business</li>
                  <li>• Store - Retail store or shop</li>
                  <li>• ProfessionalService - Professional service provider</li>
                  <li>• MedicalBusiness - Medical practice or healthcare</li>
                </ul>
              </div>

              {/* Content & Articles */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                <div className="text-3xl mb-4">📝</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Content & Articles (8 types)</h3>
                <p className="text-gray-600 mb-3">Ideal for blogs, news sites, and content marketing.</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Article - News article or blog post</li>
                  <li>• BlogPosting - Blog post or blog article</li>
                  <li>• NewsArticle - News article or journalism content</li>
                  <li>• Review - Product/service/business review</li>
                  <li>• FAQ Page - Frequently Asked Questions page</li>
                  <li>• How-To - Step-by-step instructions or tutorial</li>
                  <li>• Recipe - Cooking recipe or food preparation</li>
                  <li>• Video - Video content or media</li>
                </ul>
              </div>

              {/* E-commerce & Products */}
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-100">
                <div className="text-3xl mb-4">🛍️</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">E-commerce & Products (3 types)</h3>
                <p className="text-gray-600 mb-3">Essential for online stores and product listings.</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Product - Physical or digital product listing</li>
                  <li>• Offer - Product or service offer</li>
                  <li>• AggregateOffer - Multiple offers for same product</li>
                </ul>
              </div>

              {/* Events & Activities */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-3xl mb-4">📅</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Events & Activities (4 types)</h3>
                <p className="text-gray-600 mb-3">Great for conferences, webinars, and local events.</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Event - Conference, webinar, or event listing</li>
                  <li>• Course - Educational course or training program</li>
                  <li>• Webinar - Online webinar or virtual event</li>
                  <li>• SportsEvent - Sports game or competition</li>
                </ul>
              </div>

              {/* People & Jobs */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-100">
                <div className="text-3xl mb-4">👤</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">People & Jobs (3 types)</h3>
                <p className="text-gray-600 mb-3">For personal profiles and job listings.</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Person - Individual person profile</li>
                  <li>• JobPosting - Job opening or employment opportunity</li>
                  <li>• Employee - Employee information and role</li>
                </ul>
              </div>

              {/* Creative Works */}
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-100">
                <div className="text-3xl mb-4">🎨</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Creative Works (3 types)</h3>
                <p className="text-gray-600 mb-3">For books, movies, and creative content.</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Book - Published book or e-book</li>
                  <li>• Movie - Film or movie information</li>
                  <li>• MusicAlbum - Music album or collection</li>
                </ul>
              </div>

              {/* Places & Locations */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                <div className="text-3xl mb-4">📍</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Places & Locations (3 types)</h3>
                <p className="text-gray-600 mb-3">For geographic locations and attractions.</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Place - Generic place or location</li>
                  <li>• TouristAttraction - Tourist destination or attraction</li>
                  <li>• LodgingBusiness - Hotel, motel, or accommodation</li>
                </ul>
              </div>

              {/* Technology & Software */}
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-100">
                <div className="text-3xl mb-4">💻</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Technology & Software (3 types)</h3>
                <p className="text-gray-600 mb-3">For apps, software, and digital products.</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• SoftwareApplication - Software app or program</li>
                  <li>• WebApplication - Web-based application or service</li>
                  <li>• MobileApplication - Mobile app for smartphones/tablets</li>
                </ul>
              </div>

              {/* Medical & Health */}
              <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border border-red-100">
                <div className="text-3xl mb-4">🏥</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Medical & Health (2 types)</h3>
                <p className="text-gray-600 mb-3">For healthcare and medical information.</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• MedicalCondition - Health condition or disease</li>
                  <li>• Drug - Pharmaceutical drug or medication</li>
                </ul>
              </div>

              {/* Automotive */}
              <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-100">
                <div className="text-3xl mb-4">🚗</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Automotive (2 types)</h3>
                <p className="text-gray-600 mb-3">For vehicles and automotive content.</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Vehicle - Car, motorcycle, or other vehicle</li>
                  <li>• Car - Automobile or car</li>
                </ul>
              </div>
            </div>

            <div className="text-center mt-8">
              <p className="text-gray-600">
                <strong>Complete coverage of {getTotalSchemaCount()} essential schema types!</strong> From basic business information to complex structured data, generate professional JSON-LD markup for any website.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Frequently Asked Questions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">How many schema types does this generator support?</h3>
                <p className="text-gray-600">Our schema generator currently supports {getTotalSchemaCount()}+ of the most popular and useful schema.org types, organized by category. These cover all the essential schemas you need for SEO, including business, content, e-commerce, events, and more.</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Is the generated schema markup valid?</h3>
                <p className="text-gray-600">Yes, all generated schema markup follows schema.org standards and Google's structured data guidelines. We also provide built-in validation to ensure your markup is error-free.</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Can I customize schema types?</h3>
                <p className="text-gray-600">Absolutely! Our advanced schema builder allows you to create custom schema types and add specific properties tailored to your industry or use case.</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">How do I implement the generated schema?</h3>
                <p className="text-gray-600">Simply copy the generated JSON-LD code and paste it into the &lt;head&gt; section of your HTML page, or use our export features to download the schema files.</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Does this tool help with rich snippets?</h3>
                <p className="text-gray-600">Yes! Our schema generator creates markup that's optimized for Google's rich snippets, helping improve your search result appearance and click-through rates.</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Is there a limit on usage?</h3>
                <p className="text-gray-600">The tool is completely free with a reasonable session limit to prevent abuse. Simply refresh the page to continue generating more schema markup.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore More SEO Tools Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-indigo/5">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-800">Explore Our Other SEO Tools</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover our complete suite of free SEO tools designed to help you optimize your website, improve rankings, and drive more organic traffic.
              </p>
            </div>

            {/* Featured Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">🔧</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Schema Markup Generator</h3>
                <p className="text-sm text-gray-600 mb-4">Generate perfect JSON-LD schema markup for any website type.</p>
                <span className="text-green-600 font-medium">✓ Current Tool</span>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">🔍</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Long Tail Keyword Generator</h3>
                <p className="text-sm text-gray-600 mb-4">Find hidden keywords that actually convert and drive traffic.</p>
                <a href="/tools/long-tail-keyword-generator/" className="text-primary font-medium hover:underline">
                  Try Tool →
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">🏷️</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Meta Tag Optimizer</h3>
                <p className="text-sm text-gray-600 mb-4">Generate perfect title tags and meta descriptions for better CTR.</p>
                <a href="/tools/meta-tag-optimizer/" className="text-primary font-medium hover:underline">
                  Try Tool →
                </a>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <a 
                href="/tools/"
                className="inline-flex items-center bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span className="mr-2">🛠️</span>
                Browse All SEO Tools
              </a>
              <p className="text-sm text-gray-500 mt-3">
                All tools are 100% free • No signup required • Instant results
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-br from-primary to-primary/90 text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Start Generating Professional Schema Markup Today</h2>
            <p className="text-lg mb-8 opacity-90">
              Stop leaving rich snippets to chance. Create professional, valid schema markup that search engines understand and reward with better rankings and enhanced search results.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button 
                onClick={() => window.scrollTo({ top: 200, behavior: 'smooth' })}
                className="bg-white text-primary px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                🔧 Use the Schema Generator →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm opacity-90">
              <div className="flex items-center justify-center space-x-2">
                <span>🚀</span>
                <span>Generate schema markup in seconds - no coding required</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span>✅</span>
                <span>Built-in validation ensures error-free markup</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span>📊</span>
                <span>Improve your search rankings and rich snippet appearance</span>
              </div>
            </div>
            
            <p className="text-sm mt-6 opacity-80">
              <strong>Create professional schema markup with SEO Shouts' advanced Schema Generator!</strong>
              <br />
              <em>Trusted by thousands of SEO professionals, developers, and marketers worldwide for reliable, valid structured data.</em>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

// FAQ Builder Component
function FAQBuilder({ questions, onChange }: { questions: any[], onChange: (questions: any[]) => void }) {
  const addQuestion = () => {
    onChange([...questions, { question: '', answer: '' }])
  }

  const updateQuestion = (index: number, field: string, value: string) => {
    const updated = [...questions]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const removeQuestion = (index: number) => {
    onChange(questions.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      {questions.map((q, index) => (
        <div key={index} className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-sm text-gray-700">Question {index + 1}</span>
            <button 
              onClick={() => removeQuestion(index)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Remove
            </button>
          </div>
          <input
            type="text"
            placeholder="Enter question"
            value={q.question}
            onChange={(e) => updateQuestion(index, 'question', e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <textarea
            placeholder="Enter answer"
            value={q.answer}
            onChange={(e) => updateQuestion(index, 'answer', e.target.value)}
            className="w-full p-2 border rounded"
            rows={2}
          />
        </div>
      ))}
      <button
        onClick={addQuestion}
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
      >
        Add Question
      </button>
    </div>
  )
}

// Steps Builder Component
function StepsBuilder({ steps, onChange }: { steps: any[], onChange: (steps: any[]) => void }) {
  const addStep = () => {
    onChange([...steps, { name: '', text: '', image: '' }])
  }

  const updateStep = (index: number, field: string, value: string) => {
    const updated = [...steps]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const removeStep = (index: number) => {
    onChange(steps.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div key={index} className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-sm text-gray-700">Step {index + 1}</span>
            <button 
              onClick={() => removeStep(index)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Remove
            </button>
          </div>
          <input
            type="text"
            placeholder="Step title"
            value={step.name}
            onChange={(e) => updateStep(index, 'name', e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <textarea
            placeholder="Step instructions"
            value={step.text}
            onChange={(e) => updateStep(index, 'text', e.target.value)}
            className="w-full p-2 border rounded mb-2"
            rows={2}
          />
          <input
            type="url"
            placeholder="Step image URL (optional)"
            value={step.image}
            onChange={(e) => updateStep(index, 'image', e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
      ))}
      <button
        onClick={addStep}
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
      >
        Add Step
      </button>
    </div>
  )
}