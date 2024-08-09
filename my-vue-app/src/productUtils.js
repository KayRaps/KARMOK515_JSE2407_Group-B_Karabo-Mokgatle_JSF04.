export const filterProducts = (products, category, sort) => {
    let filtered = products;
  
    if (category) {
      filtered = filtered.filter((product) => product.category === category);
    }
  
    if (sort === "low-to-high") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === "high-to-low") {
      filtered.sort((a, b) => b.price - a.price);
    }
  
    return filtered;
  };
  
  export const fetchCategories = async () => {
    try {
      const response = await fetch(
        "https://fakestoreapi.com/products/categories"
      );
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  };
  