package user

import (
	"time"

	"github.com/google/uuid"
)

type roleEnum string

const (
	roleAdmin  roleEnum = "admin"
	roleTrans  roleEnum = "trans"
	roleReader roleEnum = "reader"
)

type User struct {
	user_id      uuid.UUID `gorm:"type:uuid; primaryKey"`
	username     string    `gorm:"type:nvarchar(255);not null;uniqueIndex" validate:"required,min=3,max=20"`
	email        string    `gorm:"type:varchar(255);not null;uniqueIndex" validate:"required,email"`
	passwordHash string    `gorm:"type:varchar(255);not null"`
	birthday     time.Time `validate:"omitempty"	`
	role         roleEnum  `gorm:"type:varchar(255);not null;default:reader" validate:"required,oneof=reader trans admin"`
	avatar       string    `gorm:"type:varchar(255)"`
	background   string    `gorm:"type:varchar(255)"`
	bio          string    `gorm:"type:nvarchar(255)"`
	isVerify     bool      `gorm:"default:false"`
	isBanned     bool      `gorm:"default:false"`
	createAt     time.Time
	updateAt     time.Time
	deleteAt     time.Time
}
