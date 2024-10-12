var processamento=require('./processamento.js')
const sqlite3 = require('sqlite3').verbose();

function abre_jogo(){
  let db = new sqlite3.Database('../bd/steam.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Conectou com o banco de dados!');
  });
  return db;
}
  
function escreve_banco(row,res){

  //Eu tô usando row nesses id para eles se tornarem ids únicos paa cada jogo, assim não dando erro no front-end, gentilmente Asafesseidon Sapphire, se isso causar algum problema desculpa solenemente.
  res.write('<div class="accordion-item bg-dark">');

  res.write('<h2 class="accordion-header" id="panelsStayOpen-heading'+row+'">');

  res.write('<button class="accordion-button bg-dark" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true"aria-controls="panelsStayOpen-collapse'+value+'">');
  res.write('<div class="nome col-sm-9">'+row.Nome+'</div>');
  res.write('<div class="tag col-sm-3">'+row.Tag+'</div>');
  res.write('</button>');
  res.write('</h2>');
  res.write('<div id="panelsStayOpen-collapse'+row+'" class="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-heading'+row+'">');

  res.write('<div class="accordion-body py-5">');

  res.write('<div class="row">');

  res.write('<div class="col-sm-3 buttonParaComprarJogo"><div>'+row.Valor+'</div><button type="button" class="btn btn-outline-success fs-4" >Comprar</button></div>');
  res.write('<div class="col-sm-1 classification"><img src="../logo/classificacao-'+row.idade_minima+'-anos-logo.jpeg" alt=""></div>');//Usei a idade pra mudar a classificação do jogo exibida, embora foi necessário trocar o valor nas opções do cadastro para o valor da classificação, Livre tem o valor de 0.

  res.write('<div class="col-sm-8 fs-2">Descrição</div>');
  res.write('<div class="col-sm-9 fs-2"></div>');
  res.write('</div>');
  res.write('</div>');
  res.write('</div>');
  res.write('</div>');
  res.write('</div>');
  //res.write("<tr>");
  //res.write("<td>"+row.Valor+"</td>");
  //res.write("<td>"+row.Nome+"</td>");
  //res.write("<td>"+row.Tag+"</td>");
  //res.write("<td>"+row.idade_minima+"</td>");
  //res.write("</tr>");
}

//function cabeçalho(res){
//  res.write("<table border='1'>");
//  res.write("<tr>");
//  res.write("<th>Valor</th>");
//  res.write("<th>Nome</th>");
//  res.write("<th>Tag</th>");
//  res.write("<th>idade_minima</th>")
//  res.write("</tr>");
//}

function pega_jogo(res){
  res.writeHead(200, {'Content-Type': 'text/html'});

  res.write("<html><head><meta charset='UTF-8'><title>Loja</title>");
  res.write('<link rel="stylesheet" href="main.css">');
  res.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">');
  res.write('<link rel="shortcut icon" href="steam_verde_binaria.jpeg" type="image/x-icon"></link>');
  res.write('<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>');
  res.write('</head><body class="bg-dark">');
  res.write('<nav> <a href="principal.html">Home</a>');
  res.write('<a href="cadastrar_jogo.html">Cadastrar</a>')
  res.write('<disable>Loja</disable></nav>');
  res.write('<div class="container-fluid mt-1">');
  res.write("<h1>Loja</h1>");
  res.write('<div class="row">');
  res.write('<div class="col-sm-2"></div>');
  res.write('<div class="bg-success card col-sm-8">');
  res.write('<div class="accordion" id="accordionPanelsStayOpenExample">')

  let db = abre_jogo()
  db.all(`SELECT * FROM jogo`, [], (err, rows) => {
  if (err) {
    return console.error(err.message);
  }
  //cabeçalho(res)
  rows.forEach((row) => {
  escreve_banco(row,res)
  });
  res.write("</div>");
  res.write("</div>");
  res.write("</div>");
  res.write("</div>");
  res.write("<p><a href='/'>Voltar</a></p>");
  res.write("</div>");
  res.write("</body></html>");
  return res.end();
  });

  fechadb(db);
}
function checa_numero(n){
  return n>=0
}

function fechadb(db){
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Fechou a conexão com o banco de dados!');
  });
}
function registrador_jogo(q,res){
  let nome = q.query.nome; // Certifique-se de que o nome está sendo enviado pelo formulário
  let valor = q.query.valor;
  let tag = q.query.tag;
  let idade_minima=q.query.idade_minima
  // insere um registro no banco de dados
  if (checa_numero(valor)&&checa_numero(idade_minima)){
    console.log(checa_numero(valor)&&checa_numero(idade_minima),checa_numero(idade_minima),checa_numero(valor))
    db=abre_jogo()
    db.run(`INSERT INTO jogo(Nome, Valor, Tag, idade_minima) VALUES(?,?,?,?)`, [nome, valor, tag, idade_minima], function(err) {
      if (err) {
        return console.log(err.message);
      }
      console.log(`Registro feito com sucesso no id ${this.lastID}`);
      processamento.geral(res)
      fechadb(db)
    })
  }
  else{
    processamento.geral(res,'../htmls/cadastrar_jogo.html')
  }
};
module.exports = {
    pega_jogo: pega_jogo,
    registrador_jogo: registrador_jogo,
};