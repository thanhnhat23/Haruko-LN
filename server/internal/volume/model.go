package volume

import (
	"time"

	"gorm.io/gorm"
)

type Volume struct {
	Volume_ID uint `gorm:"primaryKey"`
	Post_ID   uint `gorm:"not null;index" validate:"required"`
	Number    uint
	Title     string `gorm:"type:nvarchar(255)"`
	Cover     string `gorm:"type:varchar(255)"`
	IsDeleted bool   `gorm:"default:false"`
	DeleteAt  time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
	CreateAt  time.Time      `gorm:"autoCreateTime"`
	UpdateAt  time.Time      `gorm:"autoUpdateTime"`
}
