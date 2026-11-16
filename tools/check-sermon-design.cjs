#!/usr/bin/env node
/** 부흥프로젝트 50편 설계 무결성 검사. Node.js 기본 모듈만 사용. */
'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'..');
function read(p){return fs.readFileSync(path.join(root,p),'utf8')}
function fail(message){console.error('FAIL:',message);process.exitCode=1}
function run(source,context,file){vm.runInNewContext(source,context,{filename:file,timeout:5000})}
const context={window:{}};
const src='data/sermon-series-data.js';
if(!fs.existsSync(path.join(root,src))){
  console.log('원본 '+src+'이 이 패키지에는 포함되지 않았습니다.');
  console.log('사용자가 패키지 파일을 GitHub의 기존 저장소에 업로드한 후 그 저장소에서 이 검사를 실행하십시오.');
  process.exit(0);
}
run(read(src),context,src);
run(read('data/sermon-design-revision.js'),context,'data/sermon-design-revision.js');
let sermons=context.window.SERMON_SERIES_DATA?.sermons||[];
if(sermons.length!==50)fail('기본 회차는 50편이어야 합니다. 실제: '+sermons.length);
const byNumber=new Map(sermons.map(s=>[s.order,s]));
const expected={16:['요일 4:7–12','먼저 사랑하신 하나님과 그 사랑으로 살아가는 교회'],23:['딛 2:11–14','구원하시고 거룩한 삶을 가르치시는 하나님의 은혜'],25:['시 27:1–6','우리가 바라보고 기뻐하는 하나님의 아름다우심'],48:['행 12:1–24','박해받는 교회 가운데 자신의 뜻을 이루시는 하나님']};
for(const [id,[text,title]] of Object.entries(expected)){
  const s=byNumber.get(+id);
  if(!s||s.primaryText!==text||s.title!==title) fail('제'+id+'회 수정안 불일치');
}
if(byNumber.get(25)?.topic!=='아름다우심·완전하신 탁월함')fail('제25회 중심 성품 반영 실패');
let attrs=new Set(sermons.map(s=>s.designAudit?.canonicalTopic||s.topic));
if(attrs.size!==26)fail('중심 성품 종류 26개가 아님: '+attrs.size);
const groups={A:0,B:0,C:0}; for(const s of sermons){const k=s.sermonId?.slice(0,1);if(k in groups)groups[k]++;}
if(groups.A!==16||groups.B!==12||groups.C!==22)fail('A/B/C 그룹 분포 오류: '+JSON.stringify(groups));
const refs=new Map();
for(const s of sermons){
  if(!s.designAudit?.focus||!s.designAudit?.avoidOverlap)fail('제'+s.order+'회 차별화 연구카드 누락');
  if(!s.mainStatement||!s.primaryRefs?.length||!s.outline?.length)fail('제'+s.order+'회 핵심문장·주본문·아웃라인 누락');
  const p=s.primaryText;
  if(refs.has(p))fail('중복 주본문: '+p+' (제'+refs.get(p)+'회/제'+s.order+'회)');
  else refs.set(p,s.order);
}
if(!fs.existsSync(path.join(root,'docs/sermon-design-handoff.md')))fail('매회 수정해야 할 인계문서 누락');
const arg=process.argv.indexOf('--sermon');
if(arg!==-1){
  const id=Number(process.argv[arg+1]),s=byNumber.get(id);
  if(!s)fail('조회할 설교 회차가 없음: '+id);
  else {
    console.log(`제${id}회 | ${s.title} | ${s.primaryText}`);
    console.log('핵심 논증:',s.designAudit.focus);
    console.log('중복 금지:',s.designAudit.avoidOverlap);
    console.log('이번 원고의 본문·주석·정경 연결·독자적 절정·사용자 승인·아웃라인·인계 갱신을 확인하십시오.');
  }
}
if(!process.exitCode)console.log('PASS: 기본 50회·26개 성품·4개 승인 변경·고유 주본문·50개 연구카드·인계문서 확인.');
