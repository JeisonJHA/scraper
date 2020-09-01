import { Request, Response } from "express";
import OlxScraper from "../servers";

class ScrapController {
  public async create(req: Request, res: Response) : Promise<Response> {
    const olxScraper = new OlxScraper();
    await olxScraper.execute();
    return res.status(204).json();
  }
}

export default ScrapController;