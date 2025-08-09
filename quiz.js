// ================= 問題データ =================
const QUESTIONS = [
    {
      id: 'kz-s1',
      // 依頼で提示された埋め込みURL
      src: 'https://www.google.com/maps/embed?pb=!4v1754752685624!6m8!1m7!1soKQo8salQ_Ec6tLZ5eRqfg!2m2!1d42.8538655940137!2d68.30586004515008!3f123.91430334236529!4f4.975812798452466!5f0.4494136891971475',
      options: ['カザフスタン','モンゴル','キルギス','ウズベキスタン'],
      answer: 'カザフスタン',
      explanation: '乾燥草原の地形、道路の舗装と路肩の質、標識傾向など中アジア要素。'
    },
    {
      id: 'jp-s1',
      src: 'https://www.google.com/maps/embed?pb=!4v1700000000000!6m8!1m7!1s7J9y8JrUoJrK!2m2!1d35.681236!2d139.767125!3f130!4f0!5f0.7820865974627469',
      options: ['日本','韓国','台湾','中国'],
      answer: '日本',
      explanation: '左側通行、青地の案内標識、コンクリ電柱など日本固有の要素。'
    }
  ];
  
  // ================= 日替わりインデックス =================
  function dayOfYearUtc(d=new Date()){
    const y=d.getUTCFullYear();
    const start=Date.UTC(y,0,1);
    const today=Date.UTC(y,d.getUTCMonth(),d.getUTCDate());
    return Math.floor((today-start)/86400000);
  }
  function dailyIndex(){
    return dayOfYearUtc()%QUESTIONS.length;
  }
  
  // ================= DOM 取得（ホームにも単独ページにも対応） =================
  const qIdEl = document.getElementById('q-id') || document.createElement('span');
  const svEl = document.getElementById('sv-frame');
  const choicesEl = document.getElementById('choices');
  const resultEl = document.getElementById('result');
  const expEl = document.getElementById('explanation');
  const nextBtn = document.getElementById('next-btn');
  
  if (svEl && choicesEl && resultEl && expEl && nextBtn) {
    initQuiz();
  }
  
  function renderQuestion(q){
    if (qIdEl) qIdEl.textContent = `#${q.id}`;
    svEl.src = q.src;
    resultEl.textContent='';
    resultEl.className='result';
    expEl.textContent='';
    choicesEl.innerHTML='';
    q.options.forEach(opt=>{
      const btn=document.createElement('button');
      btn.type='button';
      btn.textContent=opt;
      btn.addEventListener('click',()=>onAnswer(q,btn,opt));
      choicesEl.appendChild(btn);
    });
    nextBtn.style.display='none';
  }
  
  function onAnswer(q,btn,chosen){
    [...choicesEl.querySelectorAll('button')].forEach(b=>b.disabled=true);
    const ok = (chosen===q.answer);
    resultEl.textContent = ok? '正解！' : `不正解… 正解は「${q.answer}」`;
    resultEl.className = 'result ' + (ok? 'ok':'ng');
    expEl.textContent = q.explanation;
    try{
      const key='gwq-history';
      const hist=JSON.parse(localStorage.getItem(key)||'[]');
      hist.push({id:q.id,ok,t:Date.now()});
      localStorage.setItem(key, JSON.stringify(hist.slice(-500))); // 直近500件
    }catch(e){}
    nextBtn.style.display='inline-block';
  }
  
  function renderDaily(){ renderQuestion(QUESTIONS[dailyIndex()]); }
  
  function initQuiz(){
    renderDaily();
    nextBtn.addEventListener('click',()=>{
      const r=Math.floor(Math.random()*QUESTIONS.length);
      renderQuestion(QUESTIONS[r]);
    });
  }