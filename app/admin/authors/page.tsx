'use client';

import { useState, useEffect } from 'react';
import AdminNav from '@/app/components/AdminNav';
import ImageUpload from '@/app/components/ImageUpload';

interface CareerHighlight {
  title: string;
  company: string;
  duration: string;
  description?: string;
}

interface Author {
  id: number;
  name: string;
  email: string;
  bio?: string;
  avatar_url?: string;
  avatar_alt_text?: string;
  job_title?: string;
  location?: string;
  phone?: string;
  linkedin_url?: string;
  twitter_url?: string;
  website_url?: string;
  company?: string;
  expertise?: string[];
  career_highlights?: CareerHighlight[];
  education?: string;
  meta_title?: string;
  meta_description?: string;
  custom_schema?: string;
  seo_noindex?: boolean;
  seo_nofollow?: boolean;
  created_at: string;
  updated_at: string;
  article_count?: number;
  published_article_count?: number;
}

export default function AuthorsManagement() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    email: '',
    bio: '',
    avatar_url: '',
    avatar_alt_text: '',
    job_title: '',
    location: '',
    phone: '',
    linkedin_url: '',
    twitter_url: '',
    website_url: '',
    company: '',
    expertise: [] as string[],
    career_highlights: [] as CareerHighlight[],
    education: '',
    meta_title: '',
    meta_description: '',
    custom_schema: '',
    seo_noindex: false,
    seo_nofollow: false
  });
  
  const [expertiseInput, setExpertiseInput] = useState('');

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/authors/');
      const data = await response.json();
      
      if (data.success) {
        setAuthors(data.data);
      } else {
        setError('Failed to fetch authors');
      }
    } catch (error) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const addExpertise = () => {
    if (expertiseInput.trim() && !formData.expertise.includes(expertiseInput.trim())) {
      setFormData(prev => ({
        ...prev,
        expertise: [...prev.expertise, expertiseInput.trim()]
      }));
      setExpertiseInput('');
    }
  };

  const removeExpertise = (index: number) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.filter((_, i) => i !== index)
    }));
  };

  const addCareerHighlight = () => {
    setFormData(prev => ({
      ...prev,
      career_highlights: [...prev.career_highlights, { title: '', company: '', duration: '', description: '' }]
    }));
  };

  const updateCareerHighlight = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      career_highlights: prev.career_highlights.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeCareerHighlight = (index: number) => {
    setFormData(prev => ({
      ...prev,
      career_highlights: prev.career_highlights.filter((_, i) => i !== index)
    }));
  };

  const openModal = (author: Author | null = null) => {
    setEditingAuthor(author);
    setActiveTab('basic');
    
    if (author) {
      // Parse JSON fields
      const expertise = author.expertise ? (typeof author.expertise === 'string' ? JSON.parse(author.expertise) : author.expertise) : [];
      const career_highlights = author.career_highlights ? (typeof author.career_highlights === 'string' ? JSON.parse(author.career_highlights) : author.career_highlights) : [];
      
      setFormData({
        name: author.name || '',
        slug: author.slug || '',
        email: author.email || '',
        bio: author.bio || '',
        avatar_url: author.avatar_url || '',
        avatar_alt_text: author.avatar_alt_text || '',
        job_title: author.job_title || '',
        location: author.location || '',
        phone: author.phone || '',
        linkedin_url: author.linkedin_url || '',
        twitter_url: author.twitter_url || '',
        website_url: author.website_url || '',
        company: author.company || '',
        expertise: expertise,
        career_highlights: career_highlights,
        education: author.education || '',
        meta_title: author.meta_title || '',
        meta_description: author.meta_description || '',
        custom_schema: author.custom_schema || '',
        seo_noindex: author.seo_noindex || false,
        seo_nofollow: author.seo_nofollow || false
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        email: '',
        bio: '',
        avatar_url: '',
        avatar_alt_text: '',
        job_title: '',
        location: '',
        phone: '',
        linkedin_url: '',
        twitter_url: '',
        website_url: '',
        company: '',
        expertise: [],
        career_highlights: [],
        education: '',
        meta_title: '',
        meta_description: '',
        custom_schema: '',
        seo_noindex: false,
        seo_nofollow: false
      });
    }
    
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingAuthor(null);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        expertise: Array.isArray(formData.expertise) ? JSON.stringify(formData.expertise) : formData.expertise,
        career_highlights: Array.isArray(formData.career_highlights) ? JSON.stringify(formData.career_highlights) : formData.career_highlights,
      };

      const url = editingAuthor 
        ? `/api/admin/authors/${editingAuthor.id}/`
        : '/api/admin/authors/';
      
      const method = editingAuthor ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setSuccess(editingAuthor ? 'Author updated successfully!' : 'Author created successfully!');
        await fetchAuthors();
        setTimeout(() => closeModal(), 1500);
      } else {
        setError(data.error || 'Operation failed');
      }
    } catch (error) {
      console.error('Author submission error:', error);
      if (error instanceof Error) {
        setError(`Network error: ${error.message}`);
      } else {
        setError('Network error occurred');
      }
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (authorId: number) => {
    if (!confirm('Are you sure you want to delete this author?')) return;

    try {
      const response = await fetch(`/api/admin/authors/${authorId}/`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Author deleted successfully!');
        fetchAuthors();
      } else {
        setError(data.error || 'Failed to delete author');
      }
    } catch (error) {
      setError('Network error occurred');
    }
  };

  const TabButton = ({ tabKey, label, active, onClick }: { tabKey: string; label: string; active: boolean; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
        active 
          ? 'bg-blue-100 text-blue-700 border border-blue-200' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Authors Management</h1>
          <p className="mt-2 text-gray-600">Manage author profiles and information</p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {/* Actions */}
        <div className="mb-6">
          <button
            onClick={() => openModal()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Add New Author
          </button>
        </div>

        {/* Authors List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Articles</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SEO</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {authors.map((author) => (
                  <tr key={author.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {author.avatar_url ? (
                            <img 
                              className="h-10 w-10 rounded-full object-cover"
                              src={author.avatar_url}
                              alt={author.avatar_alt_text || author.name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-medium">
                                {author.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{author.name}</div>
                          {author.job_title && (
                            <div className="text-sm text-gray-500">{author.job_title}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{author.email}</div>
                      {author.location && (
                        <div className="text-sm text-gray-500">{author.location}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="text-blue-600 font-medium">{author.published_article_count || 0}</span> published
                      <br />
                      <span className="text-gray-400">{author.article_count || 0}</span> total
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        {author.seo_noindex && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            No Index
                          </span>
                        )}
                        {author.seo_nofollow && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            No Follow
                          </span>
                        )}
                        {!author.seo_noindex && !author.seo_nofollow && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Indexed
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openModal(author)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(author.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                        <a
                          href={`/authors/${author.slug || author.name.toLowerCase().replace(/\s+/g, '-')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-900"
                        >
                          View
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {authors.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No authors found.</p>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleSubmit}>
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {editingAuthor ? 'Edit Author' : 'Add New Author'}
                    </h2>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>

                  {/* Tabs */}
                  <div className="mt-4 flex space-x-1 bg-gray-100 p-1 rounded-lg">
                    <TabButton tabKey="basic" label="Basic Info" active={activeTab === 'basic'} onClick={() => setActiveTab('basic')} />
                    <TabButton tabKey="professional" label="Professional" active={activeTab === 'professional'} onClick={() => setActiveTab('professional')} />
                    <TabButton tabKey="social" label="Social & Contact" active={activeTab === 'social'} onClick={() => setActiveTab('social')} />
                    <TabButton tabKey="seo" label="SEO & Meta" active={activeTab === 'seo'} onClick={() => setActiveTab('seo')} />
                  </div>
                </div>

                {/* Modal Body */}
                <div className="px-6 py-4">
                  {/* Alert Messages */}
                  {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                      {success}
                    </div>
                  )}

                  {/* Basic Info Tab */}
                  {activeTab === 'basic' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Page Slug (URL)
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.slug}
                            onChange={(e) => handleInputChange('slug', e.target.value)}
                            placeholder="author-url-slug"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Leave empty to auto-generate from name. This will be used in the author page URL.
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          About/Bio
                        </label>
                        <textarea
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={formData.bio}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                          placeholder="Write about the author..."
                        />
                      </div>

                      <div>
                        <ImageUpload
                          onImageUploaded={(imageUrl) => handleInputChange('avatar_url', imageUrl)}
                          currentImage={formData.avatar_url}
                          label="Avatar Image"
                          placeholder="https://example.com/avatar.jpg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Avatar Alt Text
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={formData.avatar_alt_text}
                          onChange={(e) => handleInputChange('avatar_alt_text', e.target.value)}
                          placeholder="Describe the avatar image for accessibility"
                        />
                      </div>
                    </div>
                  )}

                  {/* Professional Tab */}
                  {activeTab === 'professional' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Job Title
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.job_title}
                            onChange={(e) => handleInputChange('job_title', e.target.value)}
                            placeholder="SEO Specialist, Marketing Director, etc."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.company}
                            onChange={(e) => handleInputChange('company', e.target.value)}
                            placeholder="Company name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Location
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.location}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                            placeholder="City, Country"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Education
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.education}
                            onChange={(e) => handleInputChange('education', e.target.value)}
                            placeholder="Educational background"
                          />
                        </div>
                      </div>

                      {/* Areas of Expertise */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Areas of Expertise
                        </label>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={expertiseInput}
                            onChange={(e) => setExpertiseInput(e.target.value)}
                            placeholder="Add expertise area"
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addExpertise())}
                          />
                          <button
                            type="button"
                            onClick={addExpertise}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.expertise.map((skill, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                            >
                              {skill}
                              <button
                                type="button"
                                onClick={() => removeExpertise(index)}
                                className="ml-2 text-blue-600 hover:text-blue-900"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Career Highlights */}
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <label className="block text-sm font-medium text-gray-700">
                            Career Highlights
                          </label>
                          <button
                            type="button"
                            onClick={addCareerHighlight}
                            className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                          >
                            Add Highlight
                          </button>
                        </div>
                        
                        <div className="space-y-4">
                          {formData.career_highlights.map((highlight, index) => (
                            <div key={index} className="p-4 border border-gray-200 rounded-lg">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <input
                                  type="text"
                                  placeholder="Job Title"
                                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  value={highlight.title}
                                  onChange={(e) => updateCareerHighlight(index, 'title', e.target.value)}
                                />
                                <input
                                  type="text"
                                  placeholder="Company"
                                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  value={highlight.company}
                                  onChange={(e) => updateCareerHighlight(index, 'company', e.target.value)}
                                />
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <input
                                  type="text"
                                  placeholder="Duration (e.g., 2020-2023)"
                                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  value={highlight.duration}
                                  onChange={(e) => updateCareerHighlight(index, 'duration', e.target.value)}
                                />
                                <button
                                  type="button"
                                  onClick={() => removeCareerHighlight(index)}
                                  className="px-3 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50"
                                >
                                  Remove
                                </button>
                              </div>
                              <textarea
                                rows={2}
                                placeholder="Description (optional)"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={highlight.description || ''}
                                onChange={(e) => updateCareerHighlight(index, 'description', e.target.value)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Social & Contact Tab */}
                  {activeTab === 'social' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone
                          </label>
                          <input
                            type="tel"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Website URL
                          </label>
                          <input
                            type="url"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.website_url}
                            onChange={(e) => handleInputChange('website_url', e.target.value)}
                            placeholder="https://example.com"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            LinkedIn URL
                          </label>
                          <input
                            type="url"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.linkedin_url}
                            onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                            placeholder="https://linkedin.com/in/username"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Twitter/X URL
                          </label>
                          <input
                            type="url"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.twitter_url}
                            onChange={(e) => handleInputChange('twitter_url', e.target.value)}
                            placeholder="https://x.com/username"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SEO & Meta Tab */}
                  {activeTab === 'seo' && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Meta Title
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={formData.meta_title}
                          onChange={(e) => handleInputChange('meta_title', e.target.value)}
                          placeholder="Custom meta title for this author page"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Meta Description
                        </label>
                        <textarea
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={formData.meta_description}
                          onChange={(e) => handleInputChange('meta_description', e.target.value)}
                          placeholder="Custom meta description for this author page"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              checked={formData.seo_noindex}
                              onChange={(e) => handleInputChange('seo_noindex', e.target.checked)}
                            />
                            <span className="text-sm font-medium text-gray-700">No Index</span>
                          </label>
                          <p className="text-xs text-gray-500 mt-1">Prevent search engines from indexing this author page</p>
                        </div>

                        <div>
                          <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              checked={formData.seo_nofollow}
                              onChange={(e) => handleInputChange('seo_nofollow', e.target.checked)}
                            />
                            <span className="text-sm font-medium text-gray-700">No Follow</span>
                          </label>
                          <p className="text-xs text-gray-500 mt-1">Prevent search engines from following links on this page</p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Custom Schema (JSON-LD)
                        </label>
                        <textarea
                          rows={6}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                          value={formData.custom_schema}
                          onChange={(e) => handleInputChange('custom_schema', e.target.value)}
                          placeholder='{"@context": "https://schema.org", "@type": "Person", ...}'
                        />
                        <p className="text-xs text-gray-500 mt-1">Add custom structured data for this author (JSON-LD format)</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3 sticky bottom-0 bg-white">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={modalLoading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {modalLoading ? 'Saving...' : (editingAuthor ? 'Update Author' : 'Create Author')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}