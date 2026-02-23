from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User, UserRole
from app.models.product import Product, ProductCategory
from app.schemas.product import ProductCreate, ProductUpdate

router = APIRouter(prefix="/products", tags=["products"])

@router.get("")
def list_products(
    category: str | None = Query(default=None),
    search: str | None = Query(default=None),
    sortBy: str | None = Query(default=None),
    db: Session = Depends(get_db)
):
    query = db.query(Product)
    if category:
        cat = db.query(ProductCategory).filter(ProductCategory.name.ilike(category)).first()
        if cat:
            query = query.filter(Product.category_id == cat.id)
        else:
            return {"products": []}
    if search:
        like = f"%{search}%"
        query = query.filter((Product.name.ilike(like)) | (Product.description.ilike(like)))
    if sortBy == "price-low":
        query = query.order_by(Product.price.asc())
    elif sortBy == "price-high":
        query = query.order_by(Product.price.desc())
    elif sortBy == "newest":
        query = query.order_by(Product.created_at.desc())
    else:
        query = query.order_by(Product.name.asc())
    items = query.all()
    products = [
        {
            "id": str(p.id),
            "name": p.name,
            "description": p.description,
            "price": p.price,
            "category": db.query(ProductCategory).get(p.category_id).name if p.category_id else "",
            "image": p.image_url or "",
            "stock": p.stock_quantity,
            "rating": 0,
            "reviews": 0,
        }
        for p in items
    ]
    return {"products": products}

@router.get("/{product_id}")
def get_product(product_id: str, db: Session = Depends(get_db)):
    p = db.query(Product).get(int(product_id))
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    return {
        "id": str(p.id),
        "name": p.name,
        "description": p.description,
        "price": p.price,
        "category": db.query(ProductCategory).get(p.category_id).name if p.category_id else "",
        "image": p.image_url or "",
        "stock": p.stock_quantity,
        "rating": 0,
        "reviews": 0,
    }

@router.get("/categories")
def list_categories(db: Session = Depends(get_db)):
    cats = db.query(ProductCategory).order_by(ProductCategory.name.asc()).all()
    return {"categories": [c.name for c in cats]}

@router.post("", status_code=201)
def create_product(data: ProductCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if user.role != UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed")
    product = Product(
        name=data.name,
        description=data.description,
        price=data.price,
        image_url=data.image_url or "",
        category_id=data.category_id,
        sku=data.sku,
        stock_quantity=0
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return {"id": product.id}

@router.put("/{product_id}")
def update_product(product_id: int, data: ProductUpdate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if user.role != UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed")
    p = db.query(Product).get(product_id)
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(p, field, value)
    db.commit()
    return {"ok": True}

@router.delete("/{product_id}")
def delete_product(product_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if user.role != UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed")
    p = db.query(Product).get(product_id)
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(p)
    db.commit()
    return {"ok": True}
