'use client';

import { useState, useEffect } from 'react';
import AdminNav from '@/app/components/AdminNav';

interface Redirection {
  id: number;
  from_path: string;
  to_path: string;
  status_code: number;
  created_at: string;
  updated_at: string;
}

export default function RedirectionsManagement() {
  const [redirections, setRedirections] = useState<Redirection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingRedirection, setEditingRedirection] = useState<Redirection | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    from_path: '',
    to_path: '',
    status_code: '301'
  });

  useEffect(() => {
    fetchRedirections();
  }, []);

  const fetchRedirections = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/redirections/');
      const data = await response.json();
      
      if (data.success) {
        setRedirections(data.data.redirections || []);
      } else {
        setError('Failed to fetch redirections');
      }
    } catch (error) {
      console.error('Error fetching redirections:', error);
      setError('Network error occurred');
      setRedirections([]); // Ensure redirections is always an array
    } finally {
      setLoading(false);
    }
  };

  const openModal = (redirection?: Redirection) => {
    if (redirection) {
      setEditingRedirection(redirection);
      setFormData({
        from_path: redirection.from_path,
        to_path: redirection.to_path,
        status_code: redirection.status_code.toString()
      });
    } else {
      setEditingRedirection(null);
      setFormData({
        from_path: '',
        to_path: '',
        status_code: '301'
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingRedirection(null);
    setFormData({
      from_path: '',
      to_path: '',
      status_code: '301'
    });
    setError('');
    setSuccess('');
  };

  const validatePaths = () => {
    if (!formData.from_path.startsWith('/')) {
      setError('From path must start with /');
      return false;
    }
    
    if (!formData.to_path.startsWith('/') && !formData.to_path.startsWith('http')) {
      setError('To path must start with / or be a full URL (http/https)');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePaths()) {
      return;
    }

    setModalLoading(true);
    setError('');
    setSuccess('');

    try {
      const url = editingRedirection 
        ? `/api/admin/redirections/${editingRedirection.id}/`
        : '/api/admin/redirections/';
      
      const method = editingRedirection ? 'PUT' : 'POST';
      
      const payload = {
        ...formData,
        status_code: parseInt(formData.status_code)
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`Redirection ${editingRedirection ? 'updated' : 'created'} successfully!`);
        await fetchRedirections();
        setTimeout(() => {
          closeModal();
        }, 1500);
      } else {
        setError(data.error || `Failed to ${editingRedirection ? 'update' : 'create'} redirection`);
      }
    } catch (error) {
      setError('Network error occurred');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (redirection: Redirection) => {
    if (!confirm(`Are you sure you want to delete the redirection from "${redirection.from_path}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/redirections/${redirection.id}/`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Redirection deleted successfully!');
        await fetchRedirections();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to delete redirection');
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      setError('Network error occurred');
      setTimeout(() => setError(''), 3000);
    }
  };

  const getStatusCodeColor = (code: number) => {
    switch (code) {
      case 301:
        return 'bg-green-100 text-green-800';
      case 302:
        return 'bg-yellow-100 text-yellow-800';
      case 307:
        return 'bg-blue-100 text-blue-800';
      case 308:
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusCodeDescription = (code: number) => {
    switch (code) {
      case 301:
        return 'Permanent Redirect';
      case 302:
        return 'Temporary Redirect';
      case 307:
        return 'Temporary Redirect (Method Preserved)';
      case 308:
        return 'Permanent Redirect (Method Preserved)';
      default:
        return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading redirections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Redirections</h1>
              <p className="mt-2 text-sm text-gray-600">
                Create and manage URL redirections for SEO and user experience
              </p>
            </div>
            <button
              onClick={() => openModal()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add New Redirection
            </button>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-md bg-green-50 p-4">
            <div className="text-sm text-green-700">{success}</div>
          </div>
        )}

        {/* Info Box */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <svg className="flex-shrink-0 h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">About Redirections</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>• <strong>301:</strong> Permanent redirect (transfers SEO value)</p>
                <p>• <strong>302:</strong> Temporary redirect (doesn't transfer SEO value)</p>
                <p>• Use redirections to handle moved pages, fix broken links, and improve SEO</p>
              </div>
            </div>
          </div>
        </div>

        {/* Redirections List */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    From Path
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    To Path
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {redirections.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No redirections found. Create your first redirection to get started.
                    </td>
                  </tr>
                ) : (
                  redirections.map((redirection) => (
                    <tr key={redirection.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-gray-900">
                          {redirection.from_path}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-mono text-gray-900 max-w-md truncate">
                          {redirection.to_path}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusCodeColor(redirection.status_code)}`}>
                          {redirection.status_code}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          {getStatusCodeDescription(redirection.status_code)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(redirection.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => openModal(redirection)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(redirection)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingRedirection ? 'Edit Redirection' : 'Add New Redirection'}
                </h3>
                
                {/* Modal Messages */}
                {error && (
                  <div className="mb-4 rounded-md bg-red-50 p-3">
                    <div className="text-sm text-red-700">{error}</div>
                  </div>
                )}

                {success && (
                  <div className="mb-4 rounded-md bg-green-50 p-3">
                    <div className="text-sm text-green-700">{success}</div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      From Path *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      value={formData.from_path}
                      onChange={(e) => setFormData(prev => ({ ...prev, from_path: e.target.value }))}
                      placeholder="/old-page"
                    />
                    <p className="mt-1 text-xs text-gray-500">Must start with /</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      To Path *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      value={formData.to_path}
                      onChange={(e) => setFormData(prev => ({ ...prev, to_path: e.target.value }))}
                      placeholder="/new-page or https://external.com"
                    />
                    <p className="mt-1 text-xs text-gray-500">Start with / or full URL</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status Code *
                    </label>
                    <select
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.status_code}
                      onChange={(e) => setFormData(prev => ({ ...prev, status_code: e.target.value }))}
                    >
                      <option value="301">301 - Permanent Redirect</option>
                      <option value="302">302 - Temporary Redirect</option>
                      <option value="307">307 - Temporary Redirect (Method Preserved)</option>
                      <option value="308">308 - Permanent Redirect (Method Preserved)</option>
                    </select>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={modalLoading}
                      className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {modalLoading ? 'Saving...' : (editingRedirection ? 'Update' : 'Create')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}