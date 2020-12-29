class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObject = { ...this.queryString };

    // Filtering

    const exludedQueryStrings = ["page", "limit", "sort", "fields"];

    exludedQueryStrings.forEach(
      (queryString) => delete queryObject[queryString]
    );

    let queryString = JSON.stringify(queryObject);

    queryString = JSON.parse(
      queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
    );

    this.query = this.query.find(queryString);
    return this;
  }

  sort() {
    // Sorting
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    //Field limiting
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");

      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  pagination() {
    // pagination
    const limit = +this.queryString.limit || 100;

    const page = +this.queryString.page || 1;

    const skipValue = (page - 1) * limit;

    this.query = this.query.skip(skipValue).limit(limit);

    // if (this.queryString.page) {
    //   const numberOfTours = await Tour.countDocuments();
    //   if (skipValue >= numberOfTours)
    //     throw new Error("This page is not available");
    // }
    return this;
  }
}

export default APIFeatures;
