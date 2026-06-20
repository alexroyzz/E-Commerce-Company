import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
    },
    image: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },
  },
  { timestamps: true },
);

// Auto-generate slug from name before saving
categorySchema.pre("save", function (next) {
  this.slug = this.name.toLowerCase().trim().replace(/\s+/g, "-");
});

const Category = mongoose.model("Category", categorySchema);
export default Category;
