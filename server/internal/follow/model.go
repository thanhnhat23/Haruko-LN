package follow

import (
	"time"

	"github.com/google/uuid"
)

type Follow struct {
	Follow_ID uint      `gorm:"primaryKey"`
	User_ID   uuid.UUID `gorm:"type:char(36);not null;uniqueIndex:index_user_post" validate:"required"`
	Post_ID   uint      `gorm:"not null;uniqueIndex:index_user_post" validate:"required"`
	CreateAt  time.Time `gorm:"autoCreateTime"`
}
