'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function HTMLEditor() {
  useEffect(() => {
    document.title = 'Free HTML Editor Tool | SEO Shouts';
  }, []);

  // ---------------- State & Refs ----------------
  const [htmlContent, setHtmlContent] = useState<string>(`<h1>Welcome To The Best Online HTML Web Editor!</h1>
<p>You can <strong>type your text</strong> directly in the editor or paste it from a Word Doc, PDF, Excel etc.</p>
<p>The <strong>visual editor</strong> on the right and the <strong>source editor</strong> on the left are linked together and the changes are reflected in the other one as you type! 😊</p>
<table>
  <thead><tr><th>Name</th><th>City</th><th>Age</th></tr></thead>
  <tbody><tr><td>John</td><td>Chicago</td><td>23</td></tr>
  <tr><td>Lucy</td><td>Wisconsin</td><td>19</td></tr>
  <tr><td>Amanda</td><td>Madison</td><td>22</td></tr></tbody>
</table>
<p>This is a table you can experiment with.</p>`);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [importing, setImporting] = useState(false);
  const [sourceUndoStack, setSourceUndoStack] = useState<string[]>([]);
  const [sourceRedoStack, setSourceRedoStack] = useState<string[]>([]);
  const [sourceFontSize, setSourceFontSize] = useState<number>(14); // full source editor font size

  // Emoji picker state
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [emojiPos, setEmojiPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const visualRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiBtnRef = useRef<HTMLButtonElement>(null);
  const emojiPopoverRef = useRef<HTMLDivElement>(null);

  const LS_KEY = 'html-editor-content';

  // ---------------- Emoji list (large set) ----------------
  const EMOJI: string[] = [
    '😀','😃','😄','😁','😆','😅','😂','🤣','😊','🙂','🙃','😉','😌','😍','🥰','😘','😗','😙','😚',
    '😋','😛','😝','😜','🤪','🤨','🧐','🤓','😎','🥳','🤩','😏','😒','🙄','😬','🤥','😳','😞','😟',
    '😠','😡','🤬','😔','😕','🙁','☹️','😣','😖','😫','😩','🥺','😢','😭','😤','😮‍💨','😮','😯','😲',
    '😴','🤤','😪','😵','🤯','🤕','🤒','🤧','😷','🤮','🤢','🥶','🥵',
    '👍','👎','👏','🙌','🙏','👌','✌️','🤞','🤟','🤘','👋','✋','🤚','🖐️','🖖','👊','🤛','🤜',
    '❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💖','💗','💓','💞','💕','💘','💝',
  ];

  // ---------- Helpers ----------
  const normalizeNBSP = (html: string) => html.replace(/&nbsp;|\u00A0/g, ' ');

  // Close emoji picker on outside click / ESC
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (emojiOpen && !emojiPopoverRef.current?.contains(t) && !emojiBtnRef.current?.contains(t)) {
        setEmojiOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && setEmojiOpen(false);
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [emojiOpen]);

  // When opening, position popover near button and clamp within viewport
  useEffect(() => {
    if (!emojiOpen || !emojiBtnRef.current) return;
    const r = emojiBtnRef.current.getBoundingClientRect();
    let left = r.left;
    let top = r.bottom + 8;

    setTimeout(() => {
      const pop = emojiPopoverRef.current;
      if (!pop) return;
      const pad = 8;
      const w = pop.offsetWidth;
      const h = pop.offsetHeight;
      left = Math.min(Math.max(pad, left), window.innerWidth - w - pad);
      top = Math.min(Math.max(pad, top), window.innerHeight - h - pad);
      setEmojiPos({ left, top });
    }, 0);
  }, [emojiOpen]);

  // ---------------- Sanitizer (template-based) ----------------
  const ALLOWED_TAGS = new Set([
    'P','BR','STRONG','EM','U','S','B','I',
    'H1','H2','H3','H4','H5','H6',
    'UL','OL','LI','A','BLOCKQUOTE',
    'PRE','CODE','IMG','HR','TABLE',
    'THEAD','TBODY','TR','TH','TD','SPAN'
  ]);
  const ALLOWED_ATTRS: Record<string, Set<string>> = {
    A: new Set(['href','title','target','rel']),
    IMG: new Set(['src','alt']),
    SPAN: new Set([]), // Allow span but remove all attributes
  };

  const sanitizeHTML = (dirty: string): string => {
    if (!dirty) return '';
    dirty = normalizeNBSP(dirty); // normalize early
    const tpl = document.createElement('template');
    tpl.innerHTML = dirty;

    const unwrap = (el: Element) => {
      const parent = el.parentNode;
      if (!parent) return;
      while (el.firstChild) parent.insertBefore(el.firstChild, el);
      parent.removeChild(el);
    };

    const walk = (node: Node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        const tag = el.tagName;

        if (tag === 'SCRIPT' || tag === 'STYLE') {
          el.remove();
          return;
        }
        if (!ALLOWED_TAGS.has(tag)) {
          unwrap(el);
        } else {
          const allowed = ALLOWED_ATTRS[tag] ?? new Set<string>();
          [...el.attributes].forEach(attr => {
            const name = attr.name;
            const lower = name.toLowerCase();
            if (lower.startsWith('on')) el.removeAttribute(name);
            else if (!allowed.has(name.toUpperCase())) el.removeAttribute(name);
          });
          
          // Remove all style attributes and classes for cleaning
          el.removeAttribute('style');
          el.removeAttribute('class');
          el.removeAttribute('id');
          
          if (tag === 'A') {
            const a = el as HTMLAnchorElement;
            const href = a.getAttribute('href') || '';
            if (href.trim().toLowerCase().startsWith('javascript:')) a.removeAttribute('href');
            if (a.getAttribute('target') === '_blank') a.setAttribute('rel','noopener nofollow');
            else a.setAttribute('rel','nofollow');
          }
        }
      }
      let child = node.firstChild;
      while (child) { const next = child.nextSibling; walk(child); child = next; }
    };

    Array.from(tpl.content.childNodes).forEach(walk);
    return tpl.innerHTML;
  };

  // -------- DOM-based pretty print (inline-on-one-line + preserve spaces) --------
  const BLOCKS = new Set([
    'html','head','body',
    'div','section','article','aside','header','footer','main','nav',
    'p','h1','h2','h3','h4','h5','h6','hr','blockquote',
    'ul','ol','li',
    'table','thead','tbody','tfoot','tr','th','td',
    'pre'
  ]);
  const INLINE = new Set([
    'a','span','strong','em','u','s','b','i','small','mark',
    'sup','sub','code','kbd','samp','q','abbr','cite','data','time','var'
  ]);
  const VOIDS = new Set(['br','hr','img','input','meta','link','source','wbr']);

  const escapeAttr = (v: string) => v.replace(/"/g, '&quot;');
  const openTag = (el: Element) => {
    const tag = el.tagName.toLowerCase();
    const attrs = [...el.attributes].map(a => ` ${a.name}="${escapeAttr(a.value)}"`).join('');
    return `<${tag}${attrs}>`;
  };
  const closeTag = (el: Element) => `</${el.tagName.toLowerCase()}>`;

  const isBlockTag = (tag: string) => BLOCKS.has(tag);
  const isInlineTag = (tag: string) => INLINE.has(tag) || (!isBlockTag(tag) && !VOIDS.has(tag));

  // if only inline/text/void children => can render single line
  const canInlineRender = (el: Element): boolean =>
    Array.from(el.childNodes).every(n => {
      if (n.nodeType === Node.TEXT_NODE) return true;
      if (n.nodeType === Node.ELEMENT_NODE) {
        const t = (n as Element).tagName.toLowerCase();
        return isInlineTag(t) || VOIDS.has(t);
      }
      return true;
    });

  // preserve spaces around inline boundaries (collapses sequences but keeps leading/trailing)
  const preserveInlineSpaces = (s: string) => {
    const hadLead = /^\s/.test(s);
    const hadTrail = /\s$/.test(s);
    let x = s.replace(/\s+/g, ' ');
    if (hadLead && !x.startsWith(' ')) x = ' ' + x;
    if (hadTrail && !x.endsWith(' ')) x = x + ' ';
    return x;
  };

  const domPretty = (html: string): string => {
    html = normalizeNBSP(html); // normalize early
    const tpl = document.createElement('template');
    tpl.innerHTML = html;

    const renderInlineChildren = (el: Element, inPre: boolean) =>
      Array.from(el.childNodes)
        .map((c) => {
          if (c.nodeType === Node.TEXT_NODE) {
            const raw = (c.nodeValue || '');
            if (inPre) return raw;
            return preserveInlineSpaces(raw);
          }
          if (c.nodeType === Node.ELEMENT_NODE) {
            // inline child
            const child = c as Element;
            const tag = child.tagName.toLowerCase();
            if (!isBlockTag(tag)) {
              const inside = renderInlineChildren(child, inPre || tag === 'pre').replace(/\n/g, '');
              return `${openTag(child)}${inside}${closeTag(child)}`;
            }
            // should not happen when we call from canInlineRender(), but keep safe
            return walk(child, 0, inPre).replace(/\n/g, '');
          }
          return '';
        })
        .join('');

    const walk = (node: Node, depth: number, inPre: boolean): string => {
      const pad = '  '.repeat(depth);

      if (node.nodeType === Node.TEXT_NODE) {
        const raw = node.nodeValue || '';
        if (inPre) return raw;
        // for block context, collapse but keep a single space if present
        const x = preserveInlineSpaces(raw);
        if (!x.trim()) return '';
        return `${pad}${x.trim()}\n`;
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as Element;
        const tag = el.tagName.toLowerCase();

        if (VOIDS.has(tag)) return `${pad}${openTag(el)}\n`;
        if (tag === 'pre') return `${pad}${openTag(el)}${el.innerHTML}${closeTag(el)}\n`;

        // inline element
        if (!isBlockTag(tag)) {
          const children = renderInlineChildren(el, inPre).replace(/\n/g, '');
          return `${openTag(el)}${children}${closeTag(el)}`;
        }

        // block element that can be one-liner
        if (canInlineRender(el)) {
          const inner = renderInlineChildren(el, inPre).trim();
          return `${pad}${openTag(el)}${inner}${closeTag(el)}\n`;
        }

        // block element with block children
        const inner = Array.from(el.childNodes).map(c => walk(c, depth + 1, inPre)).join('');
        return `${pad}${openTag(el)}\n${inner}${pad}${closeTag(el)}\n`;
      }

      // DocumentFragment etc.
      return Array.from((node as any).childNodes || []).map(c => walk(c, depth, inPre)).join('');
    };

    let out = walk(tpl.content, 0, false);
    // Clean up excessive newlines and remove any unwanted <br> tags that might have been added
    out = out.replace(/\n{3,}/g, '\n\n').trim();
    // Remove any standalone <br> tags that might cause formatting issues
    out = out.replace(/<br\s*\/?>\s*\n?/gi, '');
    out = out.replace(/\n\s*<br\s*\/?>/gi, '');
    // Final cleanup of any remaining br tags in the formatted output
    out = out.replace(/<br\s*\/?>/gi, '');
    return out;
  };

  // ---------------- Sync & Autosave ----------------
  const setBoth = (html: string) => {
    const normalized = normalizeNBSP(html);
    setHtmlContent(normalized);
    if (visualRef.current) visualRef.current.innerHTML = normalized;
  };

  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    const initial = saved && saved.trim() ? saved : htmlContent;
    const normalized = normalizeNBSP(initial);
    if (visualRef.current) visualRef.current.innerHTML = normalized;
    setHtmlContent(normalized);
    setSourceUndoStack([normalized]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem(LS_KEY, htmlContent);
  }, [htmlContent]);

  // Visual -> Source
  const handleVisualChange = () => {
    if (visualRef.current) {
      let raw = visualRef.current.innerHTML;
      
      // Clean up common contentEditable artifacts (but preserve br tags for normal editing)
      raw = raw
        // Remove empty paragraphs that contentEditable might create
        .replace(/<p><br><\/p>/gi, '<p></p>')
        .replace(/<p>\s*<\/p>/gi, '<p></p>')
        // Fix double line breaks but keep single ones for normal editing
        .replace(/(<br\s*\/?>){2,}/gi, '<br>')
        // Clean up excessive whitespace
        .replace(/\s+/g, ' ')
        .trim();
      
      const next = normalizeNBSP(raw);
      setHtmlContent(next);
      pushUndo(next);
    }
  };

  // Source -> Visual
  const handleSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = e.target.value;
    setBoth(next);
    pushUndo(next);
  };

  // ---------------- Visual Editor: Commands ----------------
  const exec = (cmd: string, value?: string) => {
    if (!visualRef.current) return;
    visualRef.current.focus();
    document.execCommand(cmd, false, value);
    setTimeout(handleVisualChange, 10);
  };

  const makeBlock = (tag: 'P' | 'H1' | 'H2' | 'H3' | 'H4' | 'BLOCKQUOTE') => exec('formatBlock', tag);
  const makeLink = () => {
    const url = prompt('Enter URL (https://...)');
    if (!url) return;
    exec('createLink', url);
    setTimeout(() => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const a = sel.anchorNode?.parentElement?.closest('a');
      if (a) {
        if (a.getAttribute('target') === '_blank') a.setAttribute('rel','noopener nofollow');
        else a.setAttribute('rel','nofollow');
      }
    }, 10);
  };
  const removeLink = () => exec('unlink');

  const insertImage = () => {
    const src = prompt('Image URL (https://...)');
    if (!src) return;
    const alt = prompt('Alt text (optional)') || '';
    document.execCommand('insertHTML', false, `<img src="${src}" alt="${alt}">`);
    setTimeout(handleVisualChange, 10);
  };

  const insertCodeBlock = () => {
    const sel = getSelectionHTML() || '/* your code here */';
    document.execCommand('insertHTML', false, `<pre><code>${sel}</code></pre>`);
    setTimeout(handleVisualChange, 10);
  };

  const insertHR = () => exec('insertHorizontalRule');

  const insertTable = () => {
    const rows = Math.max(1, Number(prompt('Rows?', '3') || 3));
    const cols = Math.max(1, Number(prompt('Columns?', '3') || 3));
    let html = '<table><tbody>';
    for (let r = 0; r < rows; r++) {
      html += '<tr>';
      for (let c = 0; c < cols; c++) html += `<td>${r === 0 ? `<strong>Cell ${c + 1}</strong>` : `Cell ${c + 1}`}</td>`;
      html += '</tr>';
    }
    html += '</tbody></table>';
    document.execCommand('insertHTML', false, html);
    setTimeout(handleVisualChange, 10);
  };

  const getSelectionHTML = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return '';
    const container = document.createElement('div');
    for (let i = 0; i < sel.rangeCount; i++) container.appendChild(sel.getRangeAt(i).cloneContents());
    return container.innerHTML;
  };

  // Colors & font size in visual editor
  const applyForeColor = (color: string) => exec('foreColor', color);
  const applyBackColor = (color: string) => exec('hiliteColor', color);
  const fontSizeStep = (delta: 1 | -1) => {
    const size = delta === 1 ? '1.125rem' : '0.875rem';
    document.execCommand('insertHTML', false, `<span style="font-size:${size}">${getSelectionHTML() || 'text'}</span>`);
    setTimeout(handleVisualChange, 10);
  };

  // Formats dropdown handler
  const handleFormatsChange = (value: string) => {
    if (!value) return;
    if (value.startsWith('COLOR:')) {
      const c = value.split(':')[1];
      applyForeColor(c);
    } else if (value === 'BLOCKQUOTE') {
      makeBlock('BLOCKQUOTE');
    } else if (['H1','H2','H3','H4','P'].includes(value)) {
      makeBlock(value as any);
    }
  };

  // Keyboard shortcuts for visual editor
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const isMac = navigator.platform.toUpperCase().includes('MAC');
    const mod = isMac ? e.metaKey : e.ctrlKey;
    if (mod) {
      if (e.key.toLowerCase() === 'b') { e.preventDefault(); exec('bold'); }
      if (e.key.toLowerCase() === 'i') { e.preventDefault(); exec('italic'); }
      if (e.key.toLowerCase() === 'u') { e.preventDefault(); exec('underline'); }
    }
  };

  // Paste sanitization + NBSP normalization
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const html = e.clipboardData.getData('text/html');
    const text = e.clipboardData.getData('text/plain');
    const payload = html
      ? sanitizeHTML(html)
      : normalizeNBSP(text).replace(/\n/g, '<br>');
    document.execCommand('insertHTML', false, payload);
    setTimeout(handleVisualChange, 10);
  };

  // ---------------- Source tools ----------------
  const pushUndo = (val: string) => {
    setSourceUndoStack(prev => {
      if (prev.length && prev[prev.length - 1] === val) return prev;
      const next = [...prev, val];
      return next.length > 100 ? next.slice(-100) : next;
    });
    setSourceRedoStack([]);
  };

  const sourceUndo = () => {
    setSourceUndoStack(prev => {
      if (prev.length <= 1) return prev;
      const last = prev[prev.length - 2];
      setSourceRedoStack(r => [prev[prev.length - 1], ...r]);
      setBoth(last);
      return prev.slice(0, -1);
    });
  };

  const sourceRedo = () => {
    setSourceRedoStack(prev => {
      if (!prev.length) return prev;
      const [first, ...rest] = prev;
      setBoth(first);
      setSourceUndoStack(u => [...u, first]);
      return rest;
    });
  };

  const sourceNew = () => {
    if (!confirm('Start a new blank document?')) return;
    setBoth('');
    setSourceUndoStack(['']);
    setSourceRedoStack([]);
  };

  // Full source font size control
  const bumpSourceFont = (delta: 1 | -1) => {
    setSourceFontSize(prev => Math.min(28, Math.max(10, prev + delta)));
  };

  const sourceCopy = async () => {
    await navigator.clipboard.writeText(htmlContent);
    setCopied(true); setTimeout(() => setCopied(false), 1200);
  };

  const sourceSelectAll = () => {
    const textarea = document.getElementById('source-textarea') as HTMLTextAreaElement | null;
    textarea?.select();
  };

  const sourceClean = () => {
    let safe = sanitizeHTML(htmlContent);
    
    // Additional cleaning steps to ensure clean HTML
    safe = safe
      // Remove empty paragraphs and elements
      .replace(/<p>\s*<\/p>/gi, '')
      .replace(/<p><br\s*\/?><\/p>/gi, '')
      .replace(/<div>\s*<\/div>/gi, '')
      .replace(/<span>\s*<\/span>/gi, '')
      // Remove ALL standalone br tags - they're not needed in clean HTML
      .replace(/<br\s*\/?>/gi, '')
      // Clean up whitespace around block elements
      .replace(/\s*(<\/?(h[1-6]|p|div|ul|ol|li|blockquote|table|thead|tbody|tr|th|td)[^>]*>)\s*/gi, '$1')
      // Normalize spaces
      .replace(/\s+/g, ' ')
      .trim();
    
    const pretty = domPretty(safe);
    setBoth(pretty);
    pushUndo(pretty);
  };

  // ---------------- Utilities (shared) ----------------
  const copyHTML = async () => {
    await navigator.clipboard.writeText(htmlContent);
    setCopied(true); setTimeout(() => setCopied(false), 1200);
  };

  const downloadHTML = () => {
    const doc = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Document</title>
</head>
<body>
${htmlContent}
</body>
</html>`;
    const blob = new Blob([doc], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'document.html'; a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true); setTimeout(() => setDownloaded(false), 1200);
  };

  const triggerImport = () => fileInputRef.current?.click();
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const text = await file.text();
      const safe = sanitizeHTML(text);
      setBoth(safe);
      pushUndo(safe);
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // ---------------- Stats ----------------
  const plainText = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = plainText ? plainText.split(' ').length : 0;
  const chars = plainText.length;
  const readingTimeMin = words > 0 ? Math.max(1, Math.round(words / 200)) : 0;

  // Reusable btn styles (compact on mobile)
  const btn = 'shrink-0 px-1 py-0.5 text-xs sm:px-2 sm:py-1 sm:text-sm border rounded';
  const btnSolid = 'shrink-0 px-1.5 py-0.5 text-xs sm:px-2 sm:py-1 sm:text-sm rounded-lg';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Global styles for the visual editor */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .visual-editor {
          font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif !important;
          line-height: 1.6 !important;
          color: #374151 !important;
        }
        .visual-editor p {
          margin: 0.75em 0 !important;
          padding: 0 !important;
          font-size: 16px !important;
          line-height: 1.6 !important;
        }
        .visual-editor p:first-child {
          margin-top: 0 !important;
        }
        .visual-editor p:last-child {
          margin-bottom: 0 !important;
        }
        .visual-editor h1 {
          font-size: 2.25em !important;
          font-weight: 700 !important;
          margin: 1em 0 0.5em 0 !important;
          color: #1f2937 !important;
          line-height: 1.2 !important;
        }
        .visual-editor h2 {
          font-size: 1.875em !important;
          font-weight: 600 !important;
          margin: 1em 0 0.5em 0 !important;
          color: #1f2937 !important;
          line-height: 1.3 !important;
        }
        .visual-editor h3 {
          font-size: 1.5em !important;
          font-weight: 600 !important;
          margin: 1em 0 0.5em 0 !important;
          color: #1f2937 !important;
          line-height: 1.4 !important;
        }
        .visual-editor h4 {
          font-size: 1.25em !important;
          font-weight: 600 !important;
          margin: 1em 0 0.5em 0 !important;
          color: #1f2937 !important;
          line-height: 1.4 !important;
        }
        .visual-editor h5 {
          font-size: 1.125em !important;
          font-weight: 600 !important;
          margin: 1em 0 0.5em 0 !important;
          color: #1f2937 !important;
          line-height: 1.5 !important;
        }
        .visual-editor h6 {
          font-size: 1em !important;
          font-weight: 600 !important;
          margin: 1em 0 0.5em 0 !important;
          color: #1f2937 !important;
          line-height: 1.5 !important;
        }
        .visual-editor h1:first-child, .visual-editor h2:first-child, 
        .visual-editor h3:first-child, .visual-editor h4:first-child, 
        .visual-editor h5:first-child, .visual-editor h6:first-child {
          margin-top: 0 !important;
        }
        .visual-editor ul, .visual-editor ol {
          margin: 1em 0 !important;
          padding-left: 2em !important;
        }
        .visual-editor li {
          margin: 0.5em 0 !important;
          padding: 0 !important;
        }
        .visual-editor ul li {
          list-style-type: disc !important;
        }
        .visual-editor ol li {
          list-style-type: decimal !important;
        }
        .visual-editor strong, .visual-editor b {
          font-weight: 700 !important;
        }
        .visual-editor em, .visual-editor i {
          font-style: italic !important;
        }
        .visual-editor u {
          text-decoration: underline !important;
        }
        .visual-editor s {
          text-decoration: line-through !important;
        }
        .visual-editor a {
          color: #2563eb !important;
          text-decoration: underline !important;
        }
        .visual-editor a:hover {
          color: #1d4ed8 !important;
        }
        .visual-editor blockquote {
          margin: 1.5em 0 !important;
          padding: 1em 1.5em !important;
          border-left: 4px solid #2563eb !important;
          background-color: #f8fafc !important;
          font-style: italic !important;
          color: #475569 !important;
        }
        .visual-editor table {
          border-collapse: collapse !important;
          width: 100% !important;
          margin: 1.5em 0 !important;
          border: 1px solid #d1d5db !important;
        }
        .visual-editor th, .visual-editor td {
          border: 1px solid #d1d5db !important;
          padding: 0.75em !important;
          text-align: left !important;
          vertical-align: top !important;
        }
        .visual-editor th {
          background-color: #f9fafb !important;
          font-weight: 600 !important;
          color: #374151 !important;
        }
        .visual-editor pre {
          background-color: #f3f4f6 !important;
          padding: 1.5em !important;
          border-radius: 0.5rem !important;
          overflow-x: auto !important;
          margin: 1.5em 0 !important;
          border: 1px solid #e5e7eb !important;
        }
        .visual-editor code {
          background-color: #f3f4f6 !important;
          padding: 0.25em 0.5em !important;
          border-radius: 0.25rem !important;
          font-family: 'Courier New', Consolas, Monaco, monospace !important;
          font-size: 0.875em !important;
          color: #dc2626 !important;
          border: 1px solid #e5e7eb !important;
        }
        .visual-editor pre code {
          background: none !important;
          padding: 0 !important;
          border: none !important;
          color: inherit !important;
        }
        .visual-editor hr {
          border: none !important;
          height: 2px !important;
          background-color: #e5e7eb !important;
          margin: 2em 0 !important;
        }
        .visual-editor img {
          max-width: 100% !important;
          height: auto !important;
          border-radius: 0.375rem !important;
          margin: 1em 0 !important;
        }
        `
      }} />
      {/* Reduced top spacing */}
      <section className="pt-6 pb-12">
        <div className="container mx-auto px-3 sm:px-6 max-w-7xl">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
            {/* Global actions */}
            <div className="border-b border-gray-200 p-3 sm:p-4 bg-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="text-sm font-semibold text-gray-700">HTML Editor — Enhanced Toolbars</div>
              <div className="flex flex-wrap items-center gap-1 sm:gap-2 w-full sm:w-auto">
                <button onClick={copyHTML} className={`${btnSolid} bg-primary text-white hover:bg-primary/90`}>
                  {copied ? '✅ Copied' : '📋 Copy'}
                </button>
                <button onClick={downloadHTML} className={`${btn} hover:bg-gray-100`}>{downloaded ? '✅' : '⬇️'} Download</button>
                <button onClick={triggerImport} className={`${btn} hover:bg-gray-100`}>{importing ? '⏳' : '📂'} Import</button>
                <input ref={fileInputRef} type="file" accept=".html,text/html,.txt" onChange={handleImport} className="hidden" />
              </div>
            </div>

            {/* Two panes: Source TOP on mobile, LEFT on desktop, Visual BOTTOM on mobile, RIGHT on desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 h-auto lg:h-[75vh] min-h-[600px] sm:min-h-[700px] lg:min-h-0">
              {/* SOURCE (Top on mobile, Left on desktop) */}
              <div className="border-r-0 lg:border-r border-gray-200 border-b lg:border-b-0 flex flex-col min-h-[300px] lg:min-h-0 overflow-hidden">
                <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center gap-1 sm:gap-2 shrink-0">
                  <span className="text-xs sm:text-sm font-semibold text-gray-700 mr-2">💻 HTML Source</span>
                  <button className="order-1 lg:order-none px-2 sm:px-3 py-1.5 text-xs sm:text-sm bg-gray-800 text-white rounded-lg" onClick={sourceClean} title="Clean / Sanitize">
                    ⚙️ Clean
                  </button>
                  <button className={btn} onClick={sourceUndo} title="Undo">↶</button>
                  <button className={btn} onClick={sourceRedo} title="Redo">↷</button>
                  <button className={btn} onClick={sourceNew} title="New / Clear">🗒️</button>
                  <button className={btn} onClick={() => setSourceFontSize(p => Math.max(10, p - 1))} title="Font −">A−</button>
                  <button className={btn} onClick={() => setSourceFontSize(p => Math.min(28, p + 1))} title="Font +">A+</button>
                  <button className={btn} onClick={sourceCopy} title="Copy">📋</button>
                  <button className={btn} onClick={sourceSelectAll} title="Select All">▭</button>
                  <span className="ml-auto text-[11px] sm:text-xs text-gray-600 order-last">
                    Source: {htmlContent.length} • {sourceFontSize}px
                  </span>
                </div>

                <textarea
                  id="source-textarea"
                  value={htmlContent}
                  onChange={handleSourceChange}
                  className="flex-1 p-4 sm:p-6 font-mono text-xs sm:text-sm resize-none focus:outline-none border-0 overflow-auto min-h-[250px] lg:min-h-0"
                  style={{ fontSize: `${sourceFontSize}px`, lineHeight: 1.6 }}
                  spellCheck={false}
                  aria-label="HTML source"
                />
              </div>

              {/* VISUAL (Bottom on mobile, Right on desktop) */}
              <div className="flex flex-col min-h-[300px] lg:min-h-0 overflow-hidden">
                {/* Visual toolbar */}
                <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border-b border-gray-200 shrink-0 overflow-x-auto">
                  <div className="flex flex-wrap lg:flex-nowrap items-center gap-1 sm:gap-2 min-w-fit">
                    {/* Undo/Redo */}
                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => exec('undo')} className={btn} title="Undo">↶</button>
                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => exec('redo')} className={btn} title="Redo">↷</button>

                    {/* Formats dropdown */}
                    <select
                      className="shrink-0 px-1 py-0.5 text-xs sm:px-2 sm:py-1 sm:text-sm border rounded"
                      defaultValue=""
                      onChange={(e) => { handleFormatsChange(e.target.value); e.currentTarget.value = ""; }}
                      title="Formats"
                    >
                      <option value="" disabled>Formats</option>
                      <option value="H1">Heading 1</option>
                      <option value="H2">Heading 2</option>
                      <option value="H3">Heading 3</option>
                      <option value="H4">Heading 4</option>
                      <option value="P">Paragraph</option>
                      <option value="BLOCKQUOTE">Block Quote</option>
                      <option value="COLOR:red">Red text</option>
                      <option value="COLOR:green">Green text</option>
                      <option value="COLOR:blue">Blue text</option>
                    </select>

                    {/* Inline */}
                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => exec('bold')} className={`${btn} font-bold`} title="Bold">B</button>
                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => exec('italic')} className={`${btn} italic`} title="Italic">I</button>
                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => exec('underline')} className={`${btn} underline`} title="Underline">U</button>
                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => exec('strikeThrough')} className={`${btn} line-through`} title="Strikethrough">S</button>

                    {/* Align */}
                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => exec('justifyLeft')} className={btn} title="Align Left">⟸</button>
                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => exec('justifyCenter')} className={btn} title="Align Center">⇔</button>
                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => exec('justifyRight')} className={btn} title="Align Right">⟹</button>
                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => exec('justifyFull')} className={btn} title="Justify">≣</button>

                    {/* Lists & Indent */}
                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => exec('insertUnorderedList')} className={btn} title="Bulleted List">•</button>
                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => exec('insertOrderedList')} className={btn} title="Numbered List">1.</button>
                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => exec('outdent')} className={btn} title="Outdent">⇤</button>
                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => exec('indent')} className={btn} title="Indent">⇥</button>

                    {/* Links / Media */}
                    <button onMouseDown={(e) => e.preventDefault()} onClick={makeLink} className={btn} title="Insert Link">🔗</button>
                    <button onMouseDown={(e) => e.preventDefault()} onClick={removeLink} className={btn} title="Remove Link">⛔</button>
                    <button onMouseDown={(e) => e.preventDefault()} onClick={insertImage} className={btn} title="Insert Image">🖼️</button>

                    {/* Paragraph / Code / HR */}
                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => makeBlock('P')} className={btn} title="Paragraph">¶</button>
                    <button onMouseDown={(e) => e.preventDefault()} onClick={insertCodeBlock} className={btn} title="Code">{'</>'}</button>
                    <button onMouseDown={(e) => e.preventDefault()} onClick={insertHR} className={btn} title="Horizontal Rule">—</button>

                    {/* Color pickers */}
                    <label className={`${btn} cursor-pointer`} title="Text Color">
                      A
                      <input type="color" className="ml-0.5 w-4 h-4 sm:w-5 sm:h-5 align-middle" onChange={(e) => applyForeColor(e.target.value)} />
                    </label>
                    <label className={`${btn} cursor-pointer`} title="Background Color">
                      A▉
                      <input type="color" className="ml-0.5 w-4 h-4 sm:w-5 sm:h-5 align-middle" onChange={(e) => applyBackColor(e.target.value)} />
                    </label>

                    {/* Sup/Sub */}
                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => exec('superscript')} className={btn} title="Superscript">x⁺</button>
                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => exec('subscript')} className={btn} title="Subscript">x₋</button>

                    {/* Emoji anchor button */}
                    <div className="relative">
                      <button
                        ref={emojiBtnRef}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setEmojiOpen((v) => !v);
                          if (!emojiBtnRef.current) return;
                          const r = emojiBtnRef.current.getBoundingClientRect();
                          setEmojiPos({ top: r.bottom + 8, left: r.left });
                        }}
                        className={btn}
                        title="Emoji"
                        aria-haspopup="true"
                        aria-expanded={emojiOpen}
                      >
                        😊
                      </button>
                    </div>

                    {/* Table */}
                    <button onMouseDown={(e) => e.preventDefault()} onClick={insertTable} className={btn} title="Insert Table">▦</button>

                    {/* Remove Format */}
                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => exec('removeFormat')} className={btn} title="Remove Formatting">⌫</button>

                    {/* Font ± (wrap selection) */}
                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => fontSizeStep(-1)} className={btn} title="Smaller">A−</button>
                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => fontSizeStep(1)} className={btn} title="Larger">A+</button>
                  </div>
                </div>

                {/* Visual editor */}
                <div
                  ref={visualRef}
                  contentEditable
                  onInput={handleVisualChange}
                  onKeyUp={handleVisualChange}
                  onPaste={handlePaste}
                  onKeyDown={handleKeyDown}
                  className="visual-editor flex-1 p-4 sm:p-6 overflow-auto focus:outline-none max-w-none min-h-[250px] lg:min-h-0"
                  style={{
                    border: 'none',
                    outline: 'none',
                  }}
                  suppressContentEditableWarning
                />
              </div>
            </div>

            {/* Emoji popover (fixed, clamped) */}
            {emojiOpen && (
              <div
                ref={emojiPopoverRef}
                className="fixed z-50 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-2 max-h-64 overflow-auto"
                style={{ top: emojiPos.top, left: emojiPos.left }}
              >
                <div className="grid grid-cols-6 gap-1">
                  {EMOJI.map((e) => (
                    <button
                      key={e}
                      className="h-8 w-8 rounded hover:bg-gray-100 text-lg"
                      onClick={() => {
                        document.execCommand('insertText', false, e);
                        setEmojiOpen(false);
                        setTimeout(handleVisualChange, 10);
                      }}
                      title={e}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stats/footer of editor card */}
            <div className="border-t border-gray-200 px-3 sm:px-4 py-2 bg-gray-50 text-xs sm:text-sm text-gray-600">
              Words: <strong>{words}</strong> · Characters: <strong>{chars}</strong> · Reading time: <strong>{readingTimeMin} min</strong>
              <span className="float-right text-green-600">✅ Visual & source stay in sync</span>
            </div>
          </div>

          {/* Page description under the tool */}
          <div className="mt-8 text-center">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-2">
              HTML5 Editor — Visual &amp; Source, Always in Sync
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              Visual editor on the <strong>right</strong>, HTML source on the <strong>left</strong>. Toolbars, emoji picker,
              tables, colors, clean, and more.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
