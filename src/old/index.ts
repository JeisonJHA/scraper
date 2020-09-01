import * as puppeteer from 'puppeteer';
const olx = 'https://sc.olx.com.br/florianopolis-e-regiao/grande-florianopolis/computadores-e-acessorios';
//?pe=1500&ps=600&q=notebook

(async () => {
  const browser = await puppeteer.launch(
    // {headless: false}
    );
  const page = await browser.newPage();
  const precoMin = 'ps=600';
  const precoMax = 'pe=1500';
  const pesquisa = 'q=notebook'
  await page.goto(`${olx}?${precoMax}&${precoMin}&${pesquisa}`);

  const produtos = await page.evaluate(()=>{
    const listaProdutos = document.querySelectorAll('ul#ad-list li a')
    const arrayProdutos = Array.from(listaProdutos).map((el)=>{
      const preco = el.querySelector('.jqSHIm');
      return {
        title: el.getAttribute('title'),
        link: el.getAttribute('href'),
        preco: preco ? preco.innerHTML : '0'
    }})
    return arrayProdutos;
  })
  console.log(produtos)
  //const page = await browser.newPage()
  // const produtosFiltrados = produtos.filter(element => {
  //   return element.title.toLowerCase().includes('notebook'.toLowerCase())
  // });
  // console.log(produtos);
  // console.log(produtosFiltrados);
  // await page.goto(produtos[0].link);
  // const teste = await page.evaluate(()=>{
  //   const listaProdutos = document.querySelectorAll('span.eqxsIR');
  //   const arrayProdutos = Array.from(listaProdutos).map(el=>({desc:el.textContent}))
  //   console.log(arrayProdutos)
  //   return arrayProdutos;
  // })
  // console.log(teste)
  
  browser.close()

  // const raspar = new Crawler({
  //   callback : function (error,res,done){
  //     if(error){
  //       console.log(error);
  //     }else{
  //       const $ = res.$;
  //       console.log($('#wrapper > div.centerdiv > div.gridProd').text().trim())
  //     }
  //     done();
  //   }
  // });
  // raspar.queue(sitepesquisa);
})();

