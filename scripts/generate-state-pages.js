const fs = require('fs');
const path = require('path');

// All US states with their slugs and proper names
const states = [
  { name: 'Alabama', slug: 'alabama' },
  { name: 'Alaska', slug: 'alaska' },
  { name: 'Arizona', slug: 'arizona' },
  { name: 'Arkansas', slug: 'arkansas' },
  { name: 'Colorado', slug: 'colorado' },
  { name: 'Connecticut', slug: 'connecticut' },
  { name: 'Delaware', slug: 'delaware' },
  { name: 'Florida', slug: 'florida' },
  { name: 'Georgia', slug: 'georgia' },
  { name: 'Hawaii', slug: 'hawaii' },
  { name: 'Idaho', slug: 'idaho' },
  { name: 'Illinois', slug: 'illinois' },
  { name: 'Indiana', slug: 'indiana' },
  { name: 'Iowa', slug: 'iowa' },
  { name: 'Kansas', slug: 'kansas' },
  { name: 'Kentucky', slug: 'kentucky' },
  { name: 'Louisiana', slug: 'louisiana' },
  { name: 'Maine', slug: 'maine' },
  { name: 'Maryland', slug: 'maryland' },
  { name: 'Massachusetts', slug: 'massachusetts' },
  { name: 'Michigan', slug: 'michigan' },
  { name: 'Minnesota', slug: 'minnesota' },
  { name: 'Mississippi', slug: 'mississippi' },
  { name: 'Missouri', slug: 'missouri' },
  { name: 'Montana', slug: 'montana' },
  { name: 'Nebraska', slug: 'nebraska' },
  { name: 'Nevada', slug: 'nevada' },
  { name: 'New Hampshire', slug: 'new-hampshire' },
  { name: 'New Jersey', slug: 'new-jersey' },
  { name: 'New Mexico', slug: 'new-mexico' },
  { name: 'New York', slug: 'new-york' },
  { name: 'North Carolina', slug: 'north-carolina' },
  { name: 'North Dakota', slug: 'north-dakota' },
  { name: 'Ohio', slug: 'ohio' },
  { name: 'Oklahoma', slug: 'oklahoma' },
  { name: 'Oregon', slug: 'oregon' },
  { name: 'Pennsylvania', slug: 'pennsylvania' },
  { name: 'Rhode Island', slug: 'rhode-island' },
  { name: 'South Carolina', slug: 'south-carolina' },
  { name: 'South Dakota', slug: 'south-dakota' },
  { name: 'Tennessee', slug: 'tennessee' },
  { name: 'Texas', slug: 'texas' },
  { name: 'Utah', slug: 'utah' },
  { name: 'Vermont', slug: 'vermont' },
  { name: 'Virginia', slug: 'virginia' },
  { name: 'Washington', slug: 'washington' },
  { name: 'West Virginia', slug: 'west-virginia' },
  { name: 'Wisconsin', slug: 'wisconsin' },
  { name: 'Wyoming', slug: 'wyoming' }
];

const californiaPagePath = path.join(__dirname, '..', 'app', 'usa', 'california', 'seo-website-development', 'page.tsx');
const californiaPageContent = fs.readFileSync(californiaPagePath, 'utf8');

// Components to copy (these are reusable)
const componentsToCopy = [
  'SeoChecklist.tsx',
  'PricingPackages.tsx',
  'CoreWebVitalsScore.tsx',
  'CoreWebVitalsQuickCheck.tsx',
  'FaqSection.tsx'
];

console.log('Starting state page generation...\n');

states.forEach((state, index) => {
  const stateDir = path.join(__dirname, '..', 'app', 'usa', state.slug, 'seo-website-development');

  // Create directory structure
  if (!fs.existsSync(stateDir)) {
    fs.mkdirSync(stateDir, { recursive: true });
    console.log(`✓ Created directory: ${state.name}`);
  }

  // Copy and customize reusable components
  componentsToCopy.forEach(component => {
    const sourcePath = path.join(__dirname, '..', 'app', 'usa', 'california', 'seo-website-development', component);
    const destPath = path.join(stateDir, component);

    // Read the component content
    let componentContent = fs.readFileSync(sourcePath, 'utf8');

    // Special replacements for specific California references BEFORE general replacement
    if (component === 'SeoChecklist.tsx') {
      // Replace the entire Silicon Valley/LA phrase
      componentContent = componentContent.replace(/Silicon Valley startups, LA enterprises, and California market leaders/g, `${state.name} businesses and market leaders`);
    }

    // Replace California with state name
    componentContent = componentContent.replace(/California/g, state.name);
    componentContent = componentContent.replace(/california/g, state.slug);

    if (component === 'FaqSection.tsx') {
      // Replace FAQ variable name (remove hyphens for valid JS variable name)
      const validVarName = state.slug.replace(/-/g, '');
      componentContent = componentContent.replace(/const californiaFaqs/g, `const ${validVarName}Faqs`);
      componentContent = componentContent.replace(/{californiaFaqs\.map/g, `{${validVarName}Faqs.map`);

      // Also fix any existing hyphenated variable names
      const hyphenatedName = `${state.slug}Faqs`;
      componentContent = componentContent.replace(new RegExp(`const ${hyphenatedName}`, 'g'), `const ${validVarName}Faqs`);
      componentContent = componentContent.replace(new RegExp(`{${hyphenatedName}\\.map`, 'g'), `{${validVarName}Faqs.map`);
    }

    // Write the customized component
    fs.writeFileSync(destPath, componentContent);
  });

  // Generate state-specific page.tsx
  let statePageContent = californiaPageContent;

  // Remove CaliforniaCitiesSection import and usage BEFORE replacing California name
  statePageContent = statePageContent.replace(/import CaliforniaCitiesSection from '\.\/CaliforniaCitiesSection'\n?/g, '');
  statePageContent = statePageContent.replace(/import CaliforniaCitiesSection from "\.\/CaliforniaCitiesSection"\n?/g, '');
  statePageContent = statePageContent.replace(/<CaliforniaCitiesSection\s*\/>/g, '');

  // Replace California-specific geographic references BEFORE general replacement
  statePageContent = statePageContent.replace(
    /Silicon Valley tech startups<\/strong> to <strong className="text-slate-900">Los Angeles e-commerce brands<\/strong> and <strong className="text-slate-900">San Diego service providers/g,
    `${state.name} startups</strong> to <strong className="text-slate-900">${state.name} e-commerce brands</strong> and <strong className="text-slate-900">${state.name} service providers`
  );
  statePageContent = statePageContent.replace(/serving Silicon Valley and the competitive California tech market/g, `serving ${state.name} and the competitive ${state.name} market`);
  statePageContent = statePageContent.replace(/<span>Silicon Valley Expertise<\/span>/g, `<span>${state.name} Expertise</span>`);

  // Remove California-specific cities from structured data (multiline regex)
  statePageContent = statePageContent.replace(
    /"containsPlace": \[[\s\S]*?\{ "@type": "City", "name": "Sacramento" \}\s*\]/,
    ''
  );

  // Update the function name BEFORE replacing California (to avoid creating spaces)
  const functionName = state.name.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
  statePageContent = statePageContent.replace(
    'export default async function CaliforniaSEOWebsiteDevelopmentPage()',
    `export default async function ${functionName}SEOWebsiteDevelopmentPage()`
  );

  // Replace California with state name
  statePageContent = statePageContent.replace(/California/g, state.name);
  statePageContent = statePageContent.replace(/california/g, state.slug);

  // Write the page file
  const pageFilePath = path.join(stateDir, 'page.tsx');
  fs.writeFileSync(pageFilePath, statePageContent);

  console.log(`✓ Generated page for: ${state.name} (${index + 1}/${states.length})`);
});

console.log(`\n✅ Successfully generated ${states.length} state pages!`);
console.log('\nNext steps:');
console.log('1. Run: npm run build');
console.log('2. Update sitemap.xml/route.ts to include all state pages');
