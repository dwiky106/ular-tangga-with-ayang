document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.querySelector('.game-board');
    const rollDiceButton = document.getElementById('roll-dice');
    const diceResultElement = document.getElementById('dice-result');
    const playerTurnElement = document.getElementById('player-turn');
    const popupContainer = document.getElementById('popup');
    const popupBox = popupContainer.querySelector('.popup-box');
    const popupContent = document.getElementById('popup-content');
    const closeBtn = popupContainer.querySelector('.close-btn');

    const boardSize = 100;
    const board = [];

    let playerPositions = [0, 0];
    let currentPlayer = 0;

    const playerPawns = [
        document.createElement('div'),
        document.createElement('div')
    ];
    playerPawns[0].classList.add('player-pawn', 'p1');
    playerPawns[0].textContent = 'Ayg1';
    playerPawns[1].classList.add('player-pawn', 'p2');
    playerPawns[1].textContent = 'Ayg2';
    boardElement.appendChild(playerPawns[0]);
    boardElement.appendChild(playerPawns[1]);

    const snakesAndLadders = {
        // Ular dengan pesan
        16: { to: 6, img: 'snake_16.png', message: 'Kalo bosen satu sama lain, apa yang kudu mbok lakuin?' },
        47: { to: 26, img: 'snake_47.png', message: 'sebutin selain kata lopyu yang bikin dirimu seneng' },
        49: { to: 11, img: 'snake_49.png', message: 'sebutkan 2 kebiasaan dari pasanganmu yang membuatmu tambah tresno' },
        56: { to: 53, img: 'snake_56.png', message: 'kalo misal pasanganmu tiba-tiba gaada kabar karena sibuk kerjaan apa yang dirimu lakuin' },
        62: { to: 19, img: 'snake_62.png', message: 'milih mie ayam apa sate ayam?' },
        64: { to: 60, img: 'snake_64.png', message: 'berapa tahun keinginanmu rabi karo pasanganmu?' },
        87: { to: 24, img: 'snake_87.png', message: 'sebutkan 4 fakta baru yang mbok dapet dari pasangnmu dalam 48 jam terakhir' },
        93: { to: 73, img: 'snake_93.png', message: 'pengen punya anak berapa nanti kalo udah nikah?' },
        95: { to: 75, img: 'snake_95.png', message: 'sebutkan 5 sifat yang kamu sukai dari pasanganmu?' },
        98: { to: 78, img: 'snake_98.png', message: 'lebih suka naik mobil atau kereta?' },
        // Tangga dengan pesan
        1: { to: 38, img: 'ladder_1.png', message: 'Ya atau Tidak, kalo ldr ketemuannya 5 bulan sekali' },
        4: { to: 14, img: 'ladder_4.png', message: 'Setuju atau Tidak, kalo pasanganmu ketika udah nikah tidur lebih awal daripada dirimu' },
        9: { to: 31, img: 'ladder_9.png', message: 'Ya atau Tidak, jika kamu di anugerahi anak perempuan' },
        21: { to: 42, img: 'ladder_21.png', message: 'Setuju atau Tidak kalo udah nikah pasanganmu minta jatah lebih dari 5 kali sehari' },
        28: { to: 84, img: 'ladder_28.png', message: 'Suka atau Tidak, kalo ldr nya lebih dari 3 tahun' },
        36: { to: 44, img: 'ladder_36.png', message: 'Setuju atau Tidak, kalo nanti udah nikah pas tidur berdua sama-sama gak pake baju' },
        51: { to: 67, img: 'ladder_51.png', message: 'Kalo ldr pas ketemuan mau ngapain? jawab selain jalan-jalan, makan bareng, dolan bareng.' },
        71: { to: 91, img: 'ladder_71.png', message: 'Pengen komunikasi sama pasangan pas ldr mau berapa jam sehari?' },
        80: { to: 100, img: 'ladder_80.png', message: 'apa yang bakal kamu lakuin kalo ada yang deketin kamu pas ldr' }
    };

    function createBoard() {
        for (let i = boardSize; i >= 1; i--) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.cell = i;
            board[i] = cell;

            if (snakesAndLadders[i]) {
                const img = document.createElement('img');
                img.src = snakesAndLadders[i].img;
                img.alt = snakesAndLadders[i].to > i ? 'Tangga' : 'Ular';
                img.classList.add('cell-image');
                cell.appendChild(img);
            } else {
                cell.textContent = i;
            }

            const row = Math.ceil((boardSize - i + 1) / 10);
            if (row % 2 === 1) {
                boardElement.appendChild(cell);
            } else {
                boardElement.prepend(cell);
            }
        }
    }

    // Fungsi untuk menampilkan pop-up dengan warna pemain
    function showPopup(message, isLadder, playerIndex) {
        popupContent.textContent = message;
        // Hapus kelas sebelumnya
        popupBox.classList.remove('p1', 'p2', 'snake', 'ladder');

        // Tambahkan kelas warna pemain
        popupBox.classList.add(`p${playerIndex + 1}`);

        // Tambahkan kelas jenis ular/tangga
        if (isLadder) {
            popupBox.classList.add('ladder');
        } else {
            popupBox.classList.add('snake');
        }

        popupContainer.classList.add('show');
    }

    // Fungsi untuk menyembunyikan pop-up
    function hidePopup() {
        popupContainer.classList.remove('show');
    }

    // Menambahkan event listener pada tombol tutup pop-up
    closeBtn.addEventListener('click', hidePopup);

    function movePawn(playerIndex, newPosition) {
        if (newPosition > boardSize) {
            newPosition = playerPositions[playerIndex];
        }

        playerPositions[playerIndex] = newPosition;
        const targetCell = board[playerPositions[playerIndex]];
        
        if (targetCell) {
            const cellRect = targetCell.getBoundingClientRect();
            const boardRect = boardElement.getBoundingClientRect();

            let xOffset = 0;
            if (playerIndex === 1) {
                const pawnWidth = playerPawns[playerIndex].offsetWidth;
                const cellWidth = cellRect.width;
                xOffset = (cellWidth - (pawnWidth * 2)) / 2 + pawnWidth;
            } else {
                const pawnWidth = playerPawns[playerIndex].offsetWidth;
                const cellWidth = cellRect.width;
                xOffset = (cellWidth - (pawnWidth * 2)) / 2;
            }

            playerPawns[playerIndex].style.left = `${cellRect.left - boardRect.left + xOffset}px`;
            playerPawns[playerIndex].style.top = `${cellRect.top - boardRect.top + (cellRect.height / 2) - (playerPawns[playerIndex].offsetHeight / 2)}px`;
        }
    }

    function checkSnakesAndLadders() {
        const currentPlayerPos = playerPositions[currentPlayer];
        if (snakesAndLadders[currentPlayerPos]) {
            const finalPosition = snakesAndLadders[currentPlayerPos].to;
            const isLadder = finalPosition > currentPlayerPos;
            const message = snakesAndLadders[currentPlayerPos].message;

            // Tampilkan alert sebelum pop-up
            if (isLadder) {
                alert(`Cie Ayang ${currentPlayer + 1} naik tangga ke petak ${finalPosition}!`);
            } else {
                alert(`Hahaha.. Ayang ${currentPlayer + 1} dimakan uler turun deh ke petak ${finalPosition}!`);
            }

            setTimeout(() => {
                movePawn(currentPlayer, finalPosition);
                // Kirim indeks pemain ke fungsi showPopup
                showPopup(message, isLadder, currentPlayer);
                if (finalPosition === boardSize) {
                    const winMessage = `Horeee ${currentPlayer + 1} menang!`;
                    showPopup(winMessage, true, currentPlayer);
                    rollDiceButton.disabled = true;
                    rollDiceButton.textContent = 'Game Selesai!';
                }
            }, 750);
        }
    }

    function rollDice() {
        if (playerPositions[currentPlayer] === boardSize) {
            return;
        }
        
        hidePopup();

        rollDiceButton.disabled = true;
        rollDiceButton.textContent = 'Melempar...';

        const diceRoll = Math.floor(Math.random() * 6) + 1;
        diceResultElement.textContent = `Anda mendapat angka: ${diceRoll}`;
        
        const newPotentialPosition = playerPositions[currentPlayer] + diceRoll;
        
        movePawn(currentPlayer, newPotentialPosition);
        
        setTimeout(() => {
            if (newPotentialPosition === boardSize) {
                alert(`Horeee ${currentPlayer + 1} menang!`);
                const winMessage = `Horeee ${currentPlayer + 1} menang!`;
                showPopup(winMessage, true, currentPlayer);
                rollDiceButton.disabled = true;
                rollDiceButton.textContent = 'Game Selesai!';
            } else if (newPotentialPosition > boardSize) {
                alert(`Pemain ${currentPlayer + 1}, harus mendarat tepat di petak 100 untuk menang!`);
                const overMessage = `Pemain ${currentPlayer + 1}, harus mendarat tepat di petak 100 untuk menang!`;
                showPopup(overMessage, false, currentPlayer);
            } else {
                checkSnakesAndLadders();
                
                if (!snakesAndLadders[newPotentialPosition]) {
                    currentPlayer = 1 - currentPlayer;
                    playerTurnElement.textContent = `Giliran: Pemain ${currentPlayer + 1}`;
                }
            }
            
            rollDiceButton.disabled = false;
            rollDiceButton.textContent = 'Lempar Dadu!';
        }, 1500);
    }
    
    createBoard();
    movePawn(0, 1);
    movePawn(1, 1);

    rollDiceButton.addEventListener('click', rollDice);
});
