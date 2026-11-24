const $ = (id) => document.getElementById(id);
function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  $(id).classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
}
$('startBtn').addEventListener('click',()=>showScreen('level1'));

// Level 1: flip all five heart cards
let foundHearts=0;
document.querySelectorAll('.heart-tile').forEach((tile)=>{
  tile.addEventListener('click',()=>{
    if(tile.classList.contains('found')) return;
    tile.classList.add('found');
    tile.textContent='💗';
    foundHearts++;
    $('heartCount').textContent=foundHearts;
    if(foundHearts===5){
      $('heartFeedback').textContent='Semua hati ditemukan! Kamu hebat 🌸';
      setTimeout(()=>{showScreen('level2');renderQuestion();},900);
    }else{
      $('heartFeedback').textContent='Satu hati berhasil ditemukan. Lanjutkan!';
    }
  });
});

// Level 2: friendly quiz; every answer is accepted so the game stays playful
const questions=[
  {q:'Hal sederhana apa yang bisa membuat hari lebih menyenangkan?',a:['Senyuman tulus 😊','Langit mendung ☁️','Alarm pagi ⏰']},
  {q:'Apa yang membuat kenangan terasa berharga?',a:['Saling menghargai 💗','Terburu-buru','Melupakan cerita']},
  {q:'Apa bekal terbaik untuk terus berteman dan bertumbuh bersama?',a:['Saling mendukung 🌷','Saling menyalahkan','Tidak mendengarkan']}
];
let qi=0;
function renderQuestion(){
  const item=questions[qi];
  $('quizCount').textContent=`PERTANYAAN ${qi+1} DARI ${questions.length}`;
  $('question').textContent=item.q;
  $('quizFeedback').textContent='';
  $('answers').innerHTML='';
  item.a.forEach(answer=>{
    const b=document.createElement('button');
    b.className='answer';b.textContent=answer;
    b.addEventListener('click',()=>{
      qi++;
      if(qi===questions.length){
        $('quizFeedback').textContent='Kuis selesai! Saatnya menyusun puzzle ✨';
        setTimeout(()=>{showScreen('level3');shufflePuzzle();},850);
      }else{
        $('quizFeedback').textContent='Jawaban tersimpan. Lanjut ke pertanyaan berikutnya 💕';
        setTimeout(renderQuestion,650);
      }
    });
    $('answers').appendChild(b);
  });
}

// Level 3: solvable 8-puzzle
let puzzle=[];
function solvable(a){
  let inv=0;
  for(let i=0;i<9;i++)for(let j=i+1;j<9;j++)
    if(a[i]&&a[j]&&a[i]>a[j])inv++;
  return inv%2===0;
}
function shufflePuzzle(){
  do{
    puzzle=[1,2,3,4,5,6,7,8,0];
    for(let i=8;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [puzzle[i],puzzle[j]]=[puzzle[j],puzzle[i]];
    }
  }while(!solvable(puzzle)||puzzle.every((v,i)=>v===(i===8?0:i+1)));
  $('puzzleFeedback').textContent='Susun angka dari 1 sampai 8. Semangat!';
  drawPuzzle();
}
function drawPuzzle(){
  $('puzzle').innerHTML='';
  puzzle.forEach((n,i)=>{
    const b=document.createElement('button');
    b.className='tile'+(n===0?' empty':'');
    b.textContent=n||'';
    b.setAttribute('aria-label',n?`Angka ${n}`:'Kotak kosong');
    b.addEventListener('click',()=>moveTile(i));
    $('puzzle').appendChild(b);
  });
}
function moveTile(i){
  const e=puzzle.indexOf(0);
  const adjacent=(Math.abs(i-e)===1&&Math.floor(i/3)===Math.floor(e/3))||Math.abs(i-e)===3;
  if(!adjacent)return;
  [puzzle[i],puzzle[e]]=[puzzle[e],puzzle[i]];
  drawPuzzle();
  if(puzzle.every((v,k)=>v===(k===8?0:k+1))){
    $('puzzleFeedback').textContent='Puzzle tersusun sempurna! 🌟';
    setTimeout(()=>{showScreen('level4');createFlowers();},900);
  }
}
$('shuffleBtn').addEventListener('click',shufflePuzzle);

// Level 4: collect 10 flowers
function createFlowers(){
  let count=0;
  $('flowerCount').textContent='0';
  $('flowerFeedback').textContent='Ketuk semua bunga untuk mengumpulkannya.';
  $('flowerGrid').innerHTML='';
  for(let i=0;i<10;i++){
    const b=document.createElement('button');
    b.className='flower';b.textContent='🌷';b.setAttribute('aria-label','Kumpulkan bunga');
    b.addEventListener('click',()=>{
      if(b.classList.contains('collected'))return;
      b.classList.add('collected');b.textContent='✨';count++;
      $('flowerCount').textContent=count;
      if(count===10){
        $('flowerFeedback').textContent='Buket lengkap! Hadiah terakhir menunggumu 💐';
        setTimeout(()=>showScreen('final'),900);
      }
    });
    $('flowerGrid').appendChild(b);
  }
}
$('revealBtn').addEventListener('click',()=>{
  $('secretLetter').classList.add('show');
  $('secretLetter').scrollIntoView({behavior:'smooth',block:'center'});
});
$('restartBtn').addEventListener('click',()=>location.reload());

// Soft floating decorations
const symbols=['💗','🌸','✿','💕','🌷'];
setInterval(()=>{
  const el=document.createElement('span');
  el.className='floaty';
  el.textContent=symbols[Math.floor(Math.random()*symbols.length)];
  el.style.left=Math.random()*100+'%';
  el.style.fontSize=(14+Math.random()*14)+'px';
  el.style.animationDuration=(7+Math.random()*5)+'s';
  $('ambient').appendChild(el);
  setTimeout(()=>el.remove(),12000);
},1100);
