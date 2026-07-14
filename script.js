const saveButton = document.getElementById("saveButton");

if (saveButton) {

    saveButton.addEventListener("click", function () {

    const card = {
        book: document.getElementById("book").value,
        questionNumber: document.getElementById("questionNumber").value,
        tag: document.getElementById("tag").value,
        question: document.getElementById("question").value,
        answer: document.getElementById("answer").value,
        memo: document.getElementById("memo").value,
        status: "new"
    };

    const cards = JSON.parse(localStorage.getItem("cards")) || [];

    cards.push(card);

    localStorage.setItem("cards", JSON.stringify(cards));

    alert("保存しました！");
    });
}

if (document.getElementById("cardList")) {

    const cards =
        JSON.parse(localStorage.getItem("cards")) || [];

    const cardList =
        document.getElementById("cardList");

    cards.forEach(function(card, index) {

        const div = document.createElement("div");

        let statusText = "未評価";

        if (card.status === "good") {
            statusText = "◎";
        }
        
        else if (card.status === "normal") {
            statusText = "△";
        }

        else if (card.status === "bad") {
            statusText = "✕";
        }
        
        div.innerHTML = `
            <a href="detail.html?index=${index}">
                <h3>${card.book} ${card.questionNumber}</h3>
                <p>${card.tag}</p>
                <p>状態:${statusText}</p>
            </a>
        `;

        cardList.appendChild(div);

    });

}

if (document.getElementById("cardDetail")) {

    const params = new URLSearchParams(window.location.search);

    const index = params.get("index");

    const cards =
        JSON.parse(localStorage.getItem("cards")) || [];

    const card = cards[index];

    const cardDetail =
        document.getElementById("cardDetail");

    cardDetail.innerHTML = `
        <h2>${card.book} ${card.questionNumber}</h2>

        <p><strong>タグ</strong></p>
        <p>${card.tag}</p>

        <p><strong>質問</strong></p>
        <p>${card.question}</p>

        <p><strong>答え</strong></p>
        <p>${card.answer}</p>

        <p><strong>メモ</strong></p>
        <p>${card.memo}</p>
    `;

    document
    .getElementById("editButton")
    .addEventListener("click", function () {

        window.location.href =
            `edit.html?index=${index}`;

    });

    document
    .getElementById("deleteButton")
    .addEventListener("click", function () {

        const result =
            confirm("本当に削除しますか？");

        if (!result) {
            return;
        }

        cards.splice(index, 1);

        localStorage.setItem(
            "cards",
            JSON.stringify(cards)
        );

        alert("削除しました！");

        window.location.href =
            "list.html";
    });
}

if (document.getElementById("reviewCard")) {

    const cards =
        JSON.parse(localStorage.getItem("cards")) || [];

    const reviewCards = cards.filter(function(card) {

        return card.status === "new" ||
               card.status === "bad" ||
               card.status === "normal";

    });

    console.log("reviewCards", reviewCards);
    console.log("件数", reviewCards.length);
    
    let currentIndex = 0;

    console.log(reviewCards);

    const reviewCard =
        document.getElementById("reviewCard");

    if (reviewCards.length === 0) {

        reviewCard.innerHTML = `
            <h2>復習対象はありません！</h2>
        `;

    } else {

        function showCard() {

        const card = reviewCards[currentIndex];

        reviewCard.innerHTML = `
            
            <p class="progress">
                ${currentIndex + 1} / ${reviewCards.length}問
            </p>

            <h2>${card.question}</h2>

            <button id="showAnswerButton">
                答えを見る
            </button>

            <div id="answerArea"></div>
        `;

        document
            .getElementById("showAnswerButton")
            .addEventListener("click", function () {

                document
                    .getElementById("answerArea")
                    .innerHTML = `
                        <hr>

                        <p><strong>答え</strong></p>
                        <p>${card.answer}</p>

                        <p><strong>メモ</strong></p>
                        <p>${card.memo}</p>

                        <button id="goodButton">◎覚えた</button>
                        <button id="normalButton">△微妙</button>
                        <button id="badButton">✕忘れた</button>
                    `;

                document
                    .getElementById("goodButton")
                    .addEventListener("click", function () {
                        nextCard("good");
                    });

                document
                    .getElementById("normalButton")
                    .addEventListener("click", function () {
                        nextCard("normal");
                    });

                document
                    .getElementById("badButton")
                    .addEventListener("click", function () {
                        nextCard("bad");
                    });

            });

        }

        function nextCard(status) {

            reviewCards[currentIndex].status = status;

            localStorage.setItem(
                "cards",
                JSON.stringify(cards)
            );

            console.log(reviewCards[currentIndex]);

            currentIndex++;

            if (currentIndex >= reviewCards.length) {

                reviewCard.innerHTML = `
                    <h2>今日の復習は終了！</h2>
                
                    <button id="backButton">
                        一覧へ戻る
                    </button>
                                
                `;
            
                document
                    .getElementById("backButton")
                    .addEventListener("click", function () {

                        window.location.href = "list.html";

                    });

                return;
            }

            showCard();
        }

        showCard();
        
    }
        
}

function updateStatus(status) {

    const params =
        new URLSearchParams(window.location.search);

    const index = params.get("index");

    const cards =
        JSON.parse(localStorage.getItem("cards")) || [];

    cards[index].status = status;

    localStorage.setItem(
        "cards",
        JSON.stringify(cards)
    );

    alert("評価を保存しました！");
    location.reload();
}

if (document.getElementById("reviewCount")) {

    const cards =
        JSON.parse(localStorage.getItem("cards")) || [];

    const reviewCount = cards.filter(function(card) {

        return card.status === "normal" ||
               card.status === "bad";

    }).length;

    const newCount = cards.filter(function(card) {

        return card.status === "new";

    }).length;

    const goodCount = cards.filter(function(card) {
        
        return card.status === "good";
    
    }).length;

    document.getElementById("reviewCount").textContent =
        `今日の復習 ${reviewCount}件`;

    document.getElementById("newCount").textContent =
        `未復習 ${newCount}件`;
        
    document.getElementById("goodCount").textContent =
        `習得済み ${goodCount}件`;

}

if (document.getElementById("updateButton")) {

    const params =
        new URLSearchParams(window.location.search);

    const index = params.get("index");

    const cards =
        JSON.parse(localStorage.getItem("cards")) || [];

    const card = cards[index];

    document.getElementById("book").value =
        card.book;

    document.getElementById("questionNumber").value =
        card.questionNumber;

    document.getElementById("tag").value =
        card.tag;

    document.getElementById("question").value =
        card.question;

    document.getElementById("answer").value =
        card.answer;

    document.getElementById("memo").value =
        card.memo;

    document
    .getElementById("updateButton")
    .addEventListener("click", function () {

        cards[index].book =
            document.getElementById("book").value;

        cards[index].questionNumber =
            document.getElementById("questionNumber").value;

        cards[index].tag =
            document.getElementById("tag").value;

        cards[index].question =
            document.getElementById("question").value;

        cards[index].answer =
            document.getElementById("answer").value;

        cards[index].memo =
            document.getElementById("memo").value;

        localStorage.setItem(
            "cards",
            JSON.stringify(cards)
        );

        alert("更新しました！");

        window.location.href =
            `detail.html?index=${index}`;

    });
}