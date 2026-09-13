package user

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type RoleEnum string

const (
	roleAdmin  RoleEnum = "admin"
	roleTrans  RoleEnum = "trans"
	roleReader RoleEnum = "reader"
)

type User struct {
	User_ID      uuid.UUID `gorm:"type:char(36);primaryKey"`
	Username     string    `gorm:"type:nvarchar(255);not null;uniqueIndex" validate:"required,min=3,max=20"`
	Email        string    `gorm:"type:varchar(255);not null;uniqueIndex" validate:"required,email"`
	PasswordHash string    `gorm:"type:varchar(255)" validate:"required"`
	Birthday     *time.Time `validate:"omitempty"`
	Role         RoleEnum  `gorm:"type:varchar(255);not null;default:reader" validate:"required,oneof=reader trans admin"`
	Avatar       string    `gorm:"type:varchar(255)"`
	Background   string    `gorm:"type:varchar(255)"`
	Bio          string    `gorm:"type:nvarchar(255)"`
	IsVerify     bool      `gorm:"default:false"`
	IsBanned     bool      `gorm:"default:false"`
	CreateAt     time.Time `gorm:"autoCreateTime"`
	UpdateAt     time.Time `gorm:"autoUpdateTime"`
	DeleteAt     *time.Time
	DeletedAt    gorm.DeletedAt `gorm:"index"`
	IsTrans      bool
}

// BeforeCreate sinh User_ID nếu chưa có, tránh insert UUID Nil trùng khóa chính.
func (u *User) BeforeCreate(tx *gorm.DB) error {
	if u.User_ID == uuid.Nil {
		id, err := uuid.NewV7()
		if err != nil {
			return err
		}
		u.User_ID = id
	}
	return nil
}
