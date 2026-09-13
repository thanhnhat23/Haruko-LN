package post

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type PostStatus string

const (
	End  PostStatus = "End"
	Drop PostStatus = "Drop"
)

type Post struct {
	Post_ID     uint       `gorm:"primaryKey"`
	User_ID     uuid.UUID  `gorm:"type:char(36);not null;index" validate:"required"`
	Thumbnail   string     `gorm:"type:varchar(255)"`
	Banner      string     `gorm:"type:varchar(255)"`
	Slug        string     `gorm:"type:varchar(255);not null;uniqueIndex" validate:"required"`
	Author      string     `gorm:"type:nvarchar(255)"`
	Description string     `gorm:"type:nvarchar(255)"`
	Status      PostStatus `gorm:"type:varchar(255)" validate:"required,oneof=Drop End"`
	Views       uint       `gorm:"default:0"`
	IsDeleted   bool       `gorm:"default:false"`
	DeleteAt    time.Time
	DeletedAt   gorm.DeletedAt `gorm:"index"`
	CreateAt    time.Time      `gorm:"autoCreateTime"`
	UpdateAt    time.Time      `gorm:"autoUpdateTime"`
}
