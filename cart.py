from typing import Optional
from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.models.product import Cart, CartItem, Product

router = APIRouter(prefix="/cart", tags=["cart"])

def get_or_create_cart(db: Session, user: Optional[User], session_id: Optional[str]) -> Cart:
    if user:
        cart = db.query(Cart).filter(Cart.user_id == user.id, Cart.is_active == True).first()
        if not cart:
            cart = Cart(user_id=user.id, is_active=True)
            db.add(cart)
            db.commit()
            db.refresh(cart)
        return cart
    sid = session_id or "public"
    cart = db.query(Cart).filter(Cart.session_id == sid, Cart.is_active == True).first()
    if not cart:
        cart = Cart(session_id=sid, is_active=True)
        db.add(cart)
        db.commit()
        db.refresh(cart)
    return cart

def cart_response(cart: Cart, db: Session):
    items = []
    for ci in db.query(CartItem).filter(CartItem.cart_id == cart.id).all():
        p = db.query(Product).get(ci.product_id)
        items.append({
            "id": str(p.id),
            "name": p.name,
            "price": ci.unit_price,
            "quantity": ci.quantity,
            "image": p.image_url or ""
        })
    total = sum(i["price"] * i["quantity"] for i in items)
    return {"items": items, "total": total}

@router.get("")
def get_cart(
    db: Session = Depends(get_db),
    authorization: Optional[str] = Header(default=None),
    x_session_id: Optional[str] = Header(default=None)
):
    user: Optional[User] = None
    try:
        if authorization:
            from app.core.auth import get_current_user as gcu
            user = gcu.__wrapped__(token=authorization.split(" ")[1], db=db)  # bypass Depends
    except Exception:
        user = None
    cart = get_or_create_cart(db, user, x_session_id)
    return cart_response(cart, db)

@router.post("/add")
def add_to_cart(
    payload: dict,
    db: Session = Depends(get_db),
    authorization: Optional[str] = Header(default=None),
    x_session_id: Optional[str] = Header(default=None)
):
    user: Optional[User] = None
    try:
        if authorization:
            from app.core.auth import get_current_user as gcu
            user = gcu.__wrapped__(token=authorization.split(" ")[1], db=db)
    except Exception:
        user = None
    product_id = payload.get("productId")
    quantity = int(payload.get("quantity", 1))
    if not product_id:
        raise HTTPException(status_code=400, detail="productId is required")
    p = db.query(Product).get(int(product_id))
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    cart = get_or_create_cart(db, user, x_session_id)
    item = db.query(CartItem).filter(CartItem.cart_id == cart.id, CartItem.product_id == p.id).first()
    if item:
        item.quantity += quantity
    else:
        item = CartItem(cart_id=cart.id, product_id=p.id, quantity=quantity, unit_price=p.price)
        db.add(item)
    db.commit()
    return cart_response(cart, db)

@router.delete("/remove/{product_id}")
def remove_from_cart(
    product_id: int,
    db: Session = Depends(get_db),
    authorization: Optional[str] = Header(default=None),
    x_session_id: Optional[str] = Header(default=None)
):
    user: Optional[User] = None
    try:
        if authorization:
            from app.core.auth import get_current_user as gcu
            user = gcu.__wrapped__(token=authorization.split(" ")[1], db=db)
    except Exception:
        user = None
    cart = get_or_create_cart(db, user, x_session_id)
    item = db.query(CartItem).filter(CartItem.cart_id == cart.id, CartItem.product_id == product_id).first()
    if item:
        db.delete(item)
        db.commit()
    return {"ok": True}
