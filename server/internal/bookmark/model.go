package bookmark

import (
	"time"

	"github.com/google/uuid"
)

type Bookmark struct {
	bookmark_id uint `gorm:"primaryKey"`
	create_at   time.Time
	user_id     uuid.UUID `gorm:"type:uuid;not null;uniqueIndex:idx_user_post"`
	post_id     uint      `gorm:"not null;uniqueIndex:idx_user_post"`
}
