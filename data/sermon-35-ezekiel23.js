/* 부흥프로젝트 하나님의 성품 설교 제35회 — 에스겔 23장 및 24:13 추가
 * 기존 50편 목록·다른 설교 데이터·완성 원고·음성 낭독은 수정하지 않습니다.
 * 반드시 sermon-series-data.js 뒤, sermon-detail-ui.js 앞에서 로드합니다.
 */
(function () {
  'use strict';
  const sermons = window.SERMON_SERIES_DATA && window.SERMON_SERIES_DATA.sermons;
  if (!Array.isArray(sermons)) return;
  const sermon = sermons.find(function (s) { return Number(s.order) === 35; });
  if (!sermon) return;

  sermon.topic = '거룩한 질투·영광의 배타성';
  sermon.primaryText = '신 4:23–31; 겔 23장';
  sermon.secondaryText = '출 34:14';
  sermon.otherTexts = '겔 23:1–4, 11–21, 22–35, 36–49; 겔 24:13; 출 34:14';
  sermon.question = '언약을 배반한 백성을 향한 하나님의 질투는 왜 거룩하며, 그 심판 가운데서 우리는 어떤 소망을 바라보아야 합니까?';
  sermon.mainStatement = '하나님께서는 오직 자신만이 받으셔야 할 경배를 우상에게 돌리는 언약적 배신을 거룩하게 질투하시며 의롭게 심판하십니다. 그러면서도 돌이켜 자신을 찾는 백성에게 언약의 자비를 베푸시는 신실하신 주님이십니다.';
  sermon.themeParagraph = '신명기 4:23–31은 하나님과 맺은 언약을 잊고 우상을 섬기는 죄가 심판을 부른다는 사실과, 환난 중에도 여호와께 돌아오는 백성을 버리지 않으시는 하나님의 자비를 함께 증언합니다. 에스겔 23장은 오홀라와 오홀리바, 곧 사마리아와 예루살렘의 비유를 통해 이스라엘과 유다의 우상숭배와 불의한 동맹을 언약적 배신으로 고발합니다. 이어지는 에스겔 24:13은 하나님께서 정결하게 하셨으나 깨끗해지지 않은 예루살렘을 향해 진노의 심판을 선언함으로써 회개하지 않는 완고함의 심각성을 드러냅니다. 이 심판은 하나님께서 불안하거나 시기심에 휘둘리신다는 뜻이 아닙니다. 유일하신 하나님께 드려야 할 경배를 빼앗아 피조물에게 돌리는 일이 얼마나 심각한 죄인지를 보여 줍니다. 그러나 신명기의 언약적 경고와 자비의 약속을 함께 읽을 때, 거룩한 질투와 자비를 서로 대립시키지 않고 하나님의 신실하심 안에서 이해할 수 있습니다. 에스겔 23장 자체의 직접적인 강조는 심판이며, 회복의 소망은 신명기 4:29–31과 에스겔서의 더 넓은 문맥을 통해 구별하여 설명해야 합니다.';
  sermon.thesisFocus = '신명기 4장에 나타난 언약적 경고·긍휼과 에스겔 23장에 나타난 언약적 배신·공의로운 심판 및 에스겔 24:13의 정결 거부을 함께 살펴, 하나님의 거룩한 질투를 그의 유일성·공의·신실하심에 연결한다.';
  sermon.climax = '우상숭배를 향한 하나님의 거룩한 질투는 이기적인 감정이 아니라 유일하신 주님의 영광과 언약의 진실함에서 비롯됩니다. 그러므로 교회는 우상을 변명하지 않고 자신의 죄를 회개하며, 그리스도의 은혜를 의지하여 오직 하나님을 사랑하고 경배해야 합니다.';
  sermon.caution = '에스겔 23장의 성적 비유와 폭력적인 심판 묘사는 역사적·예언자적 문맥 안에서 신중히 해석하며 선정적으로 재현하지 않는다. 본문의 심판을 오늘날 개인의 특정 고난에 기계적으로 적용하지 않는다. 에스겔 23장 자체에 없는 회복 약속을 그 장의 결론이라고 주장하지 않는다.';
  sermon.argumentPath = '신명기 4장은 언약 백성에게 우상숭배의 심각성과 흩어짐의 심판을 경고합니다. 에스겔 23장은 그 경고가 이스라엘과 유다의 역사에서 어떻게 현실화되었는지를 예언자의 고발로 보여 줍니다. 오홀라와 오홀리바에 대한 비유는 정치적 의존과 우상숭배를 단순한 실수가 아니라 유일하신 하나님과의 언약을 배반하는 일로 드러냅니다. 하나님의 질투는 인간의 불안한 소유욕이 아니라 참 하나님께 마땅히 돌아가야 할 영광을 지키시는 거룩한 열심입니다. 에스겔 24:13에 나타난 정결 거부와 심판의 필연성을 살핀 후, 신명기 4:29–31에서 환난 중에 여호와께 돌아오도록 부르시는 자비와 언약의 신실하심을 보아야 합니다. 설교는 그리스도 안에서 우상숭배의 죄를 회개하고 하나님만을 사랑하며 경배하는 교회의 삶으로 나아갑니다.';
  sermon.outline = [
    {title:'1. 하나님께서는 언약 백성의 우상숭배를 거룩하게 질투하십니다',content:'신 4:23–24; 출 34:14 — 질투를 인간적 불안이나 변덕과 구별하고, 오직 하나님께 드릴 예배의 배타성을 설명합니다.'},
    {title:'2. 오홀라와 오홀리바의 이야기는 언약 배신의 심각성을 드러냅니다',content:'겔 23:1–21 — 사마리아와 예루살렘의 우상숭배와 잘못된 의존을 예언자적 비유의 문맥에서 살핍니다.'},
    {title:'3. 하나님께서는 배반의 죄를 의롭게 심판하십니다',content:'겔 23:22–49; 겔 24:13; 신 4:25–28 — 정결하게 하시는 말씀을 거부한 완고함과 심판의 엄중함을 설명하되 선정적 장면이나 잔혹한 묘사를 과장하지 않습니다.'},
    {title:'4. 환난 가운데 여호와를 다시 찾도록 부르십니다',content:'신 4:29–31 — 에스겔 23장의 심판 선언과 구별하여, 신명기의 돌이킴과 하나님의 언약적 자비를 강조합니다.'},
    {title:'결론 — 유일하신 하나님만 사랑하고 경배하는 교회',content:'하나님의 거룩한 질투를 인정하고 자신의 우상을 회개하며, 그리스도의 은혜로 하나님께만 영광을 돌리는 신앙을 적용합니다.'}
  ];
  sermon.checkNote = '제35회 공동 주본문에 에스겔 23장, 중요 보조본문에 에스겔 24:13을 추가하였습니다. 신명기 4장의 언약적 자비와 에스겔 23–24장의 정결 거부 및 심판 선언을 구별했습니다.';
  sermon.reviewIssue = '에스겔 23장 성적 비유의 목회적 전달 방식, 우상숭배와 정치 동맹의 역사적 배경, 겔 24:13의 정결·진노 언어와 문맥, 그리스도 중심 적용은 원고 작성 시 원전 주해로 검증합니다.';
  sermon.prepCheck = '겔 23장의 오홀라/오홀리바 대응 관계·심판 문맥, 겔 24:13의 정결 거부와 심판, 신 4:29–31의 언약적 자비 및 출 34:14의 하나님의 질투를 검증합니다.';

  // 에스겔 24:13은 23장 전체와 별도로 연결하는 중요 보조본문입니다.
  const cleansingRef = {
    book:'에스겔',abbr:'겔',file:'Ezekiel',chapter:24,
    parts:[{startChapter:24,startVerse:13,endChapter:24,endVerse:13}],
    text:'겔 24:13',kind:'중요 보조본문'
  };
  const ezek = {
    book:'에스겔',abbr:'겔',file:'Ezekiel',chapter:23,
    parts:[{startChapter:23,startVerse:1,endChapter:23,endVerse:49}],
    text:'겔 23장',kind:'공동 주본문'
  };
  sermon.primaryRefs = Array.isArray(sermon.primaryRefs) ? sermon.primaryRefs : [];
  if (!sermon.primaryRefs.some(function(r){return r.file === 'Ezekiel' && r.chapter === 23;})) sermon.primaryRefs.push(ezek);
  sermon.extraRefs = Array.isArray(sermon.extraRefs) ? sermon.extraRefs : [];
  if (!sermon.extraRefs.some(function(r){return r.file === 'Ezekiel' && r.chapter === 23;})) {
    sermon.extraRefs.push({
      book:'에스겔',abbr:'겔',file:'Ezekiel',chapter:23,
      parts:[{startChapter:23,startVerse:35,endChapter:23,endVerse:35}],
      text:'겔 23:35',kind:'보조본문'
    });
    sermon.extraRefs.push({
      book:'에스겔',abbr:'겔',file:'Ezekiel',chapter:23,
      parts:[{startChapter:23,startVerse:49,endChapter:23,endVerse:49}],
      text:'겔 23:49',kind:'보조본문'
    });
  }
  if (!sermon.extraRefs.some(function(r){return r.file === 'Ezekiel' && (r.parts||[]).some(function(p){return p.startChapter===24 && p.startVerse===13;});})) sermon.extraRefs.push(cleansingRef);
})();
