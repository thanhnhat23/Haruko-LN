package rating

import (
	"time"

	"github.com/google/uuid"
)

type Rating struct {
	Rating_ID uint      `gorm:"primaryKey"`
	User_ID   uuid.UUID `gorm:"type:char(36);not null;index" validate:"required"`
	Post_ID   uint      `gorm:"not null;index" validate:"required"`
	Score     float32   `validate:"gte=0,lte=10"`
	Review    string    `gorm:"type:nvarchar(255)"`
	DeleteAt  time.Time
	CreateAt  time.Time
	UpdateAt  time.Time
}
