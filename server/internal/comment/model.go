package comment

import (
	"time"

	"github.com/google/uuid"
)

type Comment struct {
	Comment_ID    uint `gorm:"primaryKey"`
	Chapter_ID    uint `gorm:"not null;index" validate:"required"`
	Post_ID       uint `gorm:"not null;index" validate:"required"`
	Parent_CMT_ID uint
	User_ID       uuid.UUID `gorm:"type:char(36);not null;index" validate:"required"`
	Icon_ID       uint
	Image         string    `gorm:"type:varchar(255)"`
	CreateAt      time.Time `gorm:"autoCreateTime"`
	UpdateAt      time.Time `gorm:"autoUpdateTime"`
	DeleteAt      time.Time
}
