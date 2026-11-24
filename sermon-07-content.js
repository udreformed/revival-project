/* 제7회 상세페이지 통합 완성본 · 기존 다른 회차 코드는 변경하지 않습니다. */
(function(){
  'use strict';
  const sermon = window.SERMON_SERIES_DATA?.sermons?.find(x => x.order === 7);
  if (!sermon) return;
  const patch = {"title":"공의로 구원하시는 하나님","hookTitle":"공의로 구원하시는 하나님","status":"확정편","statusNote":"제7회 최종 원고 게시 · 강단용 상세 아웃라인·주해·조직신학·원고 음성 지원","draft":false,"manuscriptFinalized":true,"topic":"의로우심·공의","question":"하나님의 공의로운 심판을 받아야 할 죄인인 우리가 어떻게 그분의 공의로 구원받고, 그 공의를 사랑하며 찬양할 수 있습니까?","mainStatement":"하나님께서는 자기 백성의 죄를 의롭게 심판하시면서도 오래 참으셨고, 그리스도의 완전한 대속으로 자신의 공의를 충분히 나타내시며 죄인을 구원하셨습니다. 그리스도 안에서 하나님과 화목하게 된 성도는 이제 의로우신 하나님 자신을 사랑하며 그분의 공의를 찬양하고 갈망합니다.","themeParagraph":"로마서 3:25–26은 하나님께서 이전에 지은 죄를 오래 참으시며 간과하셨지만 그리스도의 피로 자신의 의로우심을 나타내셨다고 선언합니다. 이사야 1장과 42장은 하나님께서 이스라엘 자신의 죄를 의롭게 심판하셨으나 그들을 완전히 멸절하지는 않으셨음을 보여 줍니다. 하나님은 불의를 제거하고 공의로운 구속을 약속하셨습니다(사 1:25–27). 죄 없는 여호와의 종은 죄인의 죄책을 대신 담당하셨으며(사 53:5–6, 10–11), 그리스도의 대속 안에서 하나님은 공의를 포기하지 않으시고 죄인을 의롭게 구원하셨습니다. 성령으로 새롭게 된 성도는 구원의 유익을 넘어 의로우신 하나님 자신을 사랑하고, 그분의 공의가 온전히 나타나기를 갈망하며, 계시록 19장의 찬양에 동참할 소망을 품습니다.","thesisFocus":"하나님의 공의 자체와 죄인을 향한 역사적 심판, 그리스도께서 만족시키신 형벌적 공의, 그 하나님을 사랑하게 된 성도의 경배에 집중한다. 남은 자 사상은 독립 주제로 다루지 않고, 출애굽기 34장과 마태복음 5:6은 인용하지 않는다.","argumentPath":"로마서 3:25–26의 오래 참으심과 하나님의 의 → 이사야 1:21–24의 자기 백성 죄에 대한 심판 → 이사야 42:24–25의 역사적 심판 → 이사야 1:9의 보존과 1:25–27의 공의로운 회복 → 이사야 53:5–6, 10–11의 의로운 종의 대속 → 로마서 3:25–26의 공의와 칭의 → 의로우신 하나님 자신의 탁월함과 성령으로 변화된 성도의 사랑 → 계시록 19:1–4의 찬양.","climax":"죄인을 심판하시는 하나님의 공의가 그리스도의 대속을 통해 죄인의 구원을 위한 의로운 근거가 되었습니다. 하나님의 공의는 구원을 위해 포기된 것이 아니라, 그리스도의 십자가에서 충분히 만족되었기에 죄인의 구원 자체가 하나님 공의의 영광을 증언합니다.","caution":"이사야 1:27의 정의로운 시온의 구속을 본래 문맥에서 바로 형벌대속과 동일시하지 않는다. 이스라엘의 역사적 심판이 부당했다거나, 그리스도께서 단지 동일한 역사적 고통을 더 많이 겪으셨다는 뜻으로 설명하지 않는다. 그리스도의 충분한 대속과 계시록 19장의 최종 심판을 구분한다. 남은 자 사상, 출애굽기 34장, 마태복음 5:6을 설교에 추가하지 않는다.","primaryText":"사 1:21–28","secondaryText":"롬 3:25–26; 사 1:9; 사 42:18–25; 사 53:4–6, 10–11; 계 19:1–4","otherTexts":"—","primaryRefs":[{"book":"이사야","abbr":"사","file":"Isaiah","chapter":1,"parts":[{"startChapter":1,"startVerse":21,"endChapter":1,"endVerse":28}],"text":"사 1:21–28"}],"extraRefs":[{"book":"로마서","abbr":"롬","file":"Romans","chapter":3,"parts":[{"startChapter":3,"startVerse":25,"endChapter":3,"endVerse":26}],"text":"롬 3:25–26","kind":"서론·복음의 핵심"},{"book":"이사야","abbr":"사","file":"Isaiah","chapter":1,"parts":[{"startChapter":1,"startVerse":9,"endChapter":1,"endVerse":9}],"text":"사 1:9","kind":"보조본문"},{"book":"이사야","abbr":"사","file":"Isaiah","chapter":42,"parts":[{"startChapter":42,"startVerse":18,"endChapter":42,"endVerse":25}],"text":"사 42:18–25","kind":"보조본문"},{"book":"이사야","abbr":"사","file":"Isaiah","chapter":53,"parts":[{"startChapter":53,"startVerse":4,"endChapter":53,"endVerse":6}],"text":"사 53:4–6","kind":"보조본문"},{"book":"이사야","abbr":"사","file":"Isaiah","chapter":53,"parts":[{"startChapter":53,"startVerse":10,"endChapter":53,"endVerse":11}],"text":"사 53:10–11","kind":"보조본문"},{"book":"요한계시록","abbr":"계","file":"Revelation","chapter":19,"parts":[{"startChapter":19,"startVerse":1,"endChapter":19,"endVerse":4}],"text":"계 19:1–4","kind":"결론본문"}],"outline":[{"title":"서론 · 하나님의 공의는 어떻게 죄인의 구원이 되었습니까?","content":"오래 참으시는 하나님과 공의의 질문 — 로마서 3:25–26"},{"title":"1 · 하나님께서는 죄를 심판하시면서도 자기 백성을 오래 참으셨습니다","content":"자기 백성의 죄에 대한 실제 심판과 멸절하지 않으신 오래 참으심 — 이사야 1장·42장"},{"title":"2 · 하나님께서는 그리스도의 십자가에서 자신의 공의를 온전히 나타내시며 죄인을 구원하셨습니다","content":"의로운 종의 대속에서 나타나고 만족된 공의, 죄인에게 주어진 구원 — 이사야 53장·로마서 3장"},{"title":"결론 · 죄인인 우리가 어떻게 하나님의 공의를 찬양하게 되었습니까?","content":"하나님의 공의 자체를 사랑하는 성도와 마지막 날의 찬양 — 요한계시록 19장"}],"detailedOutlineHtml":"<h3>서론 — 하나님의 공의는 어떻게 죄인의 구원이 되었습니까?</h3>\n<p>출발 본문: 로마서 3:25–26 · 핵심 논제는 죄를 오래 참으신 하나님의 공의가 그리스도 안에서 어떻게 나타났는가입니다.</p>\n<ul>\n<li><strong>문제의 제기(롬 3:25)</strong> — 하나님께서는 오래 참으시는 중에 이전의 죄를 간과하셨습니다. 죄를 용서하기 위해 죄의 사실과 책임 자체를 부정하신 것이 아닙니다.</li>\n<li><strong>공의의 의미</strong> — 의로우신 하나님은 모든 판단과 행동에서 진실하시며 불의를 용납하지 않으십니다. 공의는 단순한 형벌의 엄격함보다 넓은 하나님의 완전한 성품입니다.</li>\n<li><strong>첫 질문</strong> — 왜 하나님께서는 죄인들을 곧바로 멸절하지 않고 오래 참으셨습니까? 어떻게 그 의로우심을 나타내십니까?</li>\n<li><strong>끝까지 품을 질문</strong> — 하나님의 공의로운 판단을 받아야 하는 사람이 어떻게 그 공의를 사랑하고 찬양할 수 있습니까?</li>\n</ul>\n<h3>1. 하나님께서는 죄를 심판하시면서도 자기 백성을 오래 참으셨습니다</h3>\n<p>하나님의 역사적 심판은 참되고 의로웠습니다. 동시에 하나님께서는 이스라엘을 전멸시키지 않고 오래 참으셨습니다.</p>\n<ul>\n<li><strong>죄의 구체적인 모습(사 1:21–23)</strong> — 신실한 성읍의 변질, 정의와 공의의 실종, 뇌물과 부패, 고아·과부에 대한 불의. 언약 백성의 죄라는 이유로 면책되지 않습니다.</li>\n<li><strong>의로운 재판장이신 하나님(사 1:24)</strong> — 주권자·만군의 여호와·이스라엘의 전능자께서 자기 백성 가운데 있는 악을 대적으로 판결하십니다.</li>\n<li><strong>역사 속의 실제 심판(사 42:18–25)</strong> — 눈멀고 귀먹은 종 이스라엘에게 닥친 약탈과 재난의 배후에 그들의 죄에 대한 하나님의 의로운 판단이 있음을 드러냅니다.</li>\n<li><strong>심판 가운데 보존(사 1:9)</strong> — 하나님께서 생존자를 보존하지 않으셨다면 소돔과 고모라처럼 되었을 것입니다. 독립적인 남은 자 교리 설명 대신 심판 속 긍휼과 오래 참으심을 증언하는 보조 본문으로 사용합니다.</li>\n<li><strong>정의로운 회복(사 1:25–27)</strong> — 불순물을 제거하심과 재판관의 회복, 정의로 구속받는 시온. 이 구절을 직접적으로 그리스도의 형벌대속을 뜻한다고 읽지 않습니다.</li>\n<li><strong>필수 구별</strong> — 역사적 심판이 부당하거나 불완전하게 시행된 것은 아닙니다. 다만 모든 죄인을 최종적으로 멸절시키는 심판이 당시 집행된 것은 아니며, 그 고난 자체로 죄책의 속죄가 완성되지 않았습니다.</li>\n</ul>\n<h3>2. 하나님께서는 그리스도의 십자가에서 자신의 공의를 온전히 나타내시며 죄인을 구원하셨습니다</h3>\n<p>여호와의 의로운 종이 죄인의 죄책을 대신 담당하셨으며, 로마서 3장의 복음이 그 대속에서 드러난 하나님의 의로우심을 명백히 선언합니다.</p>\n<ul>\n<li><strong>종들의 대조(사 42:18–25; 53:11)</strong> — 불순종하는 이스라엘과 의로운 종을 대조하여, 왜 죄인이 아닌 대표자·중보자의 사역이 필요한지 설명합니다.</li>\n<li><strong>형벌대속의 핵심(사 53:5–6)</strong> — 그분이 상함과 징계를 받으신 원인은 우리의 허물과 죄악입니다. 여호와께서 그 죄악을 그에게 담당시키셨습니다.</li>\n<li><strong>죄책 해결과 의롭게 하심(사 53:10–11)</strong> — 속건제물과 의로운 종이 많은 사람을 의롭게 한다는 표현을 짧게 소개합니다. 53장 전체의 논쟁적 세부를 장시간 다루지 않습니다.</li>\n<li><strong>복음의 대답(롬 3:25–26)</strong> — 그리스도의 피에서 하나님께서 의로우시면서도 믿는 죄인을 의롭다 하시는 분임을 나타내십니다.</li>\n<li><strong>조직신학적 정리</strong> — 그리스도의 충분한 만족은 공의를 포기하는 사면이 아닙니다. 신앙고백 제11장 3항처럼 하나님의 엄정한 공의와 풍성한 은혜가 함께 영광을 받습니다.</li>\n<li><strong>핵심 절정</strong> — 십자가는 하나님의 공의를 손상시키는 예외가 아니라, 죄인의 구원을 이루면서 공의를 영광스럽게 나타내는 사건입니다.</li>\n</ul>\n<h3>결론 — 죄인인 우리가 어떻게 하나님의 공의를 찬양하게 되었습니까?</h3>\n<p>구원의 최종적인 복은 하나님 자신과 화목하여 그분의 의로우심을 사랑하고 기뻐하는 것입니다. 성도의 갈망은 요한계시록 19장의 찬양으로 나아갑니다.</p>\n<ul>\n<li><strong>공의 자체의 탁월함</strong> — 하나님은 참되고 의로우시며 거짓과 편파성이 없고 악을 악으로 판단하십니다. 이는 형벌을 넘어서 그분의 온전한 성품을 말합니다.</li>\n<li><strong>왜 죄인이 그 공의를 사랑하게 되는가</strong> — 그리스도의 대속으로 하나님과 화목했으며, 그 구원의 최고의 복은 의로우신 하나님 자신을 알고 사랑하는 데 있습니다.</li>\n<li><strong>성령의 열매</strong> — 성도는 여전히 죄와 싸우면서도 자기 죄를 인정하고 의로운 삶을 사모합니다. 다른 사람을 심판하는 즐거움이 아니라 하나님의 뜻을 사랑하는 마음입니다.</li>\n<li><strong>종말론적 경배(계 19:1–4)</strong> — 바벨론에 대한 의로운 최종 심판을 하늘의 무리가 찬양합니다. 십자가의 속죄와 바벨론의 심판을 같은 사건으로 혼동하지 않습니다.</li>\n<li><strong>마지막 선포</strong> — 본래 심판받을 죄인이 그리스도 안에서 하나님의 공의를 찬양하는 성도가 되었습니다. 의로우신 하나님 자신께 영광을 돌립니다.</li>\n</ul>","manuscriptHtml":"<h3>서론 — 하나님의 공의는 어떻게 죄인의 구원이 되었습니까?</h3>\n<p>로마서 3장 25절과 26절에서 사도 바울은 하나님의 의로우심에 관한 놀라운 사실을 선언합니다. 하나님께서는 오래 참으시는 가운데 이전에 지은 죄들을 간과하셨으며, 이제 예수 그리스도를 통해 자신의 의로우심을 나타내셨다는 것입니다. 그리하여 하나님은 자신도 의로우시며 예수 그리스도를 믿는 자를 의롭다 하시는 분임을 나타내셨습니다.</p>\n<p>이 말씀에는 우리가 깊이 생각해야 할 질문이 있습니다. 하나님께서는 완전히 의로우신 분이십니다. 그분은 불의를 미워하시며 모든 죄를 의롭게 판단하십니다. 그런데 하나님께서는 죄인들을 즉시 멸하지 않으셨습니다. 오래 참으셨고, 그들에게 살아갈 날들을 허락하셨습니다. 그렇다면 하나님께서는 그들의 죄를 가볍게 여기셨던 것입니까? 죄인들을 구원하시기 위해 자신의 공의를 잠시 내려놓으셨던 것입니까?</p>\n<p>그렇지 않습니다. 바울은 하나님께서 예수 그리스도의 십자가에서 자신의 의로우심을 나타내셨다고 말씀합니다. 하나님께서는 자신의 공의를 포기하지 않으시면서 죄인을 구원하셨습니다. 더욱 놀라운 사실은, <strong>죄인을 심판하시는 바로 그 공의가 그리스도의 대속을 통해 죄인을 구원하는 의로운 근거가 되었다는 것입니다.</strong></p>\n<p>우리는 이 사실을 이스라엘의 역사 속에서 살펴보려고 합니다. 하나님께서는 이스라엘의 죄를 심판하셨습니다. 그러나 그들을 완전히 멸절하지 않으셨습니다. 그들에게 오래 참으심과 긍휼을 베푸셨습니다. 그리고 마침내 그리스도의 십자가에서 죄에 대한 완전한 대속을 이루시며 자신의 공의를 나타내셨습니다.</p>\n<p>그런데 여기에는 또 하나의 놀라운 질문이 있습니다. <strong>하나님의 공의로운 심판을 받아야 할 죄인인 우리가 어떻게 그분의 공의를 사랑하고 찬양하며, 그 공의가 온전히 나타나기를 갈망할 수 있겠습니까?</strong> 오늘 우리는 이 질문의 답을 함께 살펴보겠습니다.</p>\n<h3>1. 하나님께서는 죄를 심판하시면서도 자기 백성을 오래 참으셨습니다</h3>\n<p>이사야 1장은 죄로 부패한 이스라엘의 모습을 보여 줍니다. 하나님께서는 이스라엘을 자신의 백성으로 삼으셨습니다. 그들에게 말씀을 주시고 자신의 의로우신 뜻을 알게 하셨습니다. 이스라엘은 하나님이 어떤 분이신지를 세상 가운데 나타내야 할 백성이었습니다. 그러나 그들의 모습은 하나님의 의로우심과 너무나 달랐습니다.</p>\n<p>이사야 1장 21절에서 선지자는 한때 정의와 공의가 거하던 예루살렘이 불의한 성읍이 되었다고 탄식합니다. 지도자들은 뇌물을 사랑하고 자기 이익을 위해 악한 사람들과 손을 잡았습니다. 고아와 과부처럼 보호받아야 할 사람들의 억울함은 외면당했습니다. 이스라엘은 하나님의 백성이었지만, 그들의 삶은 하나님께서 의롭다고 말씀하시는 것과 정반대였습니다.</p>\n<p>여기서 우리는 하나님의 공의로운 성품이 무엇인지를 생각해야 합니다. 하나님의 공의는 단지 잘못한 사람에게 벌을 내리시는 엄격함만을 의미하지 않습니다. 하나님께서는 본질적으로 의로우십니다. 그분의 모든 뜻과 판단과 행동은 언제나 참되고 올바릅니다. 하나님께는 거짓이나 편파성이 없으며, 그분은 악을 선이라고 부르지 않으십니다.</p>\n<p>사람들은 자신의 이익과 감정에 따라 판단을 달리합니다. 사랑하는 사람의 잘못은 감싸고, 미워하는 사람에게는 더 엄격해지기도 합니다. 그러나 하나님의 공의는 그렇지 않습니다. 그분은 언제나 의로우십니다. 무엇이 옳고 그른지는 인간의 이해관계가 아니라 하나님의 완전하고 거룩한 성품에 의해 결정됩니다. 그렇기 때문에 하나님께서는 자기 백성의 죄도 심판하십니다.</p>\n<p>이사야 1장 24절에서 하나님께서는 자신을 만군의 여호와, 이스라엘의 전능자로 선포하시며 자신의 대적에게 보응하겠다고 말씀하십니다. 그런데 여기서 놀라운 사실이 있습니다. 하나님께서 대적이라고 부르시는 사람들은 단지 이스라엘을 공격하는 이방 민족이 아닙니다. 하나님의 말씀을 거역하고 불의를 행하는 자기 백성도 하나님의 심판 앞에 서게 된 것입니다. 이스라엘이 하나님의 백성이라는 사실은 그들의 죄를 정당화하지 못했습니다. 하나님께 특별한 은혜를 받았다는 사실이 불의를 행할 수 있는 특권이 될 수는 없었습니다.</p>\n<p>하나님께서는 실제로 이스라엘을 심판하셨습니다. 이사야 42장 24절에서는 이스라엘을 약탈자들에게 넘기신 분이 누구인지를 묻습니다. 그 답은 바로 여호와 하나님이십니다. 이어지는 25절에서는 하나님께서 그들에게 맹렬한 진노와 전쟁의 격렬함을 쏟으셨다고 말씀합니다. 이스라엘이 경험한 패배와 재난은 단순히 주변 강대국의 군사력 때문에 일어난 일이 아니었습니다. 하나님께서는 그들의 불순종을 의롭게 심판하셨습니다. 그분은 죄를 모른 척하지 않으셨습니다. 자신이 사랑하는 백성의 죄도 의롭게 판단하셨습니다.</p>\n<p>그러나 여기서 더욱 놀라운 사실을 발견합니다. <strong>하나님께서는 그렇게 심판하시면서도 이스라엘을 완전히 멸절하지 않으셨습니다.</strong> 이사야 1장 9절에서 선지자는 하나님께서 생존자를 남겨 두지 않으셨다면 자신들이 소돔과 고모라처럼 되었을 것이라고 고백합니다.</p>\n<p>이스라엘은 하나님의 심판을 피할 자격이 있어서 살아남은 것이 아니었습니다. 그들의 죄는 심판받아 마땅했습니다. 그들은 자신의 의로움을 근거로 하나님께 생존을 요구할 수 없었습니다. 그러나 하나님께서는 그들을 완전히 멸망시키지 않으셨습니다. 그분은 심판 가운데서도 긍휼을 베푸셨습니다. 죄인들에게 살아갈 날들을 허락하셨으며, 그들을 향한 오래 참으심을 나타내셨습니다.</p>\n<p>여기서 한 가지를 분명히 해야 합니다. 이스라엘에게 내려진 심판 자체가 불완전하거나 불의했다는 뜻이 아닙니다. 하나님께서 행하신 역사적 심판은 참되고 의로웠습니다. 그러나 하나님께서는 그들의 죄에 합당한 최종적인 멸망까지 남김없이 집행하여 그들을 모두 없애지는 않으셨습니다. 진노하시면서도 오래 참으셨던 것입니다.</p>\n<p>이사야 1장 25절과 26절에서 하나님께서는 불순물을 제거하고 성읍의 정의를 회복시키겠다고 말씀하십니다. 그리고 27절에서는 시온이 정의로 구속함을 받고 돌아오는 자들이 공의로 구속함을 받으리라고 선언하십니다. 하나님께서 약속하신 구원은 불의를 그대로 인정하는 구원이 아니었습니다. 그분은 자신의 의로우심에 합당하게 죄를 다루시고 정의를 회복시키시는 구원을 약속하셨습니다.</p>\n<p>우리는 여기서 하나님의 공의와 긍휼이 함께 나타나는 모습을 봅니다. 하나님께서는 죄를 심판하셨습니다. 동시에 죄인들을 오래 참으셨습니다. 그런데 오래 참으셨다는 사실이 그들의 죄를 없던 일로 만들지는 않습니다. 죄에 대한 역사적 심판이 그들의 모든 죄책을 최종적으로 해결한 것도 아닙니다. 하나님의 긍휼은 그분이 공의롭지 않으시다는 뜻이 아닙니다. 하나님의 오래 참으심은 죄를 영원히 묵인하시겠다는 선언도 아닙니다.</p>\n<p>그렇다면 하나님께서는 어떻게 죄에 대한 자신의 공의로운 판단을 온전히 나타내시면서 죄인을 구원하실 수 있겠습니까? <strong>그 해답이 예수 그리스도의 십자가에 있습니다.</strong></p>\n<h3>2. 하나님께서는 그리스도의 십자가에서 자신의 공의를 온전히 나타내시며 죄인을 구원하셨습니다</h3>\n<p>이사야 53장에는 한 의로운 종이 등장합니다. 앞서 이사야 42장에서는 이스라엘이 하나님께 불순종하는 눈멀고 귀먹은 종으로 묘사되었습니다. 하나님의 말씀을 알고도 순종하지 않았고, 그분의 뜻을 깨닫지 못했습니다. 그러나 이사야 53장에 등장하는 종은 다릅니다. 그분은 의로우신 종입니다. 죄가 없으시며 하나님의 뜻에 온전히 순종하시는 분입니다. 그런데 놀랍게도 그 의로운 종이 고난을 받으십니다.</p>\n<p>이사야 53장 5절에서는 그분이 우리의 허물 때문에 상함을 받고, 우리가 평화를 누리도록 징계를 받으셨다고 말씀합니다. 6절에서는 여호와께서 우리의 죄악을 그에게 담당시키셨다고 선언합니다. 이것은 단순히 한 의로운 사람이 다른 사람들의 잘못 때문에 억울한 고난을 겪었다는 이야기가 아닙니다. <strong>죄인들이 받아야 할 형벌을 죄 없는 분이 대신 담당하셨다는 말씀입니다.</strong></p>\n<p>이사야 53장 10절에서는 그 종이 속건제물로 드려지며, 11절에서는 의로운 종이 많은 사람의 죄악을 담당하여 그들을 의롭게 한다고 말씀합니다. 이 예언은 예수 그리스도의 십자가에서 성취되었습니다.</p>\n<p>죄를 범한 이스라엘은 하나님의 심판을 받았지만 완전히 멸절하지 않았습니다. 그러나 죄가 없으신 그리스도께서는 자기 백성의 죄책에 대한 형벌을 대신 담당하셨습니다. 이스라엘이 경험한 역사적 심판은 하나님의 의로운 판단이었습니다. 그러나 그 심판 자체가 죄책을 완전히 속량하지는 못했습니다. 그리스도의 십자가는 죄인의 죄책에 대한 형벌을 충분히 담당하여 하나님의 공의를 만족시키는 완전한 대속이었습니다.</p>\n<p>죄인에게 필요한 것은 단지 고난을 겪고 다시 살아갈 기회를 얻는 일이 아니었습니다. 하나님 앞에서 자신의 죄책이 해결되고, 의로우신 하나님과 화목하게 되는 일이었습니다. 그 일을 그리스도께서 이루셨습니다.</p>\n<p>이제 우리는 로마서 3장 25절과 26절의 말씀을 더욱 분명하게 이해할 수 있습니다. 하나님께서는 오래 참으시는 가운데 이전에 지은 죄들을 간과하셨습니다. 그러나 그 죄를 영원히 무시하지 않으셨습니다. 마침내 그리스도의 피를 통하여 자신의 의로우심을 나타내셨습니다. 그리하여 하나님은 자신도 의로우시며 예수 그리스도를 믿는 자를 의롭다 하시는 분임을 나타내셨습니다.</p>\n<p>이것이 복음의 놀라운 영광입니다. 하나님께서는 죄를 죄가 아니라고 선언하지 않으셨습니다. 죄인을 구원하시기 위해 공의로운 판단을 취소하지도 않으셨습니다. 자기 아들이신 예수 그리스도께서 자발적으로 죄인의 형벌을 대신 담당하셨고, 그분의 완전한 순종과 희생으로 하나님의 공의가 충분히 만족되었습니다. <strong>죄인을 심판하시는 하나님의 공의가, 그리스도의 대속을 통해 바로 그 죄인을 구원하는 의로운 근거가 된 것입니다.</strong></p>\n<p>여기에 하나님의 공의가 얼마나 영광스러운지가 나타납니다. 우리가 구원받았다는 사실은 하나님의 공의가 무너졌다는 증거가 아닙니다. 오히려 그리스도의 십자가에서 이루어진 우리의 구원은 하나님의 공의가 얼마나 완전하고 영광스러운지를 드러내는 증거입니다.</p>\n<p>사랑하는 성도 여러분, 이 사실을 깊이 생각해 보십시오. 우리는 하나님의 의로운 심판을 받아야 할 죄인입니다. 하나님께서 우리의 삶을 의롭게 판단하신다면 누구도 자신의 행위를 근거로 그분 앞에 설 수 없습니다. 그러나 하나님께서는 우리를 구원하시기 위해 자기 아들을 내어주셨습니다. 죄 없으신 그리스도께서 우리의 죄를 담당하셨습니다. 그분의 대속으로 말미암아 우리는 믿음으로 의롭다 하심을 받고 하나님과 화목하게 되었습니다.</p>\n<p>우리의 구원은 값없이 주어진 은혜입니다. 그러나 그것은 하나님께서 죄를 가볍게 여기신 결과가 아닙니다. 그리스도의 순종과 희생을 통해 이루어진 완전한 구원입니다. 우리가 고백하는 웨스트민스터 신앙고백서 11장 3항도 그리스도께서 하나님의 공의를 충분히 만족시키셨으며, 그로 말미암아 죄인의 칭의에서 하나님의 엄정한 공의와 풍성한 은혜가 함께 영광을 받는다고 설명합니다.</p>\n<p>참으로 놀라운 사실입니다. 하나님의 공의는 조금도 손상되지 않았습니다. 오히려 그리스도의 십자가에서 완전하게 나타났습니다. 죄인을 향한 하나님의 은혜도 조금도 부족하지 않았습니다. 그 은혜로 우리는 참된 용서와 구원을 받았습니다. 그러므로 우리가 십자가를 바라볼 때, 단지 자신의 죄가 용서되었다는 사실만을 기뻐해서는 안 됩니다. <strong>우리는 그 구원을 이루신 하나님이 어떤 분이신지를 바라보아야 합니다.</strong></p>\n<p>죄를 반드시 의롭게 심판하시며, 동시에 그리스도 안에서 죄인을 구원하시는 하나님. 바로 그 의로우신 하나님께 우리의 찬양과 영광을 돌려야 합니다.</p>\n<h3>결론 — 죄인인 우리가 어떻게 하나님의 공의를 찬양하게 되었습니까?</h3>\n<p>이제 처음에 제기했던 질문으로 돌아가 보겠습니다. 우리는 본래 하나님의 공의로운 심판을 받아야 할 죄인이었습니다. 그런데 어떻게 그런 우리가 하나님의 공의를 사랑하고 찬양할 수 있겠습니까?</p>\n<p>먼저 우리는 하나님의 공의가 얼마나 영광스러운 성품인지를 생각해야 합니다. 하나님께서는 언제나 참되고 의로우십니다. 그분의 모든 뜻과 판단과 행동은 완전하게 올바릅니다. 하나님께서는 불의를 선이라고 부르지 않으시며, 악을 영원히 방치하지도 않으십니다. 그분의 판단에는 거짓이나 편파성이 없습니다. 하나님께서 의로우시지 않다면 우리는 그분을 온전히 신뢰할 수 없을 것입니다. 그러나 하나님께서는 언제나 옳은 일을 행하시는 분입니다. 그분의 모든 판단과 통치는 신뢰하기에 합당합니다. <strong>그러므로 하나님의 공의는 그 자체로 사랑하고 경배하기에 합당한 영광스러운 성품입니다.</strong></p>\n<p>그런데 죄인인 우리가 이처럼 의로우신 하나님을 기뻐하게 되었다는 사실은 얼마나 놀랍습니까? 그리스도께서 우리의 죄를 담당하셨기 때문입니다. 우리는 하나님의 공의가 사라졌기 때문에 구원받은 사람들이 아닙니다. 그리스도의 십자가에서 그 공의가 충분히 만족되었기 때문에 하나님과 화목하게 된 사람들입니다. 이제 우리는 하나님의 공의를 이전과 다른 눈으로 바라봅니다. 그 공의가 얼마나 완전한지를 알수록 그리스도의 구원이 얼마나 놀라운지도 더욱 깊이 깨닫습니다.</p>\n<p>그러나 우리가 하나님의 공의를 사랑하는 이유는 단지 그 공의를 통해 자신이 구원받았기 때문만은 아닙니다. <strong>우리는 이제 그 공의를 가지신 하나님 자신을 사랑하게 되었기 때문입니다.</strong> 이것이 구원의 가장 놀라운 복입니다. 하나님께서는 우리를 심판에서 건져 내실 뿐 아니라 자신과 화목하게 하셔서, 그분을 알고 사랑하며 영원히 누리게 하셨습니다.</p>\n<p>성령께서는 우리의 마음을 새롭게 하셔서 죄를 미워하고 하나님의 의로운 뜻을 사랑하도록 변화시키십니다. 물론 우리는 여전히 죄와 싸우는 사람들입니다. 그러므로 하나님의 공의를 사랑한다는 것은 자신이 의롭다고 자랑하거나 다른 사람의 죄를 심판하기를 즐긴다는 뜻이 아닙니다. 오히려 자기 죄를 정직하게 인정하고, 하나님의 말씀 앞에서 돌이키며, 자신의 삶이 그분의 의로운 뜻에 합당해지기를 원하는 것입니다.</p>\n<p>우리는 교회가 하나님께서 기뻐하시는 진실하고 의로운 공동체가 되기를 바랍니다. 악이 정당화되지 않고, 억울한 사람이 외면당하지 않으며, 모든 관계 가운데 하나님의 의로운 뜻이 존중받기를 원합니다. 그러나 이러한 갈망의 궁극적인 목적은 단지 우리의 삶과 세상이 더 나아지는 데 있지 않습니다. <strong>우리는 의로우신 하나님 자신의 영광이 나타나기를 갈망합니다.</strong> 하나님께서 얼마나 참되고 의로우신 분인지를 온 세상이 알게 되기를 원합니다. 그리고 마침내 모든 악과 불의가 사라지고 그분의 의로운 통치가 완전하게 나타날 날을 기다립니다.</p>\n<p>요한계시록 19장은 바로 그 영광스러운 장면을 보여 줍니다. 하늘에서 큰 무리가 하나님께 찬양을 올려 드립니다. 그들은 하나님의 구원과 영광과 능력을 선포합니다. 그리고 이렇게 고백합니다. <strong>“그의 심판은 참되고 의로운지라.” (계 19:2)</strong></p>\n<p>이 찬양은 세상을 미혹하고 하나님의 종들을 박해한 바벨론에 대한 하나님의 심판이 이루어진 후에 울려 퍼집니다. 하늘의 무리는 악이 영원히 승리하지 못하고 하나님의 의로운 판단이 마침내 드러났다는 사실을 기뻐합니다. 그들은 악인의 고통 자체가 아니라 하나님의 완전한 공의가 나타났다는 사실을 찬양합니다.</p>\n<p>여기서 우리는 참으로 놀라운 사실을 발견합니다. <strong>본래 하나님의 심판을 받아야 했던 죄인들이 이제 하나님의 의로운 심판을 찬양하는 사람들이 되었습니다.</strong> 어떻게 이런 일이 가능하겠습니까? 그리스도께서 그들의 죄를 담당하셨기 때문입니다. 하나님께서 그리스도 안에서 그들을 구원하시고, 성령으로 새롭게 하셨기 때문입니다. 그들은 이제 하나님의 공의를 피하려는 사람들이 아니라, 그 공의를 사랑하고 그 의로우심이 온전히 나타나기를 기뻐하는 사람들입니다.</p>\n<p>이것이 우리에게도 주어진 소망입니다. 우리는 지금도 불완전하지만, 성령께서는 우리를 의로우신 하나님을 더욱 사랑하는 사람으로 변화시키십니다. 그리고 마침내 그분의 의로우심을 온전히 기뻐하며 찬양하는 날을 맞이할 것입니다.</p>\n<p>사랑하는 성도 여러분, 우리가 갈망하는 것은 단지 자신의 형편이 좋아지거나 억울함이 해결되는 세상이 아닙니다. 우리는 <strong>하나님의 의로우심이 온전히 나타나기를 갈망합니다.</strong> 그분의 의로운 뜻이 우리의 삶과 교회 가운데 나타나기를 원합니다. 세상에서 불의가 사라지고 하나님의 완전한 통치가 드러나기를 소망합니다. 그것은 우리가 의로우신 하나님 자신을 사랑하기 때문입니다.</p>\n<p>하나님께서는 그리스도의 십자가에서 자신의 공의를 온전히 나타내시며 우리를 구원하셨습니다. 우리의 구원 자체가 그분의 공의로운 영광을 증언합니다. 이제 우리는 그 공의를 두려워하여 피하기만 하는 죄인이 아니라, 그리스도 안에서 그 공의를 사랑하고 찬양하며 갈망하는 성도가 되었습니다.</p>\n<p>그리고 마침내 하늘의 찬양에 참여하여 선포할 것입니다. <strong>“할렐루야! 그의 심판은 참되고 의로운지라!”</strong> 죄인을 구원하신 하나님은 참으로 의로우신 분이십니다. <strong>그분의 공의는 우리의 영원한 사랑과 찬양을 받기에 합당합니다.</strong> 의로우신 하나님께 모든 영광을 돌립니다. 아멘.</p>","references":[{"id":"book09","title":"개혁조직신학 2: 인간과 그리스도","author":"조엘 비키·폴 스몰리","category":"그리스도의 대속과 공의의 만족"},{"id":"book08","title":"하나님이 복음이다","author":"존 파이퍼","category":"복음의 최고의 선물로서 하나님 자신"},{"id":"study-hamilton","title":"God’s Glory in Salvation through Judgment","author":"제임스 M. 해밀턴 주니어","category":"성경신학 · 하나님의 영광과 심판을 통한 구원"},{"id":"study-sloane","title":"Justice and the Atonement in the Book of Isaiah","author":"앤드루 슬론","category":"학술 논문 · 이사야서의 공의와 대속"},{"id":"study-wcf","title":"웨스트민스터 신앙고백 제11장 제3항","author":"웨스트민스터 총회","category":"공의의 충분한 만족과 칭의"}],"checkNote":"원고 소제목 4개 및 원고 본문은 수정 없이 문단형 그대로 게시합니다. 로마서 3장, 이사야 1·42·53장, 계시록 19장의 본문과 주해·조직신학·참고도서, 낭독 패널 연결을 점검했습니다.","prepCheck":"제7회 카드·주제문·주제단락·주본문·보조본문·흐름·상세 아웃라인·단락형 원고·주석·참고도서·브라우저 음성 낭독을 한 세트로 구성했습니다."};
  Object.assign(sermon, patch);
  if (window.SERMON_RESEARCH_SOURCES) {
    window.SERMON_RESEARCH_SOURCES['7'] = {"commentaries":[{"author":"존 N. 오스왈트 (John N. Oswalt)","title":"The Book of Isaiah, Chapters 1–39 / Chapters 40–66","series":"NICOT · Eerdmans, 1986 / 1998 · 사용자 제공 Logos 발췌","note":"사 1:21–28에서 하나님의 의로운 심판과 시온의 회복, 사 42:18–25에서 이스라엘 자신의 죄로 인한 역사적 심판을 주해합니다. 사 53장에서 종의 대속을 구별하며, 역사적 고난이나 포로 귀환만으로 죄책이 해결되는 것이 아니라고 설명합니다."},{"author":"J. 알렉 모티어 (J. Alec Motyer)","title":"The Prophecy of Isaiah: An Introduction & Commentary","series":"InterVarsity Press, 1996 · 사용자 제공 Logos 발췌","note":"사 1:21–27의 정련과 공의로운 회복, 사 42:18–25의 눈먼 종 이스라엘, 사 53:5–6·10–11의 형벌적·대리적 고난을 연결합니다. 의로운 종이 죄악을 담당하고 많은 사람을 의롭게 한다는 설명을 제공합니다."},{"author":"배리 웹 (Barry G. Webb)","title":"The Message of Isaiah: On Eagles’ Wings","series":"BST · Inter-Varsity Press, 1996 · 사용자 제공 Logos 발췌","note":"사 1:21–31에서 멸망만이 아니라 정결과 회복을 지향하는 심판, 정의를 우회하지 않는 구속을 강조합니다. 사 42:18–25에서 하나님의 말씀을 받고도 듣지 않은 백성의 책임과 용서의 필요성을 지적합니다."}],"systematics":[{"author":"헤르만 바빙크","title":"개혁교의학 3: 죄, 그리스도, 구원","url":"https://theo10.pages.dev/books/bavinck/","note":"죄에 대한 하나님의 공의와 그리스도의 속죄, 로마서 3:25–26에서 드러난 하나님의 의로우심에 관한 논증. 링크는 Theo10 도서별 연구 자료이며 원서 전문을 뜻하지 않습니다."},{"author":"루이스 벌코프","title":"조직신학","url":"https://theo10.pages.dev/books/berkhof/","note":"하나님 자신이 의로우시다는 완전성과 의로운 통치·판결·형벌을 구별하여 설명하는 데 참고합니다."},{"author":"존 칼뱅","title":"기독교 강요 II.16","url":"https://theo10.pages.dev/books/calvin/","note":"그리스도의 중보와 죄인을 위한 대속적 고난을 참고합니다. 죄책을 담당하신 그리스도의 사역을 역사적 심판과 구분합니다."},{"author":"조엘 비키·폴 스몰리","title":"Reformed Systematic Theology, Vol. 2: Man and Christ","url":"https://theo10.pages.dev/","note":"그리스도의 순종과 대속, 공의의 만족, 구속 성취를 신학적으로 검토하는 참고도서입니다. Theo10 내부 관련 자료는 연구 보조 자료입니다."}]};
  }
  // 이 회차의 참고도서 카드만 실제 제공된 원문/논문 웹페이지로 연결합니다.
  function setupSermon07() {
    if (Number(new URLSearchParams(location.search).get('sermon')) !== 7) return;
    const documentHost = document.getElementById('sermonDocument');
    if (!documentHost) return;
    const refHost = documentHost.querySelector('.sermon-reference-books-section');
    const external = [["제임스 M. 해밀턴 주니어","https://www.crossway.org/books/gods-glory-in-salvation-through-judgment-ebook/","출판사 도서정보 보기"],["앤드루 슬론","https://www.academia.edu/36933338/Justice_and_the_Atonement_in_the_Book_of_Isaiah","논문 읽기"],["웨스트민스터 총회","https://www.opc.org/wcf.html","신앙고백 원문 보기"]];
    if (refHost) refHost.querySelectorAll('.reference-book').forEach(function(card) {
      if (card.tagName === 'A') return;
      const item = external.find(function(v) { return card.textContent.includes(v[0]); });
      if (!item) return;
      const anchor = document.createElement('a');
      anchor.className = card.className;
      anchor.href = item[1];
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.innerHTML = card.innerHTML + '<span class="reference-book-link">' + item[2] + '</span>';
      card.replaceWith(anchor);
    });
    // 제7회 전용 한국어 브라우저 TTS. MP3 다운로드가 아닌 기기 음성합성입니다.
    const manuscript = document.getElementById('sermonFullText');
    if (!manuscript || manuscript.dataset.sermon07TtsReady === 'yes') return;
    const headings = Array.from(manuscript.querySelectorAll('h3'));
    if (!headings.length) return;
    manuscript.dataset.sermon07TtsReady = 'yes';

    const supported = !!(window.speechSynthesis && window.SpeechSynthesisUtterance);
    const synth = supported ? window.speechSynthesis : null;
    const sections = headings.map(function(heading, index) {
      const paragraphs = [];
      let node = heading.nextElementSibling;
      while (node && node.tagName !== 'H3' && !node.classList.contains('sermon-read-control')) {
        if (node.tagName === 'P') {
          const cleaned = node.textContent.replace(/\s+/g,' ').trim();
          if (cleaned) paragraphs.push({node:node, text:cleaned});
        }
        node = node.nextElementSibling;
      }
      const title = heading.textContent.replace(/\s+/g,' ').trim();
      const short = index===0 ? '서론' : index===headings.length-1 ? '결론' : index+'대지';
      return {heading:heading, title:title, short:short, paragraphs:paragraphs};
    });

    const style = document.createElement('style');
    style.id = 'sermon07-tts-style';
    style.textContent = `
      .sermon07-tts{margin:4px 0 25px;padding:15px 17px;background:#f4faf6;border:1px solid #bbd8c9;border-radius:12px;color:#214f43}
      .sermon07-tts-title{margin:0 0 12px;font-weight:850;font-size:16px;color:#20584c}
      .sermon07-tts-actions,.sermon07-tts-section{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
      .sermon07-tts-actions{margin-bottom:9px}
      .sermon07-tts button,.sermon07-tts select,.sermon07-tts-section button{font-family:inherit;font-size:13px;line-height:1.45;border:1px solid #98bdae;border-radius:8px;background:#fff;color:#20574b;padding:9px 12px;font-weight:750;cursor:pointer}
      .sermon07-tts button:disabled,.sermon07-tts-section button:disabled{opacity:.5;cursor:not-allowed}
      .sermon07-tts button:focus-visible,.sermon07-tts select:focus-visible,.sermon07-tts-section button:focus-visible{outline:2px solid #1b806c;outline-offset:2px}
      .sermon07-tts .sermon07-tts-play,.sermon07-tts-section button.is-playing{background:#1e6757;color:#fff;border-color:#1e6757}
      .sermon07-tts .sermon07-tts-active{background:#dcefe6;border-color:#1e6757}
      .sermon07-tts label{display:inline-flex;align-items:center;gap:6px;color:#2c6254;font-size:13px;font-weight:750}
      .sermon07-tts-status{font-size:12px!important;line-height:1.6!important;color:#385f53!important;margin:8px 0 0!important}
      .sermon07-tts-help{font-size:12px!important;line-height:1.65!important;color:#60786d!important;margin:8px 0 0!important}
      .sermon07-tts-section{margin:0 0 16px}
      .sermon07-tts-section button{font-size:13px;padding:7px 11px}
      .sermon-manuscript p.sermon07-reading{background:#edf8ee;border-left:3px solid #1e856b;padding:9px 12px;border-radius:4px}
      @media(max-width:700px){.sermon07-tts{padding:12px}.sermon07-tts button,.sermon07-tts select{font-size:12px;padding:8px 9px}}
    `;
    document.head.appendChild(style);

    function button(label, cls) {
      const b=document.createElement('button');b.type='button';b.textContent=label;
      if(cls)b.className=cls;
      return b;
    }
    const panel=document.createElement('section');
    panel.className='sermon07-tts';
    panel.setAttribute('aria-label','제7회 설교 한국어 음성 듣기');
    const heading=document.createElement('div');heading.className='sermon07-tts-title';heading.textContent='설교 원고 음성 듣기';panel.appendChild(heading);
    const actions=document.createElement('div');actions.className='sermon07-tts-actions';
    const full=button('▶ 전체 듣기','sermon07-tts-play');
    const pause=button('⏸ 일시정지');
    const stop=button('■ 정지');
    full.disabled=!supported;pause.disabled=true;stop.disabled=true;
    actions.append(full,pause,stop);

    const speedLabel=document.createElement('label');speedLabel.appendChild(document.createTextNode('속도'));
    const speed=document.createElement('select');speed.setAttribute('aria-label','낭독 속도');
    [0.8,0.9,1,1.1,1.2,1.3].forEach(function(value){const o=document.createElement('option');o.value=String(value);o.textContent=value.toFixed(1)+'배';if(value===1)o.selected=true;speed.appendChild(o)});
    speedLabel.appendChild(speed);actions.appendChild(speedLabel);
    const voiceLabel=document.createElement('label');voiceLabel.appendChild(document.createTextNode('음성'));
    const voiceSelect=document.createElement('select');voiceSelect.setAttribute('aria-label','한국어 음성 선택');
    const voiceDefault=document.createElement('option');voiceDefault.value='';voiceDefault.textContent='한국어 자동';voiceSelect.appendChild(voiceDefault);
    voiceLabel.appendChild(voiceSelect);actions.appendChild(voiceLabel);
    panel.appendChild(actions);
    const status=document.createElement('p');status.className='sermon07-tts-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');
    status.textContent=supported?'음성 듣기 준비 완료':'이 브라우저에서는 음성 낭독을 지원하지 않습니다.';
    panel.appendChild(status);
    const help=document.createElement('p');help.className='sermon07-tts-help';
    help.textContent='기기의 한국어 음성 합성으로 원고를 읽습니다. 원고를 접거나 페이지를 벗어나면 정지됩니다. 별도의 MP3 파일은 사용하지 않습니다.';
    panel.appendChild(help);
    manuscript.insertBefore(panel,headings[0]);

    const sectionButtons=sections.map(function(section,index){
      const row=document.createElement('div');row.className='sermon07-tts-section';
      const play=button('▶ '+section.short+' 듣기');play.disabled=!supported;
      play.setAttribute('aria-label',section.title+' 낭독');play.setAttribute('aria-pressed','false');
      row.appendChild(play);section.heading.insertAdjacentElement('afterend',row);
      play.addEventListener('click',function(){begin(index)});
      return play;
    });

    let voices=[];
    function loadVoices(){
      if(!supported)return;
      const selection=voiceSelect.value;
      voices=synth.getVoices().filter(function(v){return /^ko([_-]|$)/i.test(v.lang)});
      while(voiceSelect.options.length>1)voiceSelect.remove(1);
      voices.forEach(function(v,index){const opt=document.createElement('option');opt.value=String(index+1);opt.textContent=v.name+(v.localService?' · 기기':'');voiceSelect.appendChild(opt)});
      if(Array.from(voiceSelect.options).some(function(opt){return opt.value===selection}))voiceSelect.value=selection;
      if(active===-1)status.textContent=voices.length?'한국어 음성 준비 완료':'한국어 음성 설치 여부를 확인해 주세요. 재생은 시도할 수 있습니다.';
    }
    function chosenVoice(){
      const n=Number(voiceSelect.value);
      if(n>=1&&n<=voices.length)return voices[n-1];
      return voices.find(function(v){return v.localService&&/premium|enhanced|yuna|sora|유나/i.test(v.name)})||voices.find(function(v){return v.localService})||voices[0]||null;
    }

    // 분절은 한국어 단어 중간을 최대한 자르지 않으며 발화 단위는 145자 이하로 유지합니다.
    function splitText(value){
      const normalized=String(value).replace(/\s+/g,' ').trim();
      if(!normalized)return [];
      const sentences=normalized.replace(/([.!?。！？]+[”"’']?)(\s+|$)/g,'$1\u241e').split('\u241e').filter(Boolean);
      const result=[];
      sentences.forEach(function(sentence){
        let rest=sentence.trim();
        while(rest.length>145){
          let cut=rest.lastIndexOf(' ',145);
          if(cut<65)cut=145;
          result.push(rest.slice(0,cut).trim());rest=rest.slice(cut).trim();
        }
        if(rest)result.push(rest);
      });
      return result;
    }

    let active=-1; // -1 중지, -2 전체, 0~3 구간
    let queue=[];let cursor=0;let paused=false;let utterance=null;let version=0;let currentParagraph=null;let pending=null;
    function activeLabel(){return active===-2?'전체 원고':active>=0?sections[active].short:''}
    function updateButtons(){
      full.setAttribute('aria-pressed',String(active===-2));full.classList.toggle('sermon07-tts-active',active===-2);
      sectionButtons.forEach(function(b,index){const on=active===index;b.classList.toggle('is-playing',on);b.setAttribute('aria-pressed',String(on));b.textContent=on?'↺ '+sections[index].short+' 다시 듣기':'▶ '+sections[index].short+' 듣기'});
      pause.disabled=active===-1;stop.disabled=active===-1;pause.textContent=paused?'▶ 이어 듣기':'⏸ 일시정지';
    }
    function clearHighlight(){if(currentParagraph){currentParagraph.classList.remove('sermon07-reading');currentParagraph=null}}
    function halt(message){
      version++;
      if(pending!==null){clearTimeout(pending);pending=null}
      active=-1;queue=[];cursor=0;paused=false;utterance=null;clearHighlight();
      if(supported)synth.cancel();
      if(message)status.textContent=message;
      updateButtons();
    }
    function readNext(token){
      pending=null;
      if(token!==version||active===-1||paused)return;
      if(cursor>=queue.length){const label=activeLabel();halt(label+' 낭독이 완료되었습니다.');return}
      const item=queue[cursor++];
      if(item.node!==currentParagraph){clearHighlight();if(item.node){currentParagraph=item.node;currentParagraph.classList.add('sermon07-reading')}}
      const u=new window.SpeechSynthesisUtterance(item.text);
      u.lang='ko-KR';u.rate=Number(speed.value)||1;u.pitch=1;
      const voice=chosenVoice();if(voice)u.voice=voice;
      utterance=u;
      const count=cursor,total=queue.length;
      u.onend=function(){
        if(token!==version||utterance!==u)return;
        utterance=null;
        // 다음 발화가 새 문단/구간이면 짧게 숨을 고릅니다.
        const next=queue[cursor];
        const delay=next&&next.node!==item.node?320:80;
        pending=window.setTimeout(function(){readNext(token)},delay);
      };
      u.onerror=function(e){
        if(token!==version||utterance!==u)return;
        halt('음성 재생이 중단되었습니다. 기기의 한국어 음성 설정을 확인해 주세요.');
      };
      try{synth.speak(u);status.textContent=activeLabel()+' 낭독 중 · '+count+'/'+total}
      catch(e){halt('이 기기에서는 음성을 시작할 수 없습니다.')}
    }
    function begin(index){
      if(!supported)return;
      halt();active=index;
      const chosen=index===-2?sections:[sections[index]];
      chosen.forEach(function(section){
        queue.push({text:section.title,node:null});
        section.paragraphs.forEach(function(paragraph){splitText(paragraph.text).forEach(function(chunk){queue.push({text:chunk,node:paragraph.node})})});
      });
      if(!queue.length){halt('낭독할 본문이 없습니다.');return}
      updateButtons();readNext(version);
    }
    full.addEventListener('click',function(){begin(-2)});
    pause.addEventListener('click',function(){
      if(active===-1||!supported)return;
      if(paused){paused=false;synth.resume();status.textContent=activeLabel()+' 낭독 재개';if(!utterance&&pending===null)pending=window.setTimeout(function(){readNext(version)},80)}
      else{paused=true;synth.pause();status.textContent=activeLabel()+' 일시정지'}
      updateButtons();
    });
    stop.addEventListener('click',function(){halt('음성 낭독을 정지했습니다.')});
    loadVoices();
    if(supported && typeof synth.addEventListener==='function')synth.addEventListener('voiceschanged',loadVoices);
    const toggle=document.getElementById('sermonReadToggle'),close=document.getElementById('sermonReadClose');
    function stopWhenClosed(){if(manuscript.hidden&&active!==-1)halt('원고를 접어 음성 낭독을 정지했습니다.')}
    if(toggle)toggle.addEventListener('click',stopWhenClosed);
    if(close)close.addEventListener('click',stopWhenClosed);
    window.addEventListener('pagehide',function(){if(active!==-1)halt()});
    updateButtons();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',setupSermon07,{once:true});
  else setupSermon07();
})();
