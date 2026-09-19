update public.categories
set
  title = '艺术定制',
  english_title = 'ART CUSTOMIZATION',
  summary = '艺术定制内容方向。',
  updated_at = now()
where slug = 'qingwa-art';
