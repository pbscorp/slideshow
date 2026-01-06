function escapeHTML(htmlStr) {
  return htmlStr.replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#39;");
}

function unescapeHTML(escapedStr) {
  return escapedStr.replace(/&amp;/g, "&")
                   .replace(/&lt;/g, "<")
                   .replace(/&gt;/g, ">")
                   .replace(/&quot;/g, "\"")
                   .replace(/&#39;/g, "'");
}

function sanitizeHTML(str) {
  // Allowed tags (no attributes)
  const allowed = ['b','i','u','em','strong','p','br','ul','ol','li'];

  // First, remove dangerous tags *and their content entirely*
  const removeContentTags = ['script', 'style', 'iframe', 'object'];
  removeContentTags.forEach(tag => {
    const pattern = new RegExp(`<${tag}[^>]*>[\\s\\S]*?<\\/${tag}>`, 'gi');
    str = str.replace(pattern, '');
  });

  // Then strip/clean any remaining tags
  return str.replace(/<\/?([a-zA-Z0-9]+)(?:\s[^>]*)?>/g, (match, tag) => {
    tag = tag.toLowerCase();
    if (allowed.includes(tag)) {
      // keep clean open/close tags without attributes
      return match.startsWith('</') ? `</${tag}>` : `<${tag}>`;
    }
    // drop the tag completely (but leave inner text)
    return '';
  });
}