// ① 問題データ（例）：iframeのsrcは Googleマップ「埋め込み」から取得して貼る
const QUIZZES = [
    {
      // 例：フィンランド・ヘルシンキのストリートビュー埋め込みURL
      // src には <iframe src="..."> の中身を入れる
      src: "<iframe src="https://www.google.com/maps/embed?pb=!4v1754752685624!6m8!1m7!1soKQo8salQ_Ec6tLZ5eRqfg!2m2!1d42.8538655940137!2d68.30586004515008!3f123.91430334236529!4f4.975812798452466!5f0.4494136891971475" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>",
      correct: "フィンランド",
      choices: ["スウェーデン","ノルウェー","フィンランド","カナダ"],
      explanation: "標識や白樺などの植生が手がかり。フィンランド語表記にも注目。"
    },
    {
      src: "https://www.google.com/maps/embed?pb=【別の地点のURL】",
      correct: "オーストラリア",
      choices: ["南アフリカ","オーストラリア","ニュージーランド","イギリス"],
      explanation: "左側通行、道路標識の形、乾燥した植生がヒント。"
    }
  ];
  
  // ② ランダムで1問選ぶ（将来は「今日分の固定」にしてもOK）
  let currentIndex = Math.floor(Math.random() * QUIZZES.length);
  
  const frame = document.getElementById("sv-frame");
  const choicesBox = document.getElementById("choices");
  const resultBox = document.getElementById("result");
  const expBox = document.getElementById("explanation");
  const nextBtn = document.getElementById("next-btn");
  
  function renderQuiz(index) {
    const q = QUIZZES[index];
    frame.src = q.src;
  
    // 選択肢ボタン生成（シャッフル）
    const opts = shuffle([...q.choices]);
    choicesBox.innerHTML = "";
    opts.forEach(label => {
      const btn = document.createElement("button");
      btn.textContent = label;
      btn.onclick = () => checkAnswer(label, q);
      choicesBox.appendChild(btn);
    });
  
    resultBox.textContent = "";
    resultBox.style.color = "";
    expBox.textContent = "";
    nextBtn.style.display = "none";
  }
  
  function checkAnswer(selected, q) {
    const isCorrect = selected === q.correct;
    resultBox.textContent = isCorrect ? "🎉 正解！" : `❌ 不正解（正解：${q.correct}）`;
    resultBox.style.color = isCorrect ? "green" : "crimson";
    expBox.textContent = q.explanation;
  
    // ボタン無効化
    choicesBox.querySelectorAll("button").forEach(b => b.disabled = true);
    nextBtn.style.display = "inline-block";
  }
  
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  
  nextBtn.addEventListener("click", () => {
    // 既出防止するなら履歴管理を足す。今は単純に次へ
    currentIndex = (currentIndex + 1) % QUIZZES.length;
    renderQuiz(currentIndex);
  });
  
  renderQuiz(currentIndex);
  