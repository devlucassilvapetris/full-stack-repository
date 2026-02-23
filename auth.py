from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_password_hash, verify_password, create_access_token
from app.models.user import User, UserRole
from app.schemas.user import UserCreate, LoginRequest

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
def register(data: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter((User.email == data.email) | (User.username == data.username)).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email or username already exists")
    user = User(
        email=data.email,
        username=data.username,
        full_name=data.full_name or data.username,
        hashed_password=get_password_hash(data.password),
        role=UserRole.USER
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token(str(user.id))
    return {
        "token": token,
        "user": {
            "id": str(user.id),
            "email": user.email,
            "name": user.full_name or user.username,
            "role": user.role.value
        }
    }

@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token(str(user.id))
    return {
        "token": token,
        "user": {
            "id": str(user.id),
            "email": user.email,
            "name": user.full_name or user.username,
            "role": user.role.value
        }
    }
