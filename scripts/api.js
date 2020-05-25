export default class Api {
    constructor(options) {
      this.baseUrl = options.baseUrl;
      this.headers = options.headers;
    }

    template(url, method, body){
      return fetch(`${this.baseUrl}/${url}`, {
        method,
        headers: this.headers,
        body: method === "GET" ? undefined : JSON.stringify(body)
      })
        .then(res => {
          if (res.ok){
            return res.json();
          }
          return Promise.reject(`Ошибка: ${res.status}`);
        });
    }

    defaultCatch(err){
      console.log(err);
    }

    getInitialCards() {
      return this.template("cards", "GET");
    }

    getUserProfile(){
      return this.template("users/me", "GET");
    }

    editUserData(name, about){
      return this.template("users/me", "PATCH", {
        name,
        about
      })
    }
    
    addCard(name, link){
      return this.template("cards", "POST", {
        name, 
        link
      })
    }
  }
