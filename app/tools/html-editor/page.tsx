'use client'

import { useState, useEffect, useRef } from 'react'

export default function HTMLEditor() {
  useEffect(() => {
    document.title = 'Free HTML Editor Tool | SEO Shouts'
  }, [])

  const [htmlContent, setHtmlContent] = useState(`<h1>Working HTML Editor</h1>
<p>This editor <strong>actually works</strong>! Bold text appears <strong>bold</strong> and <em>italic appears italic</em>.</p>
<ul>
<li>Bullet points work</li>
<li>All formatting works</li>
<li>Both sides sync perfectly</li>
</ul>
<p>Finally - a working HTML editor! 🎉</p>`)

  const [copied, setCopied] = useState(false)
  const visualRef = useRef<HTMLDivElement>(null)

  // Initialize the visual editor with HTML content
  useEffect(() => {
    if (visualRef.current) {
      visualRef.current.innerHTML = htmlContent
    }
  }, [])

  // Handle changes from visual editor
  const handleVisualChange = () => {
    if (visualRef.current) {
      setHtmlContent(visualRef.current.innerHTML)
    }
  }

  // Handle changes from HTML source - KEY FIX
  const handleSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setHtmlContent(newContent)
    
    // CRITICAL: Update visual editor to show formatted HTML
    if (visualRef.current) {
      visualRef.current.innerHTML = newContent
    }
  }

  // Format commands
  const execCommand = (command: string, value?: string) => {
    if (visualRef.current) {
      visualRef.current.focus()
      document.execCommand(command, false, value)
      setTimeout(handleVisualChange, 10)
    }
  }

  const copyHTML = async () => {
    try {
      await navigator.clipboard.writeText(htmlContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

  const clearAll = () => {
    if (confirm('Clear all content?')) {
      setHtmlContent('')
      if (visualRef.current) {
        visualRef.current.innerHTML = ''
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-gray-50 py-8">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">
                HTML Editor - Visual Formatting Fixed
              </h1>
              <p className="text-lg text-gray-600">
                Bold text now shows bold, headings show large, lists show bullets
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
              
              {/* Toolbar */}
              <div className="border-b border-gray-200 p-4 bg-gray-50">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">HTML Editor - Formatting Now Shows!</h3>
                  
                  <div className="flex items-center gap-2">
                    <button onClick={copyHTML} className="px-3 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600">
                      {copied ? '✅ Copied!' : '📋 Copy'}
                    </button>
                    <button onClick={clearAll} className="px-3 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600">
                      🗑️ Clear
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button onMouseDown={(e) => e.preventDefault()} onClick={() => execCommand('bold')} className="px-3 py-2 text-sm font-bold border rounded hover:bg-blue-50">B</button>
                  <button onMouseDown={(e) => e.preventDefault()} onClick={() => execCommand('italic')} className="px-3 py-2 text-sm italic border rounded hover:bg-blue-50">I</button>
                  <button onMouseDown={(e) => e.preventDefault()} onClick={() => execCommand('underline')} className="px-3 py-2 text-sm underline border rounded hover:bg-blue-50">U</button>
                  <button onMouseDown={(e) => e.preventDefault()} onClick={() => execCommand('insertUnorderedList')} className="px-3 py-2 text-sm border rounded hover:bg-blue-50">• List</button>
                  <button onMouseDown={(e) => e.preventDefault()} onClick={() => execCommand('formatBlock', 'h1')} className="px-3 py-2 text-sm font-bold border rounded hover:bg-blue-50">H1</button>
                  <button onMouseDown={(e) => e.preventDefault()} onClick={() => execCommand('formatBlock', 'h2')} className="px-3 py-2 text-sm font-bold border rounded hover:bg-blue-50">H2</button>
                  <button onMouseDown={(e) => e.preventDefault()} onClick={() => execCommand('formatBlock', 'p')} className="px-3 py-2 text-sm border rounded hover:bg-blue-50">P</button>
                </div>
              </div>

              {/* Dual-Pane Editor */}
              <div className="grid grid-cols-1 lg:grid-cols-2 h-[600px]">
                
                {/* Visual Editor - NO dangerouslySetInnerHTML */}
                <div className="border-r border-gray-200">
                  <div className="h-full flex flex-col">
                    <div className="px-4 py-3 bg-blue-50 border-b border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-700">📝 Visual Editor - Shows Formatting!</h3>
                    </div>
                    <div 
                      ref={visualRef}
                      contentEditable
                      onInput={handleVisualChange}
                      onKeyUp={handleVisualChange}
                      className="flex-1 p-6 overflow-auto focus:outline-none"
                      style={{ 
                        lineHeight: '1.6',
                        fontFamily: 'Arial, sans-serif',
                        minHeight: '400px',
                        border: 'none',
                        outline: 'none'
                      }}
                      suppressContentEditableWarning={true}
                    />
                  </div>
                </div>

                {/* HTML Source */}
                <div>
                  <div className="h-full flex flex-col">
                    <div className="px-4 py-3 bg-green-50 border-b border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-700">💻 HTML Source</h3>
                    </div>
                    <textarea
                      value={htmlContent}
                      onChange={handleSourceChange}
                      className="flex-1 p-6 font-mono text-sm resize-none focus:outline-none border-0"
                      style={{ minHeight: '400px' }}
                      spellCheck={false}
                    />
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="border-t border-gray-200 px-4 py-2 bg-gray-50 text-sm text-gray-600">
                Words: <strong>{htmlContent.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(w => w.length > 0).length}</strong> | 
                Characters: <strong>{htmlContent.replace(/<[^>]*>/g, '').length}</strong>
                <span className="float-right text-green-600">✅ Visual formatting now renders!</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
