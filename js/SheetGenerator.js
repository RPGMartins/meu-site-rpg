async function gerarFichaHTML() {
const res = await fetch("./ficha/ficha_template.html");
let html = await res.text();

  html = html
    .replace("{{NOME}}", CharacterState.name || "Sem nome")
    .replace("{{RACA}}", CharacterState.race?.name || "—")
    .replace("{{CLASSE}}", CharacterState.class?.name || "—");

  baixarArquivo(html, "ficha_personagem.html");
}

function baixarArquivo(conteudo, nomeArquivo) {
  const blob = new Blob([conteudo], { type: "text/html;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = nomeArquivo;
  a.click();

  URL.revokeObjectURL(url);
}
