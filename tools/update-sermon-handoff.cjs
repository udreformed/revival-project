#!/usr/bin/env node
/** Append a date-stamped, user-reviewable handoff entry after every sermon work session. */
'use strict';
const fs=require('fs'),path=require('path');
function arg(n){const i=process.argv.indexOf(n);return i<0?'':String(process.argv[i+1]||'')}
const num=Number(arg('--sermon'));
const status=arg('--status').trim();
const remaining=arg('--remaining').trim();
const date=arg('--date')||new Date().toISOString().slice(0,10);
if(!Number.isInteger(num)||num<1||num>51||!status||!remaining){
 console.error('예: node tools/update-sermon-handoff.cjs --sermon 6 --status "본문 주해 1차" --remaining "주석 원어 비교" --date 2026-11-16');
 process.exit(2);
}
for(const val of [status,remaining,date]) if(/[\r\n|]/.test(val)){console.error('표 내용에 | 또는 줄바꿈을 사용하지 마십시오.');process.exit(2)}
const file=path.resolve(__dirname,'../docs/sermon-design-handoff.md');
let txt=fs.readFileSync(file,'utf8');
const label='## 8. 설교 진행 이력';
const at=txt.indexOf(label);
if(at<0)throw new Error('인계문서에서 진행 이력 영역을 찾지 못했습니다.');
const next=txt.indexOf('\n## ',at+label.length);
const stop=next<0?txt.length:next;
const fragment=txt.slice(at,stop);
const rows=fragment.match(/\| 202\d-\d\d-\d\d \|/g)||[];
const entry=`| ${date} | ${String(num).padStart(2,'0')} | ${status} | ${remaining} |\n`;
const put=fragment.lastIndexOf('\n|');
if(put<0)throw new Error('인계문서의 진행 이력 표를 찾지 못했습니다.');
const lineEnd=fragment.indexOf('\n',put+1);
const insertAt=at+(lineEnd<0?fragment.length:lineEnd+1);
txt=txt.slice(0,insertAt)+entry+txt.slice(insertAt);
fs.writeFileSync(file,txt,'utf8');
console.log('인계문서 진행 이력 추가:',entry.trim());
console.log('주의: 이 작업은 원고 승인이나 성경 주석 검수를 자동으로 수행하지 않습니다.');
