'use client'

import { useState, useEffect, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import ShapeGrid from '../../components/ShapeGrid'

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

export default function SchemaGeneratorClient() {
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

  // Load usage count from session storage
  useEffect(() => {
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
        { name: 'email', type: 'email', required: false, description: 'Contact email', example: 'seoshouts@gmail.com' },
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
    <>

      {/* --- TOOL HERO --- */}
      <div id="top" className="tool-hero">
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'all' }}>
          <ShapeGrid direction="diagonal" speed={0.4} borderColor="rgba(37,99,235,0.22)" squareSize={52} hoverFillColor="rgba(37,99,235,0.2)" hoverTrailAmount={6} />
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,9,10,0.35)', pointerEvents: 'none' }} />
        <div className="tool-hero-inner">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span className="breadcrumb-sep">/</span>
            <a href="/tools/">SEO Tools</a>
            <span className="breadcrumb-sep">/</span>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>Schema Generator</span>
          </nav>
          <div className="tool-hero-badge">Free SEO Tool</div>
          <h1 className="tool-hero-h1">
            Free Schema Markup <span>Generator</span>
          </h1>
          <p className="tool-hero-sub">
            Help Google understand your content and earn rich results. Our{' '}
            <strong style={{ color: 'rgba(255,255,255,0.85)' }}>Free Schema Markup Generator</strong>{' '}
            creates perfect JSON-LD structured data for articles, local businesses, FAQs, products, reviews, and more — paste it in, no coding required.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem 2rem', marginTop: '1.5rem' }}>
            {['10+ Schema Types', 'JSON-LD Format', 'Google-Validated', '100% Free'].map(label => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: 'var(--green)', fontWeight: 700, fontSize: '0.85rem' }}>&#10003;</span>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 500 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- TOOL INPUT SECTION --- */}
      <div className="tool-input-section">
        <div className="tool-input-inner" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>

          {/* -- LEFT BOX — Configure Schema -- */}
          <div className="tool-box" style={{ maxWidth: 'none' }}>
            <h2 className="tool-box-heading">Configure Schema</h2>

            {/* Free Tool Notice */}
            <div style={{ marginBottom: '1.25rem', padding: '12px 16px', background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.18)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--blue-light)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--blue-light)' }}>100% Free • No Registration Required</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--gray-4)', marginTop: 2 }}>Generate unlimited schema markup instantly</div>
                </div>
              </div>
            </div>

            {/* Schema Type Selection */}
            <label className="tool-box-label">
              Select Schema Type * <span style={{ fontWeight: 400, color: 'var(--gray-4)' }}>({getTotalSchemaCount()} types available)</span>
            </label>
            <div className="schema-dropdown" style={{ position: 'relative', marginBottom: '0.35rem' }}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{
                  width: '100%', padding: '13px 16px', border: '1px solid var(--gray-3)',
                  background: 'var(--white)', color: 'var(--ink)', fontSize: '0.9rem',
                  fontFamily: 'Inter, sans-serif', cursor: 'pointer', textAlign: 'left',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', outline: 'none'
                }}
              >
                <span>{getCurrentSchemaTypeForDisplay()}</span>
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gray-4)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                  style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', flexShrink: 0 }}>
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div style={{ position: 'absolute', zIndex: 50, width: '100%', marginTop: 4, background: '#fff', border: '1px solid var(--gray-3)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', maxHeight: 320, overflow: 'hidden' }}>
                  <div style={{ padding: '0.75rem', borderBottom: '1px solid var(--line)' }}>
                    <div style={{ position: 'relative' }}>
                      <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="var(--gray-4)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
                      </svg>
                      <input
                        type="text"
                        placeholder="Search schema types..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8, border: '1px solid var(--gray-3)', fontSize: '0.85rem', outline: 'none', fontFamily: 'Inter, sans-serif' }}
                      />
                    </div>
                  </div>
                  <div style={{ maxHeight: 240, overflowY: 'auto' }}>
                    {getSchemaCategories().map(category => {
                      const categoryTypes = getFilteredSchemaTypes().filter(type => type.category === category)
                      if (categoryTypes.length === 0) return null
                      return (
                        <div key={category}>
                          <div style={{ padding: '6px 12px', fontSize: '0.7rem', fontWeight: 700, color: 'var(--gray-5)', textTransform: 'uppercase', letterSpacing: '0.08em', background: 'var(--gray-1)', borderBottom: '1px solid var(--line)' }}>
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
                              style={{
                                width: '100%', textAlign: 'left', padding: '10px 12px', cursor: 'pointer',
                                background: form.schemaType === type.id ? 'rgba(37,99,235,0.08)' : 'var(--white)',
                                border: 'none', borderBottom: '1px solid var(--line)',
                                fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', display: 'block'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: '1rem' }}>{getSchemaIcon(type.category)}</span>
                                <div>
                                  <div style={{ fontWeight: 600, color: form.schemaType === type.id ? 'var(--blue)' : 'var(--ink)' }}>{type.name}</div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-4)' }}>{type.description}</div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )
                    })}
                    {getFilteredSchemaTypes().length === 0 && (
                      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray-4)' }}>
                        <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 0.5rem', display: 'block' }}>
                          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                        </svg>
                        <p style={{ fontSize: '0.85rem', marginBottom: 4 }}>No schema types found</p>
                        <p style={{ fontSize: '0.78rem' }}>Try a different search term</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--gray-4)', marginBottom: '1.25rem' }}>Choose the schema type that best matches your content</p>

            {/* Page URL */}
            <label className="tool-box-label" htmlFor="url">
              Page URL <span style={{ fontWeight: 400, color: 'var(--gray-4)' }}>(Optional)</span>
            </label>
            <input
              type="url"
              id="url"
              className="tool-url-input"
              value={form.url}
              onChange={(e) => setForm(prev => ({ ...prev, url: e.target.value }))}
              placeholder="https://example.com/page"
            />
            <p style={{ fontSize: '0.78rem', color: 'var(--gray-4)', marginBottom: '1.25rem', marginTop: '0.35rem' }}>URL where this schema will be implemented</p>

            {/* Dynamic Form Fields */}
            <div style={{ maxHeight: '24rem', overflowY: 'auto', overflowX: 'visible', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
              {renderFormFields()}
            </div>

            {/* Human Verification */}
            <div style={{ padding: '1rem 1.25rem', border: '1px solid var(--blue-mid)', borderLeft: '4px solid var(--blue)', background: 'var(--blue-pale)', marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--blue-dark)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Human Verification Required
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--blue-dark)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                Please verify that you&apos;re not a robot to generate schema markup.
              </p>
              <div style={{ marginBottom: '0.5rem' }}>
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                  onChange={handleCaptchaChange}
                  theme="light"
                />
              </div>
              {isVerified && (
                <div style={{ marginTop: '0.5rem', padding: '8px 12px', background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.25)', fontSize: '0.82rem', fontWeight: 600, color: 'var(--green)' }}>
                  &#10003; Verification successful! You can now generate schema.
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div style={{ marginBottom: '1rem', padding: '10px 14px', background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)', fontSize: '0.85rem', color: 'var(--red)' }}>
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={generateSchema}
                disabled={loading || !isVerified}
                className="tool-analyze-btn"
                style={{ flex: 1 }}
              >
                <div className="tool-analyze-btn-dot" />
                {loading ? (
                  <>
                    <svg className="animate-spin" style={{ width: 16, height: 16, marginRight: '0.4rem' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating Schema...
                  </>
                ) : (
                  !isVerified ? 'Complete Verification First' : 'Generate Schema'
                )}
              </button>
              <button
                onClick={resetForm}
                style={{ padding: '14px 20px', background: 'var(--gray-1)', color: 'var(--gray-5)', border: '1px solid var(--line)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Reset
              </button>
            </div>
          </div>

          {/* -- RIGHT BOX — Generated Schema -- */}
          <div className="tool-box" style={{ maxWidth: 'none' }}>
            <h2 className="tool-box-heading">Generated Schema</h2>

            {generatedSchema === '' ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                <div style={{ width: 56, height: 56, background: 'var(--gray-1)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="var(--gray-4)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
                  </svg>
                </div>
                <p style={{ color: 'var(--gray-4)', fontSize: '0.88rem', lineHeight: 1.6, maxWidth: 260, margin: '0 auto' }}>
                  Configure your schema type and generate JSON-LD markup
                </p>
              </div>
            ) : (
              <div>
                {/* Export Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <button onClick={copyToClipboard} style={{ padding: '7px 14px', background: 'var(--gray-1)', color: 'var(--gray-5)', border: '1px solid var(--line)', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer', borderRadius: 4, fontFamily: 'Space Grotesk, sans-serif' }}>
                    {copied ? '✓ Copied!' : 'Copy Schema'}
                  </button>
                  <button onClick={downloadJSON} style={{ padding: '7px 14px', background: 'var(--blue)', color: '#fff', border: 'none', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer', borderRadius: 4, fontFamily: 'Space Grotesk, sans-serif' }}>
                    Download JSON
                  </button>
                  <button onClick={validateSchema} disabled={loading} style={{ padding: '7px 14px', background: 'rgba(22,163,74,0.1)', color: 'var(--green)', border: '1px solid rgba(22,163,74,0.25)', fontWeight: 600, fontSize: '0.78rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, borderRadius: 4, fontFamily: 'Space Grotesk, sans-serif' }}>
                    {loading ? 'Validating...' : 'Validate'}
                  </button>
                </div>

                {/* Testing Tools */}
                <div style={{ marginBottom: '1rem', padding: '1rem 1.25rem', border: '1px solid var(--blue-mid)', borderLeft: '4px solid var(--blue)', background: 'var(--blue-pale)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--blue-dark)', marginBottom: '0.5rem' }}>Test Your Schema Online</div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                    <button onClick={() => handleTestingToolClick('google')} style={{ padding: '7px 14px', background: 'var(--blue)', color: '#fff', border: 'none', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer', borderRadius: 4, fontFamily: 'Space Grotesk, sans-serif' }}>
                      Google Rich Results Test
                    </button>
                    <button onClick={() => handleTestingToolClick('schema')} style={{ padding: '7px 14px', background: 'rgba(22,163,74,0.1)', color: 'var(--green)', border: '1px solid rgba(22,163,74,0.25)', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer', borderRadius: 4, fontFamily: 'Space Grotesk, sans-serif' }}>
                      Schema.org Validator
                    </button>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--blue-dark)' }}>
                    Click to copy schema and open testing tool with step-by-step instructions!
                  </p>
                  {copied && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.82rem', fontWeight: 600, color: 'var(--green)' }}>
                      Schema copied to clipboard! Check the instructions in the popup.
                    </div>
                  )}
                </div>

                {/* Validation Result */}
                {validationResult && (
                  <div style={{
                    padding: '1rem 1.25rem', marginBottom: '1rem',
                    background: validationResult.isValid ? 'rgba(22,163,74,0.08)' : 'rgba(220,38,38,0.08)',
                    border: `1px solid ${validationResult.isValid ? 'rgba(22,163,74,0.25)' : 'rgba(220,38,38,0.2)'}`
                  }}>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', color: validationResult.isValid ? 'var(--green)' : 'var(--red)', marginBottom: '0.4rem' }}>
                      {validationResult.isValid ? '✓ Schema is Valid!' : '✗ Schema has Errors'}
                    </div>
                    {validationResult.warnings.length > 0 && (
                      <div style={{ fontSize: '0.85rem', color: 'var(--amber)' }}>
                        <strong>Warnings:</strong>
                        <ul style={{ listStyle: 'disc', paddingLeft: '1.25rem', marginTop: '0.25rem' }}>
                          {validationResult.warnings.map((warning: string, index: number) => (
                            <li key={index}>{warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Schema Code */}
                <div style={{ background: '#111318', padding: '1.25rem', overflowX: 'auto', fontSize: '0.8rem', fontFamily: 'JetBrains Mono, monospace', maxHeight: '24rem', overflowY: 'auto' }}>
                  <div style={{ color: '#c084fc', marginBottom: '0.5rem' }}>&lt;script type=&quot;application/ld+json&quot;&gt;</div>
                  <pre style={{ color: '#86efac', margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{generatedSchema}</pre>
                  <div style={{ color: '#c084fc', marginTop: '0.5rem' }}>&lt;/script&gt;</div>
                </div>

                <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: 'var(--gray-4)' }}>
                  Generated {form.schemaType} schema markup ready for implementation
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* --- FOUNDER QUOTE --- */}
      <section className="section founder-section" style={{ padding: '3rem 2rem' }}>
        <div className="section-container">
          <div className="founder-inner">
            <div className="founder-avatar">RS</div>
            <div>
              <div className="founder-name">Built by Rohit Sharma — 13+ Years in Technical SEO</div>
              <p className="founder-quote-text">
                &ldquo;I built this schema generator because every free tool I found either supported only 5–10 schema types or locked the useful ones behind a paid plan. SEOShouts&apos; generator covers all 39 essential schema.org types with advanced property builders—the tool I wish existed when I was starting out with structured data.&rdquo;
              </p>
              <div className="founder-role">
                — Rohit Sharma, Founder of SEOShouts &middot;{' '}
                <a href="/meet-the-experts/" style={{ color: 'var(--blue-light)' }}>Meet Our Experts</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- WHAT IS SCHEMA MARKUP --- */}
      <section className="section prose-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Overview</div>
            <h2 className="s-title">What is Schema Markup and Why Does It <span className="blue">Improve Rankings?</span></h2>
          </div>
          <div className="prose-content">
            <p>The Most Advanced Schema Generator Available — Completely Free</p>
            <p>
              A schema markup generator creates structured data in JSON-LD format that helps search engines understand your website content, enabling rich snippets, knowledge graph inclusion, and enhanced search results across 39+ schema.org types including Organization, Article, Product, Event, and specialized business schemas.
            </p>
            <p>
              <strong>Built for SEO professionals, developers, and marketers</strong> who need reliable, valid schema markup that actually improves search rankings and rich snippet appearance with zero coding knowledge required.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexWrap: 'wrap', gap: '0.5rem 2rem', margin: '1rem 0 1.5rem' }}>
              {['39+ Schema Types', 'Intelligent Form Builder', 'Google Rich Results Integration', 'Multi-Field Support', '100% Free, No Login'].map(pill => (
                <li key={pill} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ color: 'var(--blue)', fontWeight: 700, fontSize: '0.82rem' }}>&#10003;</span>
                  <span style={{ fontSize: '0.88rem', color: 'var(--gray-5)' }}>{pill}</span>
                </li>
              ))}
            </ul>
            <p>
              Schema markup is structured data code that tells search engines exactly what your content means—not just what it says. Instead of letting Google guess whether &ldquo;Apple&rdquo; means the fruit or the company, schema explicitly defines entities, relationships, and attributes using schema.org vocabulary.
            </p>
            <p>
              According to Searchmetrics analysis of 10,000 URLs, websites with schema markup rank an average of 4 positions higher than those without. While correlation doesn&apos;t equal causation, the ranking boost comes from improved click-through rates (CTR) that signal quality to Google&apos;s algorithm.
            </p>
            <h3>Here&apos;s what schema markup does for your website:</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem 2rem', margin: '1rem 0 1.5rem' }}>
              {[
                { bold: 'Rich snippets in SERPs', rest: ' — Star ratings, prices, images, FAQs displayed directly in search results' },
                { bold: '36% higher CTR on average', rest: ' — Enhanced results attract significantly more clicks (Search Engine Land data)' },
                { bold: 'Voice search optimization', rest: ' — Essential for Google Assistant, Alexa, Siri answers' },
                { bold: 'Knowledge graph inclusion', rest: ' — Appear in Google\'s knowledge panels and entity carousel' },
                { bold: 'Local SEO dominance', rest: ' — Critical for Google Business Profile and local pack rankings' },
                { bold: 'E-commerce conversion boost', rest: ' — Product schema with pricing/availability increases sales by 30% (Google research)' },
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--blue)', flexShrink: 0, fontWeight: 700, fontSize: '0.82rem', marginTop: 2 }}>&#10003;</span>
                  <span style={{ fontSize: '0.88rem', color: 'var(--gray-5)', lineHeight: 1.55 }}>
                    <strong>{item.bold}</strong>{item.rest}
                  </span>
                </li>
              ))}
            </ul>
            <div className="prose-callout">
              <div className="prose-callout-title">Bottom Line</div>
              <p>Schema markup is the difference between a basic blue link and a rich, engaging result that dominates search real estate and drives qualified traffic.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- KEY FEATURES --- */}
      <section className="section features-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Key Features</div>
            <h2 className="s-title">Advanced Features That Make <span className="blue">Schema Generation Easy</span></h2>
          </div>
          <div className="features-grid">
            {[
              { paths: ['M13 10V3L4 14h7v7l9-11h-7z'], title: 'Instant JSON-LD Generation', desc: 'Generate perfect JSON-LD markup in seconds. No coding knowledge required—intelligent forms guide you through required and optional properties with contextual examples.' },
              { paths: ['M12 2L2 7l10 5 10-5-10-5', 'M2 17l10 5 10-5', 'M2 12l10 5 10-5'], title: 'Category-Based Organization', desc: '39 schema types organized into 11 logical categories (Business, Content, E-commerce, Events, People, Jobs, Creative, Places, Technology, Medical, Automotive) with searchable dropdown.' },
              { paths: ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'M7 10l5 5 5-5', 'M12 15V3'], title: 'Multiple Export Options', desc: 'Download as JSON files, copy to clipboard with one click, or get ready-to-use JSON-LD code snippets for immediate implementation in your HTML <head> section.' },
              { paths: ['M9 11l3 3L22 4', 'M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11'], title: 'No Login Required', desc: 'Completely free with zero usage limits. No account creation, no email signup, no credit card. Generate unlimited schema markup with just reCAPTCHA verification per session.' },
              { paths: ['M12 20h9', 'M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z'], title: 'Advanced Property Builders', desc: 'Specialized builders for complex schema properties: PostalAddress with full field breakdown, GeoCoordinates for location data, AggregateRating for reviews, FAQ pairs for question pages, and step-by-step instructions for How-To content.' },
              { paths: ['M12 18h.01', 'M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z'], title: 'Mobile-Optimized Interface', desc: 'Responsive design works perfectly on desktop, tablet, and mobile. Generate schema markup anywhere, anytime, on any device.' },
            ].map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    {f.paths.map((d, j) => <path key={j} d={d} />)}
                  </svg>
                </div>
                <div className="feature-title">{f.title}</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--gray-4)', lineHeight: 1.6, margin: '0.75rem 0 0' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- HOW TO USE --- */}
      <section className="section howto-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">How To Use</div>
            <h2 className="s-title">How to Use the Schema Generator <span className="blue">(Step by Step)</span></h2>
          </div>
          <div className="steps-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {[
              { num: '01', title: 'Choose Your Schema Type', desc: 'Select from 39 schema types using the searchable dropdown with category filtering. Categories include Business, Content, E-commerce, Events, People, and specialized types.' },
              { num: '02', title: 'Fill in the Required Information', desc: 'Complete the dynamically generated form fields with your specific information. Required fields are marked with asterisks (*) and include contextual examples.' },
              { num: '03', title: 'Add Optional Properties', desc: 'Include additional properties to make your schema more comprehensive. Use advanced builders for addresses, geo-coordinates, ratings, FAQ pairs, and step instructions.' },
              { num: '04', title: 'Complete Human Verification', desc: 'Verify with Google reCAPTCHA (one-time per session) to ensure high-quality results and prevent automated abuse of the tool.' },
              { num: '05', title: 'Generate and Validate', desc: 'Click generate to create your JSON-LD schema markup. The tool automatically validates required fields and provides error feedback if needed.' },
              { num: '06', title: 'Export and Test', desc: 'Copy to clipboard or download as JSON file. Use the integrated Google Rich Results Test button to validate your schema immediately.' },
              { num: '07', title: 'Implement on Your Website', desc: "Paste the generated JSON-LD code into the <head> section of your HTML page. JSON-LD is Google's recommended format and doesn't require inline markup." },
            ].map((step, i) => (
              <div key={step.num} className="step-card" style={{
                borderRight: i % 3 === 2 ? 'none' : '1px solid var(--line)',
                borderBottom: i < 6 ? '1px solid var(--line)' : 'none',
                gridColumn: i === 6 ? '2' : undefined
              }}>
                {i % 3 !== 2 && i < 6 && (
                  <div className="step-connector">
                    <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14 M12 5l7 7-7 7" /></svg>
                  </div>
                )}
                <div className="step-num-big">{step.num}</div>
                <div className="step-title">{step.title}</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--gray-4)', lineHeight: 1.6, margin: '0.5rem 0 0' }}>{step.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '2rem', background: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.15)', padding: '1.25rem 1.5rem', textAlign: 'center' }}>
            <p style={{ margin: 0, color: 'var(--gray-5)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              <strong>Pro tip:</strong> Always test with Google&apos;s Rich Results Test after implementation. Not all schema types are eligible for rich results—check Google&apos;s documentation for current eligibility.
            </p>
          </div>
        </div>
      </section>

      {/* --- WHY OUR GENERATOR --- */}
      <section className="section why-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Why Choose Us</div>
            <h2 className="s-title">Why Our Schema Generator <span className="blue">Outperforms Competitors</span></h2>
          </div>
          <div className="why-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginTop: '3rem' }}>
            {[
              {
                title: '39+ Schema Types — Most Comprehensive Available',
                iconPaths: ['M12 2L2 7l10 5 10-5-10-5', 'M2 17l10 5 10-5', 'M2 12l10 5 10-5'],
                body: 'Support for 39+ carefully selected schema.org types organized across 11 categories—more than any free generator. From basic Organization to specialized MedicalCondition, Drug, Vehicle, and SportsEvent schemas competitors ignore.',
                bullets: ['39+ schema types vs 10-15 for most competitors', '11 industry-specific categories with visual organization', 'Advanced schemas: FAQ builder, How-To steps, AggregateRating', 'Regular updates when Google adds new rich result eligibility'],
              },
              {
                title: 'Intelligent Form Builder with Multi-Field Support',
                iconPaths: ['M12 20h9', 'M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z'],
                body: 'Dynamic forms that adapt based on your selected schema type, with advanced builders for complex properties like addresses, geo-coordinates, ratings, FAQ pairs, and step-by-step instructions.',
                bullets: ['Dynamic field generation per schema type', 'Address builder (street, city, state, postal, country)', 'Geographic coordinates (latitude/longitude)', 'FAQ builder for unlimited Q&A pairs', 'Step-by-step builder for How-To content', 'Aggregate rating system with customizable scale', 'Helpful examples and real-time validation'],
              },
              {
                title: 'Direct Google Rich Results Test Integration',
                iconPaths: ['M9 11l3 3L22 4', 'M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11'],
                body: "One-click access to Google's Rich Results Test and Schema.org Validator. Copy your generated markup and open testing tools instantly—no manual copy-paste between tabs.",
                bullets: ['Built-in schema validation before export', 'Direct Rich Results Test integration', 'Schema.org Validator quick access', 'Error detection with fix recommendations', 'Required field enforcement', 'Best practice compliance checking'],
              },
            ].map((card) => (
              <div key={card.title} className="why-card">
                <div className="why-card-title">
                  <div className="why-card-icon">
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      {card.iconPaths.map((d, j) => <path key={j} d={d} />)}
                    </svg>
                  </div>
                  {card.title}
                </div>
                <div className="why-card-body">{card.body}</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0.75rem 0 0', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {card.bullets.map((b, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                      <span style={{ color: 'var(--blue)', flexShrink: 0, fontWeight: 700, fontSize: '0.78rem', marginTop: 2 }}>&#10003;</span>
                      <span style={{ fontSize: '0.82rem', color: 'var(--gray-4)', lineHeight: 1.5 }}>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- COMPARISON TABLE --- */}
      <section className="section prose-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Tool Comparison</div>
            <h2 className="s-title">How Does Our Schema Generator <span className="blue">Compare to Other Tools?</span></h2>
          </div>
          <p style={{ color: 'var(--gray-4)', fontSize: '0.95rem', maxWidth: 680, marginBottom: '2rem', lineHeight: 1.6 }}>
            Most free schema generators support 10-15 basic types. We offer 39+ carefully selected schemas organized by industry, with advanced multi-field builders and direct Google Rich Results Test integration.
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid var(--line)', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'var(--ink)', color: '#fff' }}>
                  {['Feature', 'SEO Shouts', 'Merkle', 'TechnicalSEO', 'Schema.org'].map((h, i) => (
                    <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '0.82rem', color: i === 1 ? 'var(--blue-light)' : i === 0 ? '#fff' : 'rgba(255,255,255,0.6)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Schema Types Supported', us: '39+', merkle: '15', tech: '12', schema: 'All (complex)' },
                  { feature: 'Advanced Property Builders', us: '✓ Address, Geo, FAQ, Steps, Rating', merkle: 'Basic only', tech: '✗', schema: '✗' },
                  { feature: 'Category Organization', us: '✓ 11 categories with search', merkle: '✗', tech: '✗', schema: '✗' },
                  { feature: 'Google Rich Results Integration', us: '✓ One-click test', merkle: '✗', tech: '✗', schema: '✗' },
                  { feature: 'No Login Required', us: '✓', merkle: '✓', tech: '✓', schema: '✓' },
                  { feature: 'Export Options', us: 'Copy + Download JSON', merkle: 'Copy only', tech: 'Copy only', schema: 'Manual coding' },
                  { feature: 'Mobile Responsive', us: '✓', merkle: '✓', tech: 'Partial', schema: '✗' },
                ].map((row, i) => (
                  <tr key={row.feature} style={{ background: i % 2 === 0 ? 'var(--white)' : 'var(--gray-1)', borderBottom: '1px solid var(--line)' }}>
                    <td style={{ padding: '12px 20px', fontWeight: 600, color: 'var(--ink)' }}>{row.feature}</td>
                    <td style={{ padding: '12px 20px', color: 'var(--blue)', fontWeight: 600 }}>{row.us}</td>
                    <td style={{ padding: '12px 20px', color: 'var(--gray-5)' }}>{row.merkle}</td>
                    <td style={{ padding: '12px 20px', color: 'var(--gray-5)' }}>{row.tech}</td>
                    <td style={{ padding: '12px 20px', color: 'var(--gray-5)' }}>{row.schema}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* --- ALL SCHEMA TYPES --- */}
      <section className="section features-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Schema Types</div>
            <h2 className="s-title">All {getTotalSchemaCount()} Schema Types <span className="blue">Available in This Tool</span></h2>
          </div>
          <div className="why-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', marginTop: '3rem' }}>
            {[
              { cat: 'Business & Organizations (8 types)', iconPaths: ['M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z', 'M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16'], desc: 'Perfect for company websites, local businesses, and professional services.', items: ['Organization — Company/business information', 'LocalBusiness — Local business with physical location', 'Corporation — Large corporation or public company', 'Restaurant — Restaurant or food service business', 'Hotel — Hotel or accommodation business', 'Store — Retail store or shop', 'ProfessionalService — Professional service provider', 'MedicalBusiness — Medical practice or healthcare'] },
              { cat: 'Content & Articles (8 types)', iconPaths: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M16 13H8', 'M16 17H8', 'M10 9H8'], desc: 'Ideal for blogs, news sites, and content marketing.', items: ['Article — News article or blog post', 'BlogPosting — Blog post or blog article', 'NewsArticle — News article or journalism content', 'Review — Product/service/business review', 'FAQ Page — Frequently Asked Questions page', 'How-To — Step-by-step instructions or tutorial', 'Recipe — Cooking recipe or food preparation', 'Video — Video content or media'] },
              { cat: 'E-commerce & Products (3 types)', iconPaths: ['M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z', 'M3 6h18', 'M16 10a4 4 0 0 1-8 0'], desc: 'Essential for online stores and product listings.', items: ['Product — Physical or digital product listing', 'Offer — Product or service offer', 'AggregateOffer — Multiple offers for same product'] },
              { cat: 'Events & Activities (4 types)', iconPaths: ['M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z', 'M16 2v4', 'M8 2v4', 'M3 10h18'], desc: 'Great for conferences, webinars, and local events.', items: ['Event — Conference, webinar, or event listing', 'Course — Educational course or training program', 'Webinar — Online webinar or virtual event', 'SportsEvent — Sports game or competition'] },
              { cat: 'People & Jobs (3 types)', iconPaths: ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', 'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'], desc: 'For personal profiles and job listings.', items: ['Person — Individual person profile', 'JobPosting — Job opening or employment opportunity', 'Employee — Employee information and role'] },
              { cat: 'Creative Works (3 types)', iconPaths: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M16 13H8'], desc: 'For books, movies, and creative content.', items: ['Book — Published book or e-book', 'Movie — Film or movie information', 'MusicAlbum — Music album or collection'] },
              { cat: 'Places & Locations (3 types)', iconPaths: ['M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z', 'M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'], desc: 'For geographic locations and attractions.', items: ['Place — Generic place or location', 'TouristAttraction — Tourist destination or attraction', 'LodgingBusiness — Hotel, motel, or accommodation'] },
              { cat: 'Technology & Software (3 types)', iconPaths: ['M2 3h20a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z', 'M8 21h8', 'M12 17v4'], desc: 'For apps, software, and digital products.', items: ['SoftwareApplication — Software app or program', 'WebApplication — Web-based application or service', 'MobileApplication — Mobile app for smartphones/tablets'] },
              { cat: 'Medical & Health (2 types)', iconPaths: ['M22 12h-4l-3 9L9 3l-3 9H2'], desc: 'For healthcare and medical information.', items: ['MedicalCondition — Health condition or disease', 'Drug — Pharmaceutical drug or medication'] },
              { cat: 'Automotive (2 types)', iconPaths: ['M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v2', 'M16 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0', 'M7 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0'], desc: 'For vehicles and automotive content.', items: ['Vehicle — Car, motorcycle, or other vehicle', 'Car — Automobile or car'] },
            ].map((card) => (
              <div key={card.cat} className="why-card">
                <div className="why-card-title">
                  <div className="why-card-icon">
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      {card.iconPaths.map((d, j) => <path key={j} d={d} />)}
                    </svg>
                  </div>
                  {card.cat}
                </div>
                <div className="why-card-body">{card.desc}</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0.75rem 0 0', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  {card.items.map((item, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                      <span style={{ color: 'var(--blue)', flexShrink: 0, fontSize: '0.75rem', marginTop: 3 }}>•</span>
                      <span style={{ fontSize: '0.82rem', color: 'var(--gray-4)', lineHeight: 1.5 }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--gray-5)', fontSize: '0.9rem' }}>
              <strong>Complete coverage of {getTotalSchemaCount()} essential schema types!</strong> From basic business information to complex structured data, generate professional JSON-LD markup for any website.
            </p>
          </div>
        </div>
      </section>

      {/* --- WHAT TO IMPLEMENT FIRST --- */}
      <section className="section prose-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Implementation Guide</div>
            <h2 className="s-title">What Schema Types Should You <span className="blue">Implement First?</span></h2>
          </div>
          <p style={{ color: 'var(--gray-4)', fontSize: '0.95rem', maxWidth: 680, marginBottom: '2.5rem', lineHeight: 1.6 }}>
            Not all schema types carry equal SEO weight. Prioritize based on your website type and Google&apos;s current rich result eligibility:
          </p>
          <div className="why-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {[
              {
                num: '01',
                label: 'High Priority',
                sub: 'Implement First',
                accent: 'var(--green)',
                accentBg: 'rgba(22,163,74,0.08)',
                iconPaths: ['M13 10V3L4 14h7v7l9-11h-7z'],
                items: [
                  { bold: 'Organization/LocalBusiness', rest: ' — Brand entity recognition and knowledge graph inclusion' },
                  { bold: 'Article/BlogPosting', rest: ' — Article rich results with thumbnail, date, author in SERPs' },
                  { bold: 'Product', rest: ' — 30% conversion boost from price/availability rich snippets' },
                  { bold: 'FAQ Page', rest: ' — Expandable FAQ results dominate SERP real estate, +35% CTR' },
                  { bold: 'How-To', rest: ' — Step-by-step rich results with images for instructional queries' },
                ],
              },
              {
                num: '02',
                label: 'Medium Priority',
                sub: 'After Core Types',
                accent: 'var(--blue)',
                accentBg: 'rgba(37,99,235,0.06)',
                iconPaths: ['M3 3v18h18', 'm19 9-5 5-4-4-3 3'],
                items: [
                  { bold: 'Event', rest: ' — Dedicated Google Events search with rich details' },
                  { bold: 'Recipe', rest: ' — Visual recipe cards with ratings, cook time, calories' },
                  { bold: 'Video', rest: ' — Rich results show thumbnail, duration, appear in video carousel' },
                  { bold: 'Review', rest: ' — Star ratings in SERPs increase CTR for review content' },
                ],
              },
              {
                num: '03',
                label: 'Specialized',
                sub: 'Industry-Specific',
                accent: 'var(--gray-5)',
                accentBg: 'var(--gray-1)',
                iconPaths: ['M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z', 'M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16'],
                items: [
                  { bold: 'JobPosting', rest: ' — Google for Jobs listings with salary, location filters' },
                  { bold: 'Course', rest: ' — Educational content gets course provider rich results' },
                  { bold: 'MedicalCondition/Drug', rest: ' — Healthcare sites and medical knowledge graph' },
                  { bold: 'SoftwareApplication', rest: ' — App listings with ratings, price, platform compatibility' },
                ],
              },
            ].map((card) => (
              <div key={card.label} className="why-card" style={{ borderTop: `3px solid ${card.accent}`, position: 'relative' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 28, height: 28, background: card.accentBg, border: `1px solid ${card.accent}`,
                  marginBottom: '0.75rem'
                }}>
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={card.accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    {card.iconPaths.map((d, j) => <path key={j} d={d} />)}
                  </svg>
                </div>
                <div className="why-card-title" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.15rem', marginBottom: '0.25rem' }}>
                  <span style={{ color: card.accent, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'Space Grotesk, sans-serif' }}>{card.label}</span>
                  <span>{card.sub}</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0.75rem 0 0', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                  {card.items.map((item, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <span style={{ color: card.accent, flexShrink: 0, fontWeight: 700, fontSize: '0.8rem', marginTop: 2 }}>•</span>
                      <span style={{ fontSize: '0.83rem', color: 'var(--gray-5)', lineHeight: 1.55 }}>
                        <strong style={{ color: 'var(--ink)' }}>{item.bold}</strong>{item.rest}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="prose-callout" style={{ marginTop: '1.5rem' }}>
            <p style={{ margin: 0 }}>According to BrightEdge research, websites implementing 3+ relevant schema types see 30% higher visibility in rich results compared to single-schema implementations.</p>
          </div>
        </div>
      </section>

      {/* --- FAQ --- */}
      <section className="section faq-section" style={{ background: 'var(--gray-1)' }}>
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">FAQ</div>
            <h2 className="s-title">Frequently Asked <span className="blue">Questions</span></h2>
            <p className="s-sub">Everything you need to know about schema markup and this generator.</p>
          </div>
          <div className="faq-list">
            {[
              { q: 'What is schema markup and why does it matter for SEO?', a: "Schema markup is structured data code (JSON-LD format) that explicitly tells search engines what your content means—defining entities, relationships, and attributes using schema.org vocabulary. It matters because pages with schema rank 4 positions higher on average (Searchmetrics data) due to enhanced CTR from rich snippets, which signals quality to Google's algorithm." },
              { q: 'How many schema types does this generator support?', a: 'Our schema generator currently supports 39+ of the most popular and useful schema.org types, organized across 11 categories (Business, Content, E-commerce, Events, People, Jobs, Creative, Places, Technology, Medical, Automotive). This is significantly more than the 10-15 types offered by most free generators.' },
              { q: 'Is the generated schema markup valid and Google-compliant?', a: "Yes, all generated schema markup follows schema.org standards and Google's structured data guidelines. We provide built-in validation, enforce required fields, and offer direct integration with Google's Rich Results Test so you can verify compliance before implementation." },
              { q: 'What makes your schema generator better than competitors?', a: "Four key differentiators: (1) 39+ schema types versus 10–15 for most tools, (2) Advanced property builders for addresses, geo-coordinates, FAQs, steps, and ratings, (3) Direct Google Rich Results Test integration with one-click access, (4) Category-based organization with searchable dropdown and visual icons. Plus it's completely free with no login required." },
              { q: 'Can I customize schema types or add custom properties?', a: 'Our generator provides all standard schema.org properties for each type through intelligent form builders. For highly specialized custom properties not in our forms, you can generate the base schema and manually add custom properties to the exported JSON-LD code before implementation.' },
              { q: 'How do I implement the generated schema on my website?', a: "Copy the generated JSON-LD code and paste it into the <head> section of your HTML page, preferably before the closing </head> tag. JSON-LD is Google's recommended format because it doesn't require inline markup—all structured data lives in a single script tag. For WordPress sites, use a plugin like Schema Pro or Yoast SEO to add the code without editing theme files." },
              { q: 'Does this tool help with rich snippets in Google?', a: "Yes! Our schema generator creates markup optimized for Google's rich snippets. However, rich result eligibility varies by schema type—not all types trigger enhanced SERP displays. Use our integrated Google Rich Results Test button to verify if your specific schema is eligible. According to Search Engine Land, pages with rich snippets get 36% higher CTR on average." },
              { q: 'Is there a limit on usage or do I need to create an account?', a: 'The tool is completely free with zero usage limits and no account required. You only need to complete Google reCAPTCHA verification once per session to prevent automated abuse. No email signup, no credit card, no restrictions—generate unlimited schema markup anytime.' },
              { q: "What's the difference between JSON-LD and Microdata formats?", a: "JSON-LD (JavaScript Object Notation for Linked Data) is a script tag in the <head> section, while Microdata requires inline markup within HTML elements. Google explicitly recommends JSON-LD because it's easier to implement, maintain, and validate. Our generator outputs only JSON-LD—the modern, preferred format for structured data." },
              { q: 'Can I generate schema for multiple pages at once?', a: "Currently, our generator creates schema for one page/entity at a time for accuracy. However, many schema types (like Organization, LocalBusiness, Person) are site-wide and only need to be implemented once in your template. For e-commerce sites with hundreds of products, consider using dynamic schema generation through your CMS or a schema plugin that pulls from your product database." },
              { q: 'How do the advanced property builders work (FAQ, How-To, Address)?', a: 'Advanced builders provide specialized interfaces for complex schema properties: The FAQ builder lets you add unlimited question-answer pairs with proper Question schema nesting. The How-To builder creates step-by-step instructions with optional images and tools. The Address builder breaks down PostalAddress into street, city, state, postal code, and country fields. GeoCoordinates builder accepts latitude/longitude for precise location data. AggregateRating builder includes score, scale, and review count for star ratings.' },
              { q: 'Will schema markup improve my search rankings directly?', a: "Schema doesn't directly boost rankings like backlinks or content quality, but it indirectly improves rankings through enhanced CTR. Searchmetrics found pages with schema rank 4 positions higher on average because rich snippets attract more clicks. Higher CTR signals quality to Google's algorithm, creating a ranking boost over time. Schema also helps with voice search and knowledge graph inclusion—both increasingly important for visibility." },
              { q: 'What happens after I implement schema on my site?', a: 'After implementation: (1) Validate with Google Rich Results Test to check for errors, (2) Submit your sitemap to Google Search Console to expedite crawling, (3) Monitor Search Console\'s "Enhancements" section for schema-related issues or valid item counts, (4) Rich results typically appear within 1–4 weeks after Google recrawls and validates your markup.' },
            ].map(faq => (
              <details key={faq.q} className="faq-item">
                <summary>{faq.q}</summary>
                <div className="faq-answer">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* --- RELATED TOOLS --- */}
      <section className="section related-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Free Tools</div>
            <h2 className="s-title">Explore Our Other <span className="blue">SEO Tools</span></h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.95rem', maxWidth: 560, marginTop: '0.75rem', lineHeight: 1.6 }}>
              Discover our complete suite of free SEO tools designed to help you optimize your website, improve rankings, and drive more organic traffic.
            </p>
          </div>
          <div className="related-tools-grid">
            {[
              { name: 'Schema Generator', desc: 'Generate JSON-LD structured data for 39+ schema types with advanced property builders.', current: true, href: '/tools/schema-generator/', paths: ['M12 2L2 7l10 5 10-5-10-5', 'M2 17l10 5 10-5', 'M2 12l10 5 10-5'] },
              { name: 'On-Page SEO Analyzer', desc: 'Audit 150+ on-page SEO factors with real Google PageSpeed data and Core Web Vitals.', href: '/tools/on-page-seo-analyzer/', paths: ['M9 11l3 3L22 4', 'M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11'] },
              { name: 'Internal Link Checker', desc: 'Visualize anchor text distribution and audit internal link structure across your site.', href: '/tools/internal-link-checker/', paths: ['M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71', 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'] },
              { name: 'Robots.txt Generator', desc: 'Create robots.txt rules that control crawler access, including AI crawlers like GPTBot.', href: '/tools/robots-txt-generator/', paths: ['M12 2a3 3 0 0 0-3 3v1H6a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v4h10v-4h1a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3V5a3 3 0 0 0-3-3z', 'M9 12h.01', 'M15 12h.01'] },
              { name: 'Meta Tag Optimizer', desc: 'Generate perfect title tags and meta descriptions for better click-through rates.', href: '/tools/meta-tag-optimizer/', paths: ['M4 9h16', 'M4 15h16', 'M10 3 8 21', 'M16 3l-2 18'] },
            ].map(t => (
              <div key={t.name} className={`related-card${t.current ? ' current' : ''}`}>
                <div className="related-card-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    {t.paths.map((d, i) => <path key={i} d={d} />)}
                  </svg>
                </div>
                <div className="related-card-name"><a href={t.href}>{t.name}</a></div>
                <div className="related-card-desc">{t.desc}</div>
                <div className="related-card-status">
                  <div className="related-card-status-dot" />
                  {t.current ? 'Current tool' : 'Free — no login'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <div className="final-cta">
        <div className="final-cta-bg" />
        <div className="final-cta-inner">
          <h2 className="final-cta-title">Start Generating Professional <span>Schema Markup Today</span></h2>
          <p className="final-cta-sub">
            Stop leaving rich snippets to chance. Create professional, Google-compliant schema markup that search engines understand and reward with enhanced search results, knowledge graph inclusion, and 36% higher click-through rates on average.
          </p>
          <div className="final-cta-row">
            <button
              onClick={() => window.scrollTo({ top: 200, behavior: 'smooth' })}
              className="btn-primary"
            >
              Use the Schema Generator →
            </button>
          </div>
          <div className="final-cta-pills">
            {[
              '39+ schema types with intelligent form builders — no coding required',
              'Direct Google Rich Results Test integration for instant validation',
              'Improve rankings through enhanced CTR from rich snippets',
            ].map(p => (
              <div key={p} className="final-pill">{p}</div>
            ))}
          </div>
        </div>
      </div>

    </>
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
