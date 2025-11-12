import Link from "next/link";

import { categoryTable } from "../_db/schema";

import { Button } from "./ui/button";

interface CategorySelectorProps {
  categories: (typeof categoryTable.$inferSelect)[];
}

const CategorySelectorDesktop = ({ categories }: CategorySelectorProps) => {
  return (
    <div className="rounded-3xl lg:px-36">
      <div className="flex items-center justify-between">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant="ghost"
            className="mb-9 rounded-2xl bg-white font-medium text-[#656565]"
          >
            <Link href={`/category/${category.slug}`}>{category.name}</Link>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelectorDesktop;
