// Helper class to handle filtering, sorting, searching, and pagination
// for product queries (used in productController)
class APIFeatures {
  constructor(query, queryString) {
    this.query = query; // Mongoose query object
    this.queryString = queryString; // req.query from Express
  }

  // Search by product title (case-insensitive)
  search() {
    if (this.queryString.keyword) {
      this.query = this.query.find({
        title: { $regex: this.queryString.keyword, $options: "i" },
      });
    }
    return this;
  }

  // Filter by category, price range, etc.
  filter() {
    const queryCopy = { ...this.queryString };
    const excludedFields = ["keyword", "sort", "page", "limit", "fields"];
    excludedFields.forEach((field) => delete queryCopy[field]);

    // Convert gte/gt/lte/lt to MongoDB operators ($gte, $gt, etc.)
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  // Sort: price_asc, price_desc, newest (createdAt desc)
  sort() {
    if (this.queryString.sort) {
      const sortMap = {
        price_asc: "price",
        price_desc: "-price",
        newest: "-createdAt",
        oldest: "createdAt",
      };
      const sortBy = sortMap[this.queryString.sort] || "-createdAt";
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt"); // default: newest first
    }
    return this;
  }

  // Pagination
  paginate() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 12;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

export default APIFeatures;