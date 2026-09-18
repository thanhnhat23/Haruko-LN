package bookmark

import (
	"time"

	"github.com/google/uuid"
)

type Bookmark struct {
	Bookmark_ID uint      `gorm:"primaryKey"`
	CreateAt    time.Time `gorm:"autoCreateTime"`
	User_ID     uuid.UUID `gorm:"type:char(36);not null;uniqueIndex:idx_user_post" validate:"required"`
	Post_ID     uint      `gorm:"not null;uniqueIndex:idx_user_post" validate:"required"`
}
