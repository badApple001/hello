const API = "/"; // 根路径即可
let loginInfo = { username: '', password: '', count: 0 };

function showMsg(msg) { document.getElementById('msg').innerText = msg || ''; }
function setPanel(loggedIn) {
  userPanel.style.display = loggedIn ? "none" : "";
  gamePanel.style.display = loggedIn ? "" : "none";
  addBtn.disabled = !loggedIn;
}
function updateScore(cnt) { score.innerText = "分数: " + cnt; }

// 注册
register.onclick = async () => {
  const u = username.value.trim(), p = password.value.trim();
  if (!u || !p) return showMsg("请输入用户名和密码！");
  let res = await fetch(API+"register",{method:"POST",body:JSON.stringify({username:u,password:p}),headers:{"Content-Type":"application/json"}}).then(r=>r.json());
  if(res.ok) { showMsg("注册成功，请登录！"); } else { showMsg(res.msg); }
};

// 登录
login.onclick = async () => {
  const u = username.value.trim(), p = password.value.trim();
  if (!u || !p) return showMsg("请输入用户名和密码！");
  let res = await fetch(API+"login",{method:"POST",body:JSON.stringify({username:u,password:p}),headers:{"Content-Type":"application/json"}}).then(r=>r.json());
  if(res.ok) {
    loginInfo = { username:u, password:p, count:res.count||0 };
    updateScore(loginInfo.count);
    setPanel(true);
    showMsg("登录成功！");
  } else {
    showMsg("登录失败："+(res.msg||''));
  }
};

// 点击加分
addBtn.onclick = async () => {
  let res = await fetch(API+"play",{method:"POST",body:JSON.stringify({username:loginInfo.username,password:loginInfo.password}),headers:{"Content-Type":"application/json"}}).then(r=>r.json());
  if(res.ok) {
    loginInfo.count = res.count;
    updateScore(loginInfo.count);
    showMsg("加分成功！");
  } else {
    showMsg(res.msg||"操作失败");
  }
};

// 退出
logout.onclick = () => {
  loginInfo = { username:'', password:'', count:0 };
  setPanel(false);
  updateScore(0);
  showMsg("已退出！");
};

// 自动填充常用变量
const userPanel = document.getElementById("user-panel");
const gamePanel = document.getElementById("game-panel");
const score = document.getElementById("score");
const addBtn = document.getElementById("add-btn");
const logout = document.getElementById("logout");
setPanel(false);

