const API = "/";
let loginInfo = { username: '', password: '', count: 0 };

function showPanel(msg) {
  document.getElementById('result').innerText = msg || '';
}
function showGame(flag) {
  document.getElementById('panel').style.display = flag ? 'none' : '';
  document.getElementById('game').style.display = flag ? '' : 'none';
}
function updateScore(cnt) {
  document.getElementById('score').innerText = "分数: " + cnt;
}
// 注册
document.getElementById('register').onclick = async function() {
  let u = username.value.trim(), p = password.value.trim();
  if (!u || !p) return showPanel("用户名和密码不能为空");
  let res = await fetch(API+'register',{method:"POST",body:JSON.stringify({username:u,password:p}),headers:{"Content-Type":"application/json"}})
    .then(r=>r.json());
  showPanel(res.msg);
  if (res.ok) {
    loginInfo.username = u;
    loginInfo.password = p;
    showPanel("注册成功，请登录");
  }
};
// 登录
document.getElementById('login').onclick = async function() {
  let u = username.value.trim(), p = password.value.trim();
  if (!u || !p) return showPanel("用户名和密码不能为空");
  let res = await fetch(API+'login',{method:"POST",body:JSON.stringify({username:u,password:p}),headers:{"Content-Type":"application/json"}})
    .then(r=>r.json());
  if(res.ok) {
    loginInfo.username = u;
    loginInfo.password = p;
    loginInfo.count = res.count || 0;
    updateScore(loginInfo.count);
    showPanel("登录成功！");
    showGame(true);
  } else {
    showPanel(res.msg || "登录失败");
  }
};
// 打地鼠玩法
function randomMole() {
  let arr = [];
  for (let i=0; i<9; i++) arr.push(i);
  let hit = arr[Math.floor(Math.random()*arr.length)];
  let moleHtml = arr.map((v,i)=>`<div class="mole" id="m${i}" style="background:${i==hit?'#4caf50':'#ccc'}">${i==hit?'🐹':''}</div>`).join('');
  document.getElementById('moles').innerHTML = moleHtml;
  document.querySelectorAll('.mole').forEach((el,i) => {
    el.onclick = async function() {
      if (i==hit) {
        let res = await fetch(API+'play', {
          method:"POST",
          body:JSON.stringify({username:loginInfo.username,password:loginInfo.password}),
          headers:{"Content-Type":"application/json"}
        }).then(r=>r.json());
        let score = res.count || (loginInfo.count+1);
        updateScore(score);
        loginInfo.count = score;
      } else {
        el.style.background="#e91e63";
      }
      randomMole();
    };
  });
}
document.getElementById('start').onclick = function() {
  updateScore(loginInfo.count || 0);
  randomMole();
  document.getElementById('start').disabled=true;
};

