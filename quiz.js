/* ===================== 今日の一問（ホーム最下部専用） ===================== */
(() => {
    'use strict';
  
    // ====== 問題データ ======
    const QUESTIONS = [
      {
        id: 'kz-s1',
        // カザフスタン（動作確認済みの埋め込みURL）
        src: 'https://www.google.com/maps/embed?pb=!4v1754752685624!6m8!1m7!1soKQo8salQ_Ec6tLZ5eRqfg!2m2!1d42.8538655940137!2d68.30586004515008!3f123.91430334236529!4f4.975812798452466!5f0.4494136891971475',
        options: ['カザフスタン', 'モンゴル', 'キルギス', 'ウズベキスタン'],
        answer: 'カザフスタン',
        explanation: '乾燥草原の地形、道路の舗装と路肩の質、標識傾向など中アジア要素。'
      },
      // 2問目以降を追加する場合は src を必ず有効な埋め込みURLにすること
      // {
      //   id: 'jp-s1',
      //   src: '<<有効な埋め込みURL>>',
      //   options: ['日本','韓国','台湾','中国'],
      //   answer: '日本',
      //   explanation: '左側通行、青地の案内標識、コンクリ電柱など日本固有の要素。'
      // }
    ];
  
    // ====== ユーティリティ ======
    const dayOfYearUtc = (d = new Date()) => {
      const y = d.getUTCFullYear();
      const start = Date.UTC(y, 0, 1);
      const today = Date.UTC(y, d.getUTCMonth(), d.getUTCDate());
      return Math.floor((today - start) / 86400000);
    };
    const dailyIndex = () => (QUESTIONS.length ? dayOfYearUtc() % QUESTIONS.length : 0);
  
    // ====== DOM 取得（ホーム最下部・固定ID） ======
    let svEl, choicesEl, resultEl, expEl, nextBtn, qIdEl;
  
    function getDom() {
      qIdEl     = document.getElementById('q-id') || null; // 任意
      svEl      = document.getElementById('sv-frame');
      choicesEl = document.getElementById('choices');
      resultEl  = document.getElementById('result');
      expEl     = document.getElementById('explanation');
      nextBtn   = document.getElementById('next-btn');
      const ok = svEl && choicesEl && resultEl && expEl && nextBtn;
      if (!ok) {
        console.warn('[quiz] 必須要素が見つかりません（sv-frame / choices / result / explanation / next-btn）');
      }
      return ok;
    }
  
    // ====== 描画 ======
    let currentIndex = 0;
  
    function renderQuestion(q) {
      if (qIdEl) qIdEl.textContent = `#${q.id}`;
      // iframe
      svEl.setAttribute('title', 'Street View クイズ');
      svEl.src = q.src;
  
      // リセット
      resultEl.textContent = '';
      resultEl.className = 'result';
      expEl.textContent = '';
      choicesEl.innerHTML = '';
  
      // 選択肢
      q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = opt;
        btn.addEventListener('click', () => onAnswer(q, btn, opt));
        choicesEl.appendChild(btn);
      });
  
      // 次へボタンは最初は隠す
      nextBtn.style.display = 'none';
    }
  
    function onAnswer(q, _btn, chosen) {
      [...choicesEl.querySelectorAll('button')].forEach(b => (b.disabled = true));
      const ok = chosen === q.answer;
      resultEl.textContent = ok ? '正解！' : `不正解… 正解は「${q.answer}」`;
      resultEl.className = 'result ' + (ok ? 'ok' : 'ng');
      expEl.textContent = q.explanation;
  
      // 簡易履歴
      try {
        const key = 'gwq-history';
        const hist = JSON.parse(localStorage.getItem(key) || '[]');
        hist.push({ id: q.id, ok, t: Date.now() });
        localStorage.setItem(key, JSON.stringify(hist.slice(-500)));
      } catch {}
  
      // 次へ
      nextBtn.style.display = 'inline-block';
      nextBtn.focus();
    }
  
    function renderDaily() {
      currentIndex = dailyIndex();
      renderQuestion(QUESTIONS[currentIndex]);
    }
  
    function initQuiz() {
      if (!QUESTIONS.length) return;
      renderDaily();
      nextBtn.addEventListener('click', () => {
        // ランダムだが同じ問題は避ける
        let r = Math.floor(Math.random() * QUESTIONS.length);
        if (QUESTIONS.length > 1 && r === currentIndex) {
          r = (r + 1) % QUESTIONS.length;
        }
        currentIndex = r;
        renderQuestion(QUESTIONS[currentIndex]);
      });
    }
  
    // ====== エントリポイント ======
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => getDom() && initQuiz());
    } else {
      getDom() && initQuiz();
    }
  })();
  