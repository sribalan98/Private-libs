import axios from "axios";
import cheerio from "cheerio";

export default class IMDB {
  constructor() {
    this.baseURL = "https://www.imdb.com";
    this.session = axios.create({
      baseURL: this.baseURL,
      headers: {
        Accept: "application/json, text/plain, */*",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36",
        Referer: "https://www.imdb.com/",
      },
    });
    this.NA = "N/A";
  }

  async get_by_id(file_id) {
    const url = `${this.baseURL}/title/${file_id}`;
    try {
      const response = await this.session.get(url);
      const result = this.parseResponse(response);
      return result; // No need to JSON stringify here
    } catch (error) {
      console.error("Error occurred:", error);
      return this.NA;
    }
  }
  async get_by_url(url_link) {
    const url = `${url_link}`;
    try {
      const response = await this.session.get(url);
      const result = this.parseResponse(response);
      return result;
    } catch (error) {
      console.error("Error occurred:", error);
      return this.NA;
    }
  }

  parseResponse(response) {
    try {
      const $ = cheerio.load(response.data);
      const script = $("script[type='application/ld+json']").first().html();
      const jsonString = script.slice(
        script.indexOf("{"),
        script.lastIndexOf("}") + 1
      );
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("Error occurred while parsing response:", error);
      return this.NA;
    }
  }

  parseResult(result) {
    try {
      let parsed = result.replace(/[\r\n\t]/g, "");
      return JSON.parse(parsed);
    } catch (error) {
      console.error("Error occurred while parsing result:", error);
      return this.NA;
    }
  }
}
