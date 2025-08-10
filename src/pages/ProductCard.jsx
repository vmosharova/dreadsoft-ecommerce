import { useState } from "react";

const ProductCard = ({ product, onClose, addProduct }) => {
  const [selectedVariant, setSelectedVariant] = useState("");
  const [quantity, setQuantity] = useState(1);
  
  // There is no `isOutOfStock` property in the product schema of https://fakestoreapi.com/products/,
  // but since that is one of the requirements in the assessment, let's pretend it is a boolean and it is in the product schema:
  const isOutOfStock = product.isOutOfStock;

  const variants = [
    "Small",
    "Medium", 
    "Large",
    "XL"
  ];

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    
    const productToAdd = {
      ...product,
      variant: selectedVariant,
      quantity: quantity
    };
    
    addProduct(productToAdd);
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        zIndex: 1050
      }}
      onClick={handleOverlayClick}
    >
      <div 
        className="bg-white rounded-3 shadow-lg position-relative"
        style={{
          maxWidth: "90vw",
          maxHeight: "90vh",
          width: "600px",
          overflowY: "auto"
        }}
      >
        <button
          className="btn-close position-absolute top-0 end-0 m-3"
          onClick={onClose}
          style={{ zIndex: 1051 }}
          aria-label="Close"
        ></button>
        
        <div className="container-fluid p-4">
          <div className="row">
            <div className="col-md-6 col-12 mb-3 mb-md-0">
              <img
                src={product.image}
                alt={product.title}
                className="img-fluid rounded"
                style={{
                  width: "100%",
                  height: "300px",
                  objectFit: "contain",
                  backgroundColor: "#f8f9fa"
                }}
              />
            </div>
            
            <div className="col-md-6 col-12">
              <div className="d-flex flex-column h-100">
                <div className="mb-2">
                  <span className="badge bg-secondary text-uppercase mb-2">
                    {product.category}
                  </span>
                  <h3 className="fw-bold mb-2" style={{ fontSize: "1.25rem" }}>
                    {product.title}
                  </h3>
                  
                  <div className="d-flex align-items-center mb-2">
                    <span className="text-warning me-1">
                      {"★".repeat(Math.floor(product.rating?.rate || 0))}
                      {"☆".repeat(5 - Math.floor(product.rating?.rate || 0))}
                    </span>
                    <small className="text-muted">
                      ({product.rating?.rate || 0}) • {product.rating?.count || 0} reviews
                    </small>
                  </div>
                  
                  <h4 className="text-success fw-bold mb-3">
                    ${product.price}
                  </h4>
                </div>
                
                <p className="text-muted small mb-3" style={{ fontSize: "0.9rem" }}>
                  {product.description?.length > 120 
                    ? `${product.description.substring(0, 120)}...`
                    : product.description
                  }
                </p>
                
                <div className="mb-3">
                  <label className="form-label fw-semibold mb-2">
                    Size Variant:
                  </label>
                  <select
                    className="form-select form-select-sm"
                    value={selectedVariant}
                    onChange={(e) => setSelectedVariant(e.target.value)}
                    disabled={isOutOfStock}
                  >
                    <option value="">Select size</option>
                    {variants.map((variant) => (
                      <option key={variant} value={variant}>
                        {variant}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-3">
                  <label className="form-label fw-semibold mb-2">
                    Quantity:
                  </label>
                  <div className="d-flex align-items-center">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={isOutOfStock || quantity <= 1}
                    >
                      -
                    </button>
                    <span className="mx-3 fw-bold">{quantity}</span>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={isOutOfStock}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="mt-auto">
                  {isOutOfStock ? (
                    <button 
                      className="btn btn-secondary w-100 py-2"
                      disabled
                    >
                      Out of Stock
                    </button>
                  ) : (
                    <>
                    <button
                      className="btn btn-dark w-100 py-2"
                      onClick={handleAddToCart}
                      disabled={!selectedVariant}
                    >
                      Add to Cart - ${(product.price * quantity).toFixed(2)}
                    </button>
                    {!selectedVariant &&
                      <div className="text-muted small mt-2">Please select a size variant.</div>
                    }
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;