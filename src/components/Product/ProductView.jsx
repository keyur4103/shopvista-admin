import React from "react";
import getEditProduct from "../../hooks/getEditProduct";
import { useParams } from "react-router-dom";
import Spinner from "../../utils/Spinner";

const ProductView = () => {
  const { slug } = useParams();
  const { data: product, productGetSuccess, isFetching } = getEditProduct(slug);

  if (isFetching) {
    return <Spinner />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                {product.name}
              </h2>
              <img
                src={product.productCoverImage}
                alt={product.name}
                height={400}
                width={400}
              />
              <p className="text-lg text-gray-600 mb-4">
                {product.description}
              </p>
              <p className="text-lg text-gray-600 mb-4">
                Price: ${product.price}
              </p>
              <div className="flex flex-wrap mb-4">
                <p className="text-lg text-gray-600 mr-4">Colors: </p>
                {product.color.map((color) => (
                  <div
                    key={color._id}
                    className="w-6 h-6 rounded-full mr-2"
                    style={{ backgroundColor: color.name }}
                  ></div>
                ))}
              </div>
              <div className="flex flex-wrap">
                <p className="text-lg text-gray-600 mr-4">Sizes: </p>
                {product.size.map((size) => (
                  <div
                    key={size._id}
                    className="rounded-md border border-gray-300 py-1 px-3 mr-2 mb-2"
                  >
                    {size.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView;
