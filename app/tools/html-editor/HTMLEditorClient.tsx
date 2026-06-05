'use client';

import React, { useEffect, useRef, useState } from 'react';
import ShapeGrid from '../../components/ShapeGrid';

export default function HTMLEditorClient() {

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
  const normalizeNBSP = (html: string) => html.replace(/&nbsp;| /g, ' ');

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

  // Button class constants — design system (he-* classes defined in scoped <style> below)
  const btn = 'he-btn';
  const btnSolid = 'he-btn-blue';

  return (
    <>
      {/* ── Scoped styles: visual editor content + editor chrome ── */}
      <style dangerouslySetInnerHTML={{
        __html: `
        /* ---- Visual editor content ---- */
        .visual-editor {
          font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif !important;
          line-height: 1.6 !important;
          color: #374151 !important;
        }
        .visual-editor p { margin: 0.75em 0 !important; padding: 0 !important; font-size: 16px !important; line-height: 1.6 !important; }
        .visual-editor p:first-child { margin-top: 0 !important; }
        .visual-editor p:last-child { margin-bottom: 0 !important; }
        .visual-editor h1 { font-size: 2.25em !important; font-weight: 700 !important; margin: 1em 0 0.5em 0 !important; color: #1f2937 !important; line-height: 1.2 !important; }
        .visual-editor h2 { font-size: 1.875em !important; font-weight: 600 !important; margin: 1em 0 0.5em 0 !important; color: #1f2937 !important; line-height: 1.3 !important; }
        .visual-editor h3 { font-size: 1.5em !important; font-weight: 600 !important; margin: 1em 0 0.5em 0 !important; color: #1f2937 !important; line-height: 1.4 !important; }
        .visual-editor h4 { font-size: 1.25em !important; font-weight: 600 !important; margin: 1em 0 0.5em 0 !important; color: #1f2937 !important; line-height: 1.4 !important; }
        .visual-editor h5 { font-size: 1.125em !important; font-weight: 600 !important; margin: 1em 0 0.5em 0 !important; color: #1f2937 !important; line-height: 1.5 !important; }
        .visual-editor h6 { font-size: 1em !important; font-weight: 600 !important; margin: 1em 0 0.5em 0 !important; color: #1f2937 !important; line-height: 1.5 !important; }
        .visual-editor h1:first-child, .visual-editor h2:first-child, .visual-editor h3:first-child,
        .visual-editor h4:first-child, .visual-editor h5:first-child, .visual-editor h6:first-child { margin-top: 0 !important; }
        .visual-editor ul, .visual-editor ol { margin: 1em 0 !important; padding-left: 2em !important; }
        .visual-editor li { margin: 0.5em 0 !important; padding: 0 !important; }
        .visual-editor ul li { list-style-type: disc !important; }
        .visual-editor ol li { list-style-type: decimal !important; }
        .visual-editor strong, .visual-editor b { font-weight: 700 !important; }
        .visual-editor em, .visual-editor i { font-style: italic !important; }
        .visual-editor u { text-decoration: underline !important; }
        .visual-editor s { text-decoration: line-through !important; }
        .visual-editor a { color: #2563eb !important; text-decoration: underline !important; }
        .visual-editor a:hover { color: #1d4ed8 !important; }
        .visual-editor blockquote { margin: 1.5em 0 !important; padding: 1em 1.5em !important; border-left: 4px solid #2563eb !important; background-color: #f8fafc !important; font-style: italic !important; color: #475569 !important; }
        .visual-editor table { border-collapse: collapse !important; width: 100% !important; margin: 1.5em 0 !important; border: 1px solid #d1d5db !important; }
        .visual-editor th, .visual-editor td { border: 1px solid #d1d5db !important; padding: 0.75em !important; text-align: left !important; vertical-align: top !important; }
        .visual-editor th { background-color: #f9fafb !important; font-weight: 600 !important; color: #374151 !important; }
        .visual-editor pre { background-color: #f3f4f6 !important; padding: 1.5em !important; overflow-x: auto !important; margin: 1.5em 0 !important; border: 1px solid #e5e7eb !important; }
        .visual-editor code { background-color: #f3f4f6 !important; padding: 0.25em 0.5em !important; font-family: 'Courier New', Consolas, Monaco, monospace !important; font-size: 0.875em !important; color: #dc2626 !important; border: 1px solid #e5e7eb !important; }
        .visual-editor pre code { background: none !important; padding: 0 !important; border: none !important; color: inherit !important; }
        .visual-editor hr { border: none !important; height: 2px !important; background-color: #e5e7eb !important; margin: 2em 0 !important; }
        .visual-editor img { max-width: 100% !important; height: auto !important; margin: 1em 0 !important; }

        /* ---- HTML Editor chrome ---- */
        .he-topbar {
          background: var(--ink-3);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 0.625rem 1rem;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.375rem;
        }
        .he-topbar-label {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.8rem;
          font-weight: 700;
          color: rgba(255,255,255,0.6);
          margin-right: 0.5rem;
        }
        .he-btn {
          flex-shrink: 0;
          padding: 4px 8px;
          font-size: 0.72rem;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.65);
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: background 0.15s, color 0.15s, border-color 0.15s;
          line-height: 1.5;
        }
        .he-btn:hover {
          background: rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.9);
          border-color: rgba(255,255,255,0.25);
        }
        .he-btn-blue {
          flex-shrink: 0;
          background: var(--blue);
          color: #fff;
          border: none;
          padding: 5px 14px;
          font-size: 0.75rem;
          font-weight: 700;
          font-family: 'Space Grotesk', sans-serif;
          cursor: pointer;
          transition: background 0.15s;
          line-height: 1.5;
        }
        .he-btn-blue:hover { background: var(--blue-dark); }
        .he-select {
          flex-shrink: 0;
          padding: 4px 6px;
          font-size: 0.72rem;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.65);
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          outline: none;
        }
        .he-select option { background: var(--ink-2); color: var(--white); }
        .he-editor-box {
          border: 1px solid rgba(255,255,255,0.08);
          border-top: none;
          background: var(--ink-3);
        }
        .he-panes {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 500px;
        }
        .he-source-pane {
          border-right: 1px solid rgba(255,255,255,0.08);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .he-visual-pane {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: #fff;
        }
        .he-pane-top {
          padding: 0.5rem 0.75rem;
          background: var(--ink-2);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.25rem;
          flex-shrink: 0;
        }
        .he-visual-pane .he-pane-top {
          background: #f3f4f6;
          border-bottom: 1px solid #e5e7eb;
        }
        .he-visual-pane .he-btn {
          background: rgba(0,0,0,0.04);
          border-color: #d1d5db;
          color: #374151;
        }
        .he-visual-pane .he-btn:hover {
          background: rgba(37,99,235,0.08);
          border-color: rgba(37,99,235,0.35);
          color: #1d4ed8;
        }
        .he-visual-pane .he-select {
          background: rgba(0,0,0,0.04);
          border-color: #d1d5db;
          color: #374151;
        }
        .he-visual-pane .he-select option { background: #fff; color: #111; }
        .he-pane-label {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          color: rgba(255,255,255,0.6);
          margin-right: 0.375rem;
        }
        .he-visual-pane .he-pane-label { color: #374151; }
        .he-pane-meta {
          margin-left: auto;
          font-size: 0.65rem;
          color: rgba(255,255,255,0.28);
          font-family: 'JetBrains Mono', monospace;
          white-space: nowrap;
        }
        .he-visual-pane .he-pane-meta { color: #9ca3af; }
        .he-stats-bar {
          background: var(--ink-2);
          border-top: 1px solid rgba(255,255,255,0.08);
          padding: 0.5rem 1rem;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.35);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .he-stats-bar strong { color: rgba(255,255,255,0.65); }
        .he-emoji-popover {
          border: 1px solid var(--line);
          background: var(--white);
          box-shadow: 0 8px 24px rgba(0,0,0,0.14);
        }
        .he-emoji-btn {
          width: 32px;
          height: 32px;
          font-size: 1rem;
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.1s;
        }
        .he-emoji-btn:hover { background: var(--blue-pale); }
        @media (max-width: 900px) {
          .he-panes { grid-template-columns: 1fr; }
          .he-source-pane { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.08); }
        }
        `
      }} />

      {/* ─── HERO ─── */}
      <div id="top" className="tool-hero">
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'all' }}>
          <ShapeGrid direction="diagonal" speed={0.4} borderColor="rgba(37,99,235,0.22)" squareSize={52} hoverFillColor="rgba(37,99,235,0.2)" hoverTrailAmount={6} />
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, transparent 30%, rgba(8,9,10,0.55) 100%)', pointerEvents: 'none' }} />
        <div className="tool-hero-inner">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span className="breadcrumb-sep">/</span>
            <a href="/tools/">SEO Tools</a>
            <span className="breadcrumb-sep">/</span>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>HTML Editor</span>
          </nav>
          <div className="tool-hero-badge">💻 HTML Tool — Free Forever</div>
          <h1 className="tool-hero-h1">Free Online <span>HTML5 Editor</span><br />with Live Preview</h1>
          <p className="tool-hero-sub">Write, test, and perfect your HTML, CSS, and JavaScript instantly. Dual-pane editor with visual rich-text preview — no setup, no downloads, just open and code.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem 2rem', marginTop: '1.5rem' }}>
            {['Live Preview', 'Syntax Highlighting', 'HTML, CSS & JavaScript', '100% Free'].map((label) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: 'var(--green)', fontWeight: 700, fontSize: '0.85rem' }}>&#10003;</span>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 500 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── EDITOR SECTION ─── */}
      <div className="tool-input-section">
        <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
          {/* Global actions bar */}
          <div className="he-topbar">
            <span className="he-topbar-label">HTML Editor — Enhanced Toolbars</span>
            <button onClick={copyHTML} className={btnSolid}>
              {copied ? '✅ Copied' : '📋 Copy'}
            </button>
            <button onClick={downloadHTML} className={btn}>{downloaded ? '✅' : '⬇️'} Download</button>
            <button onClick={triggerImport} className={btn}>{importing ? '⏳' : '📂'} Import</button>
            <input ref={fileInputRef} type="file" accept=".html,text/html,.txt" onChange={handleImport} style={{ display: 'none' }} />
          </div>

          {/* Two-pane editor */}
          <div className="he-editor-box">
            <div className="he-panes">

              {/* SOURCE PANE */}
              <div className="he-source-pane">
                <div className="he-pane-top">
                  <span className="he-pane-label">💻 HTML Source</span>
                  <button className={btn} onClick={sourceClean} title="Clean / Sanitize">⚙️ Clean</button>
                  <button className={btn} onClick={sourceUndo} title="Undo">↶</button>
                  <button className={btn} onClick={sourceRedo} title="Redo">↷</button>
                  <button className={btn} onClick={sourceNew} title="New / Clear">🗒️</button>
                  <button className={btn} onClick={() => setSourceFontSize(p => Math.max(10, p - 1))} title="Font −">A−</button>
                  <button className={btn} onClick={() => setSourceFontSize(p => Math.min(28, p + 1))} title="Font +">A+</button>
                  <button className={btn} onClick={sourceCopy} title="Copy">📋</button>
                  <button className={btn} onClick={sourceSelectAll} title="Select All">▭</button>
                  <span className="he-pane-meta">Source: {htmlContent.length} · {sourceFontSize}px</span>
                </div>
                <textarea
                  id="source-textarea"
                  value={htmlContent}
                  onChange={handleSourceChange}
                  style={{
                    flex: 1,
                    padding: '1rem 1.25rem',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: `${sourceFontSize}px`,
                    lineHeight: 1.6,
                    resize: 'none',
                    outline: 'none',
                    border: 'none',
                    overflow: 'auto',
                    minHeight: '220px',
                    background: 'var(--ink-3)',
                    color: 'rgba(255,255,255,0.82)',
                    display: 'block',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                  spellCheck={false}
                  aria-label="HTML source"
                />
              </div>

              {/* VISUAL PANE */}
              <div className="he-visual-pane">
                <div className="he-pane-top">
                  <button onMouseDown={(e) => e.preventDefault()} onClick={() => exec('undo')} className={btn} title="Undo">↶</button>
                  <button onMouseDown={(e) => e.preventDefault()} onClick={() => exec('redo')} className={btn} title="Redo">↷</button>
                  <select
                    className="he-select"
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
                  <button onMouseDown={(e) => e.preventDefault()} onClick={() => exec('bold')} className={btn} style={{ fontWeight: 700 }} title="Bold">B</button>
                  <button onMouseDown={(e) => e.preventDefault()} onClick={() => exec('italic')} className={btn} style={{ fontStyle: 'italic' }} title="Italic">I</button>
                  <button onMouseDown={(e) => e.preventDefault()} onClick={() => exec('underline')} className={btn} style={{ textDecoration: 'underline' }} title="Underline">U</button>
                  <button onMouseDown={(e) => e.preventDefault()} onClick={() => exec('strikeThrough')} className={btn} style={{ textDecoration: 'line-through' }} title="Strikethrough">S</button>
                  <button onMouseDown={(e) => e.preventDefault()} onClick={() => exec('justifyLeft')} className={btn} title="Align Left">⟸</button>
                  <button onMouseDown={(e) => e.preventDefault()} onClick={() => exec('justifyCenter')} className={btn} title="Align Center">⇔</button>
                  <button onMouseDown={(e) => e.preventDefault()} onClick={() => exec('justifyRight')} className={btn} title="Align Right">⟹</button>
                  <button onMouseDown={(e) => e.preventDefault()} onClick={() => exec('justifyFull')} className={btn} title="Justify">≣</button>
                  <button onMouseDown={(e) => e.preventDefault()} onClick={() => exec('insertUnorderedList')} className={btn} title="Bulleted List">•</button>
                  <button onMouseDown={(e) => e.preventDefault()} onClick={() => exec('insertOrderedList')} className={btn} title="Numbered List">1.</button>
                  <button onMouseDown={(e) => e.preventDefault()} onClick={() => exec('outdent')} className={btn} title="Outdent">⇤</button>
                  <button onMouseDown={(e) => e.preventDefault()} onClick={() => exec('indent')} className={btn} title="Indent">⇥</button>
                  <button onMouseDown={(e) => e.preventDefault()} onClick={makeLink} className={btn} title="Insert Link">🔗</button>
                  <button onMouseDown={(e) => e.preventDefault()} onClick={removeLink} className={btn} title="Remove Link">⛔</button>
                  <button onMouseDown={(e) => e.preventDefault()} onClick={insertImage} className={btn} title="Insert Image">🖼️</button>
                  <button onMouseDown={(e) => e.preventDefault()} onClick={() => makeBlock('P')} className={btn} title="Paragraph">¶</button>
                  <button onMouseDown={(e) => e.preventDefault()} onClick={insertCodeBlock} className={btn} title="Code">{'</>'}</button>
                  <button onMouseDown={(e) => e.preventDefault()} onClick={insertHR} className={btn} title="Horizontal Rule">—</button>
                  <label className={btn} style={{ cursor: 'pointer' }} title="Text Color">
                    A<input type="color" style={{ marginLeft: '2px', width: '14px', height: '14px', verticalAlign: 'middle', cursor: 'pointer', border: 'none', padding: 0 }} onChange={(e) => applyForeColor(e.target.value)} />
                  </label>
                  <label className={btn} style={{ cursor: 'pointer' }} title="Background Color">
                    A▉<input type="color" style={{ marginLeft: '2px', width: '14px', height: '14px', verticalAlign: 'middle', cursor: 'pointer', border: 'none', padding: 0 }} onChange={(e) => applyBackColor(e.target.value)} />
                  </label>
                  <button onMouseDown={(e) => e.preventDefault()} onClick={() => exec('superscript')} className={btn} title="Superscript">x⁺</button>
                  <button onMouseDown={(e) => e.preventDefault()} onClick={() => exec('subscript')} className={btn} title="Subscript">x₋</button>
                  <div style={{ position: 'relative' }}>
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
                  <button onMouseDown={(e) => e.preventDefault()} onClick={insertTable} className={btn} title="Insert Table">▦</button>
                  <button onMouseDown={(e) => e.preventDefault()} onClick={() => exec('removeFormat')} className={btn} title="Remove Formatting">⌫</button>
                  <button onMouseDown={(e) => e.preventDefault()} onClick={() => fontSizeStep(-1)} className={btn} title="Smaller">A−</button>
                  <button onMouseDown={(e) => e.preventDefault()} onClick={() => fontSizeStep(1)} className={btn} title="Larger">A+</button>
                </div>
                <div
                  ref={visualRef}
                  contentEditable
                  onInput={handleVisualChange}
                  onKeyUp={handleVisualChange}
                  onPaste={handlePaste}
                  onKeyDown={handleKeyDown}
                  className="visual-editor"
                  style={{ flex: 1, padding: '1rem 1.25rem', overflow: 'auto', outline: 'none', border: 'none', minHeight: '220px', background: '#fff' }}
                  suppressContentEditableWarning
                />
              </div>
            </div>

            {/* Emoji popover (fixed, clamped) */}
            {emojiOpen && (
              <div
                ref={emojiPopoverRef}
                className="he-emoji-popover"
                style={{ position: 'fixed', zIndex: 50, width: '256px', padding: '0.5rem', maxHeight: '256px', overflow: 'auto', top: emojiPos.top, left: emojiPos.left }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '2px' }}>
                  {EMOJI.map((e) => (
                    <button
                      key={e}
                      className="he-emoji-btn"
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

            {/* Stats footer */}
            <div className="he-stats-bar">
              <span>Words: <strong>{words}</strong> · Characters: <strong>{chars}</strong> · Reading time: <strong>{readingTimeMin} min</strong></span>
              <span style={{ color: 'var(--green)', fontWeight: 600 }}>✅ Visual &amp; source stay in sync</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── FOUNDER ─── */}
      <section className="founder-section" style={{ padding: '3rem 2rem' }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
          <div className="founder-inner">
            <div className="founder-avatar">RS</div>
            <div>
              <p className="founder-quote-text">&ldquo;I built this HTML editor because every time I wanted to test a quick snippet or prototype a layout, I had to either set up a local server or navigate to some clunky online tool. This editor just gets out of the way — dual pane, instant sync, and it runs entirely in your browser.&rdquo;</p>
              <div className="founder-name">Rohit Sharma</div>
              <div className="founder-role">Founder, SEOShouts</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PROSE: About ─── */}
      <section className="section prose-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">About This Tool</div>
            <h2 className="s-title">Write HTML, CSS &amp; JavaScript <span className="blue">Instantly</span></h2>
          </div>
          <div className="prose-content">
            <h3>Code Without the Complicated Setup</h3>
            <p>Ever wanted to quickly test some HTML code but didn&rsquo;t want to open your entire development setup? Or maybe you&rsquo;re learning web development and need a simple way to practice without complicated software?</p>
            <p>Our HTML5 Online Editor is perfect for exactly that. Open your browser, start typing code, and watch your webpage come to life in real time.</p>
            <p><strong>Best part?</strong> No downloads, no setup, no headaches. Just pure, instant coding.</p>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="section features-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Editor Features</div>
            <h2 className="s-title">What Makes This Editor <span className="blue">Actually Useful</span></h2>
          </div>
          <div className="features-grid">
            {[
              {
                title: 'Live Split Preview',
                desc: 'Type HTML on the left, see the result on the right. Add CSS, watch it update instantly. Drop in JavaScript, see it work right away.',
                paths: ['M3 3H10V21H3z', 'M14 3H21V21H14z'],
              },
              {
                title: 'Visual Rich Text Editor',
                desc: 'Full WYSIWYG toolbar with bold, italic, lists, tables, links, images, and more. Format content without writing a single tag.',
                paths: ['M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7', 'M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'],
              },
              {
                title: 'HTML Sanitizer & Formatter',
                desc: 'One-click Clean strips unsafe tags, removes inline styles, normalizes whitespace, and pretty-prints your markup for clean output.',
                paths: ['M22 3H2l8 9.46V19l4 2v-8.54L22 3z'],
              },
              {
                title: 'Export & Import Files',
                desc: 'Copy HTML to clipboard, download as a full HTML file, or import existing .html files directly into the editor.',
                paths: ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'M7 10L12 15L17 10', 'M12 15V3'],
              },
              {
                title: 'Auto-Saves to Browser',
                desc: 'Your work is automatically saved to browser local storage. Close the tab and come back later — your code will still be there.',
                paths: ['M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z', 'M17 21V13H7V21', 'M7 3V8H15'],
              },
              {
                title: 'Emoji Picker Built In',
                desc: 'Insert emojis directly into your HTML content from a built-in palette of 70+ emojis — no copy-paste needed.',
                paths: ['M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z', 'M8 14s1.5 2 4 2 4-2 4-2', 'M9 9h.01', 'M15 9h.01'],
              },
            ].map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    {f.paths.map((p, pi) => <path key={pi} d={p} />)}
                  </svg>
                </div>
                <div className="feature-title">{f.title}</div>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW-TO ─── */}
      <section className="section howto-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Getting Started</div>
            <h2 className="s-title">How to Use the <span className="blue">HTML5 Editor</span></h2>
          </div>
          <div className="steps-grid">
            {[
              { title: 'Start Typing', desc: 'Open the tool and start writing HTML in the left panel. Even just <h1>Hello World</h1> will show you how it works.', tip: '💡 Tip: Start simple and layer complexity. The live preview makes it easy to see what each change does.' },
              { title: 'Add Some Style', desc: 'Drop in CSS between <style> tags to make your page look good. Changes reflect in the visual pane immediately.', tip: null },
              { title: 'Make It Interactive', desc: 'Add JavaScript to create buttons, forms, animations — whatever you want your page to do.', tip: null },
              { title: 'See It All Work', desc: 'Watch the right panel update in real time as you type. No save button needed.', tip: null },
              { title: 'Export When Ready', desc: "Copy your code or download it when you're happy with how everything looks and works.", tip: null },
            ].map((s, i, arr) => (
              <div key={i} className="step-card">
                <div className="step-num-big">{String(i + 1).padStart(2, '0')}</div>
                <div className="step-title">{s.title}</div>
                <p className="step-desc">{s.desc}</p>
                {s.tip && <div className="step-tip">{s.tip}</div>}
                {i < arr.length - 1 && (
                  <div className="step-connector">
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY: Who should use ─── */}
      <section className="section why-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Who It&rsquo;s Built For</div>
            <h2 className="s-title">Who Should Use <span className="blue">This Tool?</span></h2>
          </div>
          <div className="why-grid">
            {[
              { paths: ['M4 19.5A2.5 2.5 0 0 1 6.5 17H20', 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'], title: 'People Learning Web Development', body: 'Perfect for following tutorials, trying examples, or experimenting without setup. Also great for teachers and students who need a shared coding environment for assignments and demos.' },
              { paths: ['M16 18l6-6-6-6', 'M8 6l-6 6 6 6'], title: 'Developers Who Need Quick Tests', body: 'Test a snippet, try a CSS technique, or debug some JavaScript — faster than creating new files or spinning up a local environment.' },
              { paths: ['M3 3h7v7H3z', 'M14 3h7v7h-7z', 'M14 14h7v7h-7z', 'M3 14h7v7H3z'], title: 'Designers Prototyping Ideas', body: 'Sketch layouts, test color systems, and try typography without committing to a full design tool or development setup.' },
              { paths: ['M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7', 'M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'], title: 'Content Creators Adding Custom Code', body: 'Building a custom widget for a blog or landing page? Test it here first before dropping it into your CMS.' },
            ].map((w, i) => (
              <div key={i} className="why-card">
                <div className="why-card-title">
                  <div className="why-card-icon">
                    <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                      {w.paths.map((p, pi) => <path key={pi} d={p} />)}
                    </svg>
                  </div>
                  {w.title}
                </div>
                <p className="why-card-body">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHAT YOU CAN BUILD (features) ─── */}
      <section className="section ratio-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Possibilities</div>
            <h2 className="s-title">What You Can <span className="blue">Build With This Editor</span></h2>
          </div>
          <div className="features-grid">
            {[
              { title: 'Simple Websites & Landing Pages', desc: 'Create pages with headers, navigation, content sections, and footers — all previewed live as you type.', paths: ['M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z', 'M2 12h20', 'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'] },
              { title: 'Interactive Widgets', desc: 'Build calculators, quizzes, carousels, image galleries, and more with instant JavaScript feedback.', paths: ['M13 2L3 14h9l-1 8 10-12h-9l1-8z'] },
              { title: 'CSS Experiments', desc: 'Try new layout techniques, test animations, and explore design systems without a build step.', paths: ['M2 17l10 5 10-5', 'M2 12l10 5 10-5', 'M12 2L2 7l10 5 10-5-10-5z'] },
              { title: 'JavaScript Practice', desc: 'Learn DOM manipulation, events, fetch/API calls, and state patterns with instant feedback.', paths: ['M4 17l6-6-6-6', 'M12 19h8'] },
              { title: 'Email Templates', desc: 'Draft HTML emails and preview their structure before testing in real email clients.', paths: ['M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z', 'M22 6l-10 7L2 6'] },
              { title: 'Docs & Reusable Snippets', desc: 'Format documentation, build reusable component snippets, and copy clean markup straight out.', paths: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M16 13H8', 'M16 17H8', 'M10 9H8'] },
            ].map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    {f.paths.map((p, pi) => <path key={pi} d={p} />)}
                  </svg>
                </div>
                <div className="feature-title">{f.title}</div>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COMMON SCENARIOS (why-grid) ─── */}
      <section className="section why-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Common Scenarios</div>
            <h2 className="s-title">Common Coding <span className="blue">Scenarios This Tool Handles</span></h2>
          </div>
          <div className="why-grid">
            {[
              { title: 'I Want to Try This Tutorial', body: 'Paste examples from any tutorial and see them render immediately — no project setup needed.', paths: ['M5 3l14 9-14 9V3z'] },
              { title: 'Does This CSS Actually Work?', body: 'Test browser compatibility and new techniques in seconds, side by side with your source.', paths: ['M22 11.08V12a10 10 0 1 1-5.93-9.14', 'M22 4L12 14.01l-3-3'] },
              { title: 'I Need to Debug This Code', body: 'Use the live preview and source view together to spot broken markup and styling fast.', paths: ['M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z', 'M21 21l-4.35-4.35'] },
              { title: 'Can I Make This Responsive?', body: 'Preview across widths and tweak your breakpoints confidently before shipping anything.', paths: ['M2 3h20v14H2z', 'M8 21h8', 'M12 17v4'] },
              { title: 'I Want to Learn by Doing', body: 'Write, see, adjust, repeat — the dual-pane loop is the fastest way to actually learn the web.', paths: ['M23 4v6h-6', 'M1 20v-6h6', 'M3.51 9a9 9 0 0 1 14.85-3.36L23 10', 'M1 14l4.64 4.36A9 9 0 0 0 20.49 15'] },
            ].map((w, i) => (
              <div key={i} className="why-card">
                <div className="why-card-title">
                  <div className="why-card-icon">
                    <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                      {w.paths.map((p, pi) => <path key={pi} d={p} />)}
                    </svg>
                  </div>
                  {w.title}
                </div>
                <p className="why-card-body">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BEST PRACTICES (features) ─── */}
      <section className="section comparison-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Best Practices</div>
            <h2 className="s-title">Web Development <span className="blue">Best Practices Built Into the Editor</span></h2>
          </div>
          <div className="features-grid">
            {[
              { tag: 'HTML', title: 'HTML Guidelines', bullets: ['Use semantic tags: header, nav, main, section, article', 'Always include alt text for images', 'Prefer strong/em over b/i for meaning', 'Structure content hierarchically with headings'], paths: ['M16 18l6-6-6-6', 'M8 6l-6 6 6 6'] },
              { tag: 'CSS', title: 'CSS Tips', bullets: ['Use flexbox and grid for modern layouts', 'Keep color contrast readable (4.5:1 minimum)', 'Use CSS variables for consistent theming', 'Make designs responsive with mobile-first approach'], paths: ['M2 17l10 5 10-5', 'M2 12l10 5 10-5', 'M12 2L2 7l10 5 10-5-10-5z'] },
              { tag: 'JS', title: 'JavaScript Best Practices', bullets: ['Use const and let instead of var', 'Add event listeners properly', 'Handle errors gracefully with try-catch', 'Keep functions small and focused'], paths: ['M13 2L3 14h9l-1 8 10-12h-9l1-8z'] },
            ].map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    {f.paths.map((p, pi) => <path key={pi} d={p} />)}
                  </svg>
                </div>
                <div className="feature-title">{f.tag} — {f.title}</div>
                <ul style={{ margin: '0.75rem 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {f.bullets.map((b, bi) => (
                    <li key={bi} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.83rem', color: 'var(--gray-5)', lineHeight: 1.5 }}>
                      <span style={{ color: 'var(--blue)', fontWeight: 700, flexShrink: 0, marginTop: '0.05rem' }}>·</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── GOOD TO KNOW: Mistakes + Privacy + Limitations ─── */}
      <section className="section prose-section alt">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Good to Know</div>
            <h2 className="s-title">What This Tool Helps You <span className="blue">Get Right</span></h2>
          </div>
          <div className="prose-content">
            <h3>Common HTML/CSS/JS Mistakes It Helps You Avoid</h3>
            <ul>
              {[
                ['Forgetting to close HTML tags', 'the live preview shows broken layouts immediately'],
                ['CSS syntax errors', 'you see styles fail to apply in real time'],
                ['JavaScript console errors', 'use your browser dev tools to debug them easily'],
                ['Poor mobile responsiveness', 'test different screen sizes instantly'],
                ['Missing accessibility features', 'practice adding proper labels and alt text'],
                ['Inline styles everywhere', 'learn to separate HTML structure from CSS presentation'],
              ].map(([mistake, fix], i) => (
                <li key={i}><strong>{mistake}</strong> — {fix}.</li>
              ))}
            </ul>

            <div className="prose-callout">
              <div className="prose-callout-title">Privacy &amp; Security</div>
              <p>Everything happens in your browser. We don&rsquo;t store, save, or even see your code. No account required, no tracking, no data collection — and it keeps working offline once the page has loaded.</p>
            </div>

            <h3>Honest Limitations</h3>
            <ul>
              <li><strong>Client-side only:</strong> runs HTML, CSS, and JavaScript — not server-side languages like PHP, Python, or Node.js.</li>
              <li><strong>No file hosting:</strong> you&rsquo;ll need to host finished sites elsewhere.</li>
              <li><strong>Not a full IDE:</strong> for large projects, use tools like VS Code or WebStorm.</li>
            </ul>
            <p>For quick testing, learning, and prototyping, though? This tool is exactly what you need.</p>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="section faq-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">FAQ</div>
            <h2 className="s-title">Frequently Asked <span className="blue">Questions</span></h2>
          </div>
          <div className="faq-list">
            {[
              { q: 'Is this HTML editor really free?', a: 'Yes, completely free. No signup required, no hidden fees, no limitations on usage.' },
              { q: 'Can I use this for professional projects?', a: "Absolutely! It's great for prototyping, testing code snippets, and creating HTML templates for clients." },
              { q: 'Does it work offline?', a: 'Yes, after the page loads, you can continue coding even without an internet connection.' },
              { q: 'Can I save my work?', a: "Your work auto-saves to your browser's local storage. You can also copy or download your code anytime." },
              { q: 'What frameworks and libraries can I use?', a: 'You can include any client-side library via CDN links — Bootstrap, jQuery, React, Vue.js, etc.' },
              { q: 'Is my code private and secure?', a: "Yes, everything runs in your browser. We don't store, transmit, or see your code." },
            ].map((item, i) => (
              <details key={i} className="faq-item">
                <summary>{item.q}</summary>
                <div className="faq-answer">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── RELATED TOOLS ─── */}
      <section className="section related-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow light">More Free Tools</div>
            <h2 className="s-title light">Explore Our Other <span className="blue">SEO Tools</span></h2>
          </div>
          <div className="related-tools-grid">
            {[
              {
                current: true,
                name: 'HTML5 Editor',
                desc: 'Write and test HTML, CSS, and JavaScript with instant live preview.',
                href: '/tools/html-editor/',
                paths: ['M3 3H10V21H3z', 'M14 3H21V21H14z'],
              },
              {
                current: false,
                name: 'Keyword Density Analyzer',
                desc: 'Optimize keyword usage and avoid over-optimization penalties.',
                href: '/tools/keyword-density-analyzer/',
                paths: ['M18 20V10', 'M12 20V4', 'M6 20V14'],
              },
              {
                current: false,
                name: 'Meta Tag Optimizer',
                desc: 'Generate perfect title tags and meta descriptions for better CTR.',
                href: '/tools/meta-tag-optimizer/',
                paths: ['M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z', 'M7 7h.01'],
              },
              {
                current: false,
                name: 'Word Counter',
                desc: 'Count words, characters, and analyze readability of your content.',
                href: '/tools/word-counter/',
                paths: ['M17 10H3', 'M21 6H3', 'M21 14H3', 'M17 18H3'],
              },
              {
                current: false,
                name: 'AI Copywriter',
                desc: 'Create persuasive copy and marketing content with AI assistance.',
                href: '/tools/ai-copywriter/',
                paths: ['M13 2L3 14H12L11 22L21 10H12L13 2z'],
              },
            ].map((tool) => (
              <a key={tool.href} href={tool.href} className={`related-card${tool.current ? ' current' : ''}`}>
                <div className="related-card-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    {tool.paths.map((p, pi) => <path key={pi} d={p} />)}
                  </svg>
                </div>
                <div className="related-card-name">{tool.name}</div>
                <p className="related-card-desc">{tool.desc}</p>
                <div className="related-card-status">
                  <div className="related-card-status-dot" />
                  {tool.current ? 'CURRENT TOOL' : 'FREE TOOL'}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <div className="final-cta">
        <div className="final-cta-bg" />
        <div className="final-cta-inner">
          <h2 className="final-cta-title">Start <span>Coding Right Now</span></h2>
          <p className="final-cta-sub">Whether a beginner or a seasoned developer, the SEOShouts HTML5 Online Editor gives you a fast, focused space to write, test, and perfect your web code. No setup. No downloads. No complications. Just open, code, and create.</p>
          <div className="final-cta-row">
            <a href="#top" className="btn-primary">🚀 Open the HTML5 Editor</a>
            <a href="/tools/" className="btn-outline">Browse All SEO Tools</a>
          </div>
          <div className="final-cta-pills">
            <span className="final-pill">100% Free Forever</span>
            <span className="final-pill">No Signup Required</span>
            <span className="final-pill">Works in Your Browser</span>
          </div>
        </div>
      </div>
    </>
  );
}
