class API {
  private path: any = process.env.REACT_APP_GET_DEALS_PATH;

  public getDeals() {
    fetch(this.path)
      .then(res => res.json())
      .then(data => {
        console.log(data, "data");
      })
      .catch(err => {
        console.log(err, "error");
      });
  }
}

export default API;
