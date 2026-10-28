#!/usr/bin/env python3
"""Use on a fresh local clone of udreformed/revival-project. Does not push."""
from pathlib import Path
import shutil,sys
root=Path(sys.argv[1]).expanduser().resolve() if len(sys.argv)>1 else Path.cwd().resolve()
source=Path(__file__).resolve().parent/'data'/'sermon-03-content.js'
new=root/'data'/'sermon-03-content.js'
assert (root/'data'/'sermon-02-content.js').is_file(), 'Not the right repository root'
if new.exists():
    assert new.read_bytes()==source.read_bytes(), 'Existing sermon-03-content.js differs: refusing to overwrite'
else:
    shutil.copy2(source,new)
for file,anchor in [
 ('index.html','<script src="data/sermon-02-content.js'),
 ('sermon-detail.html','<script src="data/sermon-research-sources.js')]:
    dest=root/file
    text=dest.read_text(encoding='utf-8')
    tag='<script src="data/sermon-03-content.js?v=20261028-final-v1"></script>'
    if tag in text:
        print('Already present:',file)
        continue
    lines=text.splitlines(keepends=True)
    matches=[i for i,l in enumerate(lines) if anchor in l]
    assert len(matches)==1, f'{file}: expected exactly one anchor, got {len(matches)}'
    i=matches[0]
    assert '</script>' in lines[i], f'{file}: anchor script spans multiple lines; modify manually'
    # The homepage may have adjacent script tags on one line. Insert after the matching closing tag.
    j=lines[i].index('</script>',lines[i].index(anchor))+len('</script>')
    line=lines[i]
    lines[i]=line[:j]+'\n'+tag+line[j:]
    dest.write_text(''.join(lines),encoding='utf-8')
    print('Patched:',file)
print('Review git diff and push on main yourself.')
