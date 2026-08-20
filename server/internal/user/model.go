package user

import (
	"time"

	"github.com/google/uuid"
)
type roleEnum int
const(
	admin roleEnum = iota
	trans
	user
)
type User struct{
	user_id uuid.UUID `gorm:"type:uuid; primaryKey"`
	username string `gorm:"type:nvarchar(255);not null"`
	email string `gorm:"type:varchar(255);not null;index`
	passwordHash string `gorm:"type:varchar(255);not null"`
	birthday time.Time 
	role roleEnum `gorm:"type:int;not null"`
	avatar string `gorm:"type:varchar(255)"`
	background string `gorm:"type:varchar(255)"`
	bio string `gorm:"type:nvarchar(255)"`
	isVerify bool
	isBanned bool
	createAt time.Time
	updateAt time.Time
}