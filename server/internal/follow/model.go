package follow

import (
	"time"

	"github.com/google/uuid"
)

type Follow struct {
	follow_id uint      `gorm:"primaryKey"`
	user_id   uuid.UUID `gorm:"type: UUID; not null;uniqueIndex:index_user_post"`
	post_id   uint      `gorm:"not null;uniqueIndex:index_user_post"`
	createAt  time.Time
}
