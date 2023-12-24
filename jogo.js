document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    const jogador = { x: 200, y: 200, tamanho: 20, cor: "#e74c3c", velocidade: 5 };
    const inimigos = [];
    const esfera = { x: Math.random() * (canvas.width - 20), y: Math.random() * (canvas.height - 20), tamanho: 10, cor: "#2ecc71" };
    const obstaculos = [];
    
    let pontuacao = 0;
    let vidas = 3;
    let fimDeJogo = false;
    let nivel = 1;

    function Dificuldade() {
        if (nivel >= 2) { jogador.velocidade = 10; }
        if (nivel >= 3) {
            canvas.width += 50;
            canvas.height += 50;
            inimigos.push(...Array.from({ length: 2 }, () => ({ x: Math.random() * (canvas.width - 20), y: Math.random() * (canvas.height - 20), tamanho: 20, cor: "#3498db", velocidade: 5 })));
        }
        if (nivel % 2 === 0) { inimigos.push({ x: Math.random() * (canvas.width - 20), y: Math.random() * (canvas.height - 20), tamanho: 20, cor: "#3498db", velocidade: 5 }); }
        if (nivel % 5 === 0) { inimigos.length = 0; reposicionarEsfera(); }
        if (nivel === 4) { obstaculos.push(...Array.from({ length: 5 }, () => ({ x: Math.random() * (canvas.width - 20), y: Math.random() * (canvas.height - 20), tamanho: 20, cor: "#000000" }))); }
    }

    function Drawn() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!fimDeJogo) {
            ctx.fillStyle = jogador.cor;
            ctx.fillRect(jogador.x, jogador.y, jogador.tamanho, jogador.tamanho);

            ctx.fillStyle = esfera.cor;
            ctx.beginPath();
            ctx.arc(esfera.x, esfera.y, esfera.tamanho, 0, Math.PI * 2);
            ctx.fill();

            inimigos.concat(obstaculos).forEach(item => {
                ctx.fillStyle = item.cor;
                ctx.fillRect(item.x, item.y, item.tamanho, item.tamanho);
            });
        }

        ctx.fillStyle = "#333";
        ctx.font = "20px Arial";
        ctx.fillText("Pontuação: " + pontuacao, 10, 30);
        ctx.fillText("Vidas: " + vidas, canvas.width - 150, 30);
        ctx.fillText("Nível: " + nivel, canvas.width - 150, 60);
    }

    function Colisao() {
        if (colidir(jogador, esfera)) { pontuacao++; reposicionarEsfera(); }
        
        inimigos.concat(obstaculos).forEach(item => {
            if (colidir(jogador, item)) {
                vidas--;
                reposicionarJogador();
                if (vidas === 0) { fimDeJogo = true; }
            }
        });
        
        inimigos.forEach(inimigo => {
            if (colidir(inimigo, esfera)) { reposicionarEsfera(); }
            obstaculos.forEach(obstaculo => { if (colidir(inimigo, obstaculo)) { reposicionarItem(inimigo); } });
        });
    }

    function reposicionarEsfera() { reposicionarItem(esfera); }

    function reposicionarJogador() { reposicionarItem(jogador); }

    function reposicionarItem(item) {
        item.x = Math.random() * (canvas.width - item.tamanho);
        item.y = Math.random() * (canvas.height - item.tamanho);
    }

    function colidir(a, b) { return a.x < b.x + b.tamanho && a.x + a.tamanho > b.x && a.y < b.y + b.tamanho && a.y + a.tamanho > b.y; }

    function Reset() {
        nivel = 1;
        canvas.width = 400;
        canvas.height = 400;
        jogador.velocidade = 5;
        obstaculos.length = 0;
        inimigos.length = 0;
        reposicionarJogador();
        reposicionarEsfera();
    }

    function Mover(event) {
        if (fimDeJogo) {
            if (event.key === " ") {
                Reset();
                pontuacao = 0;
                vidas = 3;
                fimDeJogo = false;
                document.getElementById("gameOverText").style.display = "none";
                document.getElementById("congratsText").style.display = "none";
            }
        } else {
            switch (event.key) {
                case "ArrowLeft": jogador.x -= jogador.velocidade; break;
                case "ArrowRight": jogador.x += jogador.velocidade; break;
                case "ArrowUp": jogador.y -= jogador.velocidade; break;
                case "ArrowDown": jogador.y += jogador.velocidade; break;
            }

            jogador.x = Math.max(0, Math.min(canvas.width - jogador.tamanho, jogador.x));
            jogador.y = Math.max(0, Math.min(canvas.height - jogador.tamanho, jogador.y));

            inimigos.forEach(inimigo => {
                inimigo.x += inimigo.x < jogador.x ? inimigo.velocidade : -inimigo.velocidade;
                inimigo.y += inimigo.y < jogador.y ? inimigo.velocidade : -inimigo.velocidade;
            });

            Colisao();
            Drawn();

            if (pontuacao >= 5) {
                nivel++;
                Dificuldade();
                pontuacao = 0;

                if (nivel === 5) {
                    document.getElementById("congratsText").style.display = "block";
                    fimDeJogo = true;
                }
            }

            if (vidas === 0) {
                document.getElementById("gameOverText").style.display = "block";
                fimDeJogo = true;
            }
        }
    }

    document.addEventListener("keydown", Mover);
    setInterval(Drawn, 1000 / 30);
    Dificuldade();
});