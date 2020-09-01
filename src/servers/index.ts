import axios from "axios";
import { load } from "cheerio";

import { ProductAttributes } from "../database/models/Product";
import { ProductCreateServer } from "./ProductCreateServer";

const olx =
  "https://sc.olx.com.br/florianopolis-e-regiao/grande-florianopolis/computadores-e-acessorios";
const maisRecentes = "sf=1";
const precoMin = "ps=600";
const precoMax = "pe=1500";
const pesquisa = "q=notebook";

class OlxScraper {
  public async execute() {
    var products = await this.getPageProducts();
    var productCreateServer = new ProductCreateServer();
    productCreateServer.execute(products)
    console.log(products);
  }

  private async getMainPage(): Promise<undefined|string> {
    try {
      const response = await axios.get(olx);
      return response.data;
    } catch (error) {
      console.error(`Erro ao coletar dados principais: ${error}`);
    }
  }

  private async nextPage(html: string) {
    try {
      const $ = load(html);
      console.log($('.iRQkdN').attr('href'));
    } catch (error) {
      console.error('Ocorreu um erro ao pegar a próxima página.');
    }
  }

  private async getLinks(): Promise<undefined|string[]> {
    try {
      const dados: Array<any> = [];
      const html = await this.getMainPage();
      this.nextPage(html);
      if (!html) throw new Error('Não encontrou o link');
      const $ = load(html);
      $("#ad-list > li > a").each((i, link) => {
        dados.push($(link).attr("href"));
      });
      return dados;
    } catch (error) {
      console.error(`Erro ao coletar os links: ${error}`);
    }
  }

  private async getDado(link: string): Promise<ProductAttributes> {
    try {
      const response = await axios.get(link);
      const html = response.data;
      const $ = load(html);
      const id = $(
        "#content > div.sc-1d7g5sb-3.jyDaIy > div > div.sc-bwzfXH.h3us20-0.cBfPri > div.sc-1ys3xot-0.h3us20-0.jAHFXn > div.h3us20-5.eeNNeS > div.h3us20-2.bdQAUC > div > span.sc-ifAKCX.sc-16iz3i7-0.fxfcRz"
      ).text();
      const title = $(
        "#content > div.sc-1d7g5sb-3.jyDaIy > div > div.sc-bwzfXH.h3us20-0.cBfPri > div.sc-1ys3xot-0.h3us20-0.jAHFXn > div.h3us20-5.heHIon > h1"
      ).text();
      const date = $(
        "#content > div.sc-1d7g5sb-3.jyDaIy > div > div.sc-bwzfXH.h3us20-0.cBfPri > div.sc-1ys3xot-0.h3us20-0.jAHFXn > div.h3us20-5.eeNNeS > div.h3us20-2.bdQAUC > div > span.sc-ifAKCX.sc-1oq8jzc-0.drrPdv"
      ).text();
      const description = $(
        "#content > div.sc-1d7g5sb-3.jyDaIy > div > div.sc-bwzfXH.h3us20-0.cBfPri > div.sc-1ys3xot-0.h3us20-0.jAHFXn > div.h3us20-5.ccSbwB > div > div.sc-1sj3nln-0.eSLnCp > div > p > span"
      ).text();
      const value = $(
        "#content > div.sc-1d7g5sb-3.jyDaIy > div > div.sc-bwzfXH.h3us20-0.cBfPri > div.sc-1ys3xot-0.h3us20-0.jAHFXn > div.h3us20-5.eenYUc > div > div.en9h1n-0.fBmarl > div > div > h2"
      ).text();
      return { id: +id.split(" ")[1], title, link, date, value, description };
    } catch (error) {
      console.error(`Erro ao coletar os dados: ${error}`);
    }
  }

  private async getPageProducts(): Promise<ProductAttributes[]> {
    const links = await this.getLinks();
    if (!links) return;
    return Promise.all(links.map(async (link) => await this.getDado(link)));
  }
}

export default OlxScraper;
