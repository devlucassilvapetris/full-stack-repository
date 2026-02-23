from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.models.order import Order, OrderItem
from app.models.product import Cart, CartItem, Product

router = APIRouter(prefix="/orders", tags=["orders"])

@router.get("")
def list_orders(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    orders = db.query(Order).filter(Order.user_id == user.id).order_by(Order.created_at.desc()).all()
    data = []
    for o in orders:
        data.append({
            "id": o.id,
            "status": o.status,
            "total": o.total
        })
    return {"orders": data}

@router.get("/{order_id}")
def get_order(order_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    o = db.query(Order).get(order_id)
    if not o or o.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    items = []
    for it in db.query(OrderItem).filter(OrderItem.order_id == o.id).all():
        p = db.query(Product).get(it.product_id)
        items.append({
            "productId": p.id,
            "name": p.name,
            "quantity": it.quantity,
            "unit_price": it.unit_price
        })
    return {"id": o.id, "status": o.status, "total": o.total, "items": items}

@router.post("/checkout")
def checkout(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    cart = db.query(Cart).filter(Cart.user_id == user.id, Cart.is_active == True).first()
    if not cart:
        raise HTTPException(status_code=400, detail="Cart is empty")
    cart_items = db.query(CartItem).filter(CartItem.cart_id == cart.id).all()
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")
    total = sum(it.unit_price * it.quantity for it in cart_items)
    order = Order(user_id=user.id, status="processing", total=total)
    db.add(order)
    db.commit()
    db.refresh(order)
    for it in cart_items:
        oi = OrderItem(order_id=order.id, product_id=it.product_id, quantity=it.quantity, unit_price=it.unit_price)
        db.add(oi)
        db.delete(it)
    cart.is_active = False
    db.commit()
    return {"id": order.id, "total": order.total, "status": order.status}
