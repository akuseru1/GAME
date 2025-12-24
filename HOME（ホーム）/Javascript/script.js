document.getElementById("toggleBtn").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("expanded");
});

// 画像スタックの設定
const imageStack = document.getElementById("imageStack");
const questionBlock = document.getElementById("questionBlock");

// 画像のURL配列（5枚、自由に増やせます）
const imageUrls = [
  "../img/noteのロゴ.png",
  "../img/tiktokのロゴ.png",
  "../img/Xのロゴ.png",
  "../img/youtubeのロゴ.png",
  "../img/インスタのロゴ.png"
];

// 各画像をクリックしたときに飛ぶURL配列（それぞれ異なるURL）
const linkUrls = [
  "https://note.com/kendamajirou",           // 1枚目（左から2番目）
  "https://www.tiktok.com/@kendamajirou_honmono?lang=ja-JP",     // 2枚目（左から1番目）
  "https://x.com/kendamajirou",               // 3枚目（真ん中）
  "https://www.youtube.com/feed/you",    // 4枚目（右から1番目）
  "https://www.instagram.com/kendamajirou/"   // 5枚目（右から2番目）
];

// 画像を生成してスタックに追加
function createImageStack() {
  imageStack.innerHTML = ""; // 既存の画像をクリア
  
  imageUrls.forEach((url, index) => {
    // 画像をラップするリンク要素を作成
    const link = document.createElement("a");
    link.href = linkUrls[index];
    link.target = "_blank"; // 新しいタブで開く
    link.rel = "noopener noreferrer"; // セキュリティのため
    link.style.textDecoration = "none";
    link.style.display = "block";
    link.style.width = 70;
    link.style.height = 70;
    
    const img = document.createElement("img");
    img.src = url;
    img.className = "stack-image";
    img.height = 70;
    img.style.cursor = "pointer"; // クリック可能であることを示す
    
    const totalImages = imageUrls.length;
    const centerIndex = Math.floor(totalImages / 2); // 真ん中のインデックス（0ベース）
    
    if (index === centerIndex) {
      img.classList.add("center");
    } else if (index < centerIndex) {
      img.classList.add("left");
    } else {
      img.classList.add("right");
    }
    
    link.appendChild(img);
    imageStack.appendChild(link);
  });
}

// アニメーションを開始（横に広がる）
function startAnimation() {
  const links = imageStack.querySelectorAll("a"); // リンク要素を取得
  const images = imageStack.querySelectorAll(".stack-image");
  const totalImages = images.length;
  const centerIndex = Math.floor(totalImages / 2);
  
  // 真ん中の画像はそのまま（既に表示されている）
  if (images[centerIndex]) {
    images[centerIndex].classList.add("animate-center");
  }
  
  // 0.5秒後に左右の画像を横に広げる
  setTimeout(() => {
    images.forEach((img, index) => {
      if (index === centerIndex) return; // 真ん中はスキップ
      
      const distanceFromCenter = Math.abs(index - centerIndex);
      const isLeft = index < centerIndex;
      
      if (isLeft) {
        // 左側の画像（距離に応じてクラスを追加）
        if (distanceFromCenter === 1) {
          img.classList.add("animate-left-1");
        } else if (distanceFromCenter === 2) {
          img.classList.add("animate-left-2");
        } else {
          // 3枚以上離れている場合の処理
          const translateX = -(40 * distanceFromCenter); // 間隔を半分に
          img.style.transform = `translateX(${translateX}px) scale(1) translateZ(0)`;
        }
      } else {
        // 右側の画像
        if (distanceFromCenter === 1) {
          img.classList.add("animate-right-1");
        } else if (distanceFromCenter === 2) {
          img.classList.add("animate-right-2");
        } else {
          // 3枚以上離れている場合の処理
          const translateX = 40 * distanceFromCenter; // 間隔を半分に
          img.style.transform = `translateX(${translateX}px) scale(1) translateZ(0)`;
        }
      }
    });
    
    // リンク要素も同じ位置に移動
    links.forEach((link, index) => {
      if (index === centerIndex) return;
      
      const distanceFromCenter = Math.abs(index - centerIndex);
      const isLeft = index < centerIndex;
      
      if (isLeft) {
        const translateX = -(40 * distanceFromCenter); // 間隔を半分に
        link.style.transform = `translateX(${translateX}px)`;
      } else {
        const translateX = 40 * distanceFromCenter; // 間隔を半分に
        link.style.transform = `translateX(${translateX}px)`;
      }
    });
  }, 500); // 0.5秒待つ
}

// アニメーションをリセット
function resetAnimation() {
  const images = imageStack.querySelectorAll(".stack-image");
  const links = imageStack.querySelectorAll("a");
  
  images.forEach(img => {
    img.classList.remove("animate-center", "animate-left-1", "animate-left-2", "animate-right-1", "animate-right-2");
    img.style.transform = "";
    img.style.opacity = "";
  });
  
  links.forEach(link => {
    link.style.transform = "";
  });
}

// 初期化
createImageStack();

// 表示状態を管理
let isVisible = false;

// 点滅して非表示にする関数
function fadeOutWithBlink() {
  const images = imageStack.querySelectorAll(".stack-image");
  images.forEach(img => {
    img.classList.add("blinking");
  });
  
  // 2秒後に非表示にする
  setTimeout(() => {
    imageStack.classList.remove("visible", "rising", "risen");
    images.forEach(img => {
      img.classList.remove("blinking");
    });
    resetAnimation();
  }, 2000);
}

// QuestionBlockをクリックした時の処理（トグル機能）
questionBlock.addEventListener("click", () => {
  if (isVisible) {
    // 点滅して非表示にする
    fadeOutWithBlink();
    isVisible = false;
  } else {
    // 表示にする
    imageStack.classList.add("visible");
    resetAnimation();
    // 少し待ってから上に上がるアニメーションを開始
    setTimeout(() => {
      imageStack.classList.add("rising");
      // 上に上がりきった後（0.5秒後）にz-indexを高くして前面に
      setTimeout(() => {
        imageStack.classList.add("risen");
        imageStack.classList.remove("rising");
        startAnimation();
      }, 500);
    }, 50);
    isVisible = true;
  }
});