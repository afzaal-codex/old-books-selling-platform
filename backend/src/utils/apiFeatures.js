class APIFeatures {
  constructor(query, queryString) {
    this.query = query;

    this.queryString = queryString;
  }



  // =========================================
  // SEARCH
  // =========================================

  search() {
    const keyword =
      this.queryString.keyword
        ? {
            title: {
              $regex:
                this.queryString.keyword,

              $options: "i",
            },
          }
        : {};

    this.query =
      this.query.find({
        ...keyword,
      });

    return this;
  }



  // =========================================
  // FILTER
  // =========================================

  filter() {
    const queryCopy = {
      ...this.queryString,
    };

    const removeFields = [
      "keyword",
      "page",
      "limit",
    ];

    removeFields.forEach((field) =>
      delete queryCopy[field]
    );

    this.query =
      this.query.find(queryCopy);

    return this;
  }



  // =========================================
  // PAGINATION
  // =========================================

  paginate(resultPerPage = 10) {
    const currentPage =
      Number(this.queryString.page) || 1;

    const skip =
      resultPerPage *
      (currentPage - 1);

    this.query =
      this.query
        .limit(resultPerPage)
        .skip(skip);

    return this;
  }
}

export default APIFeatures;