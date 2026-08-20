package follow

import (
	"time"

	"github.com/google/uuid"
)

type Follow struct {
	follow_id uint `gorm:"primaryKey"`
	user_id uuid.UUID `gorm:"type: UUID; not null"`
	post_id uint `gorn:"not null;index"`
	createAt time.Time
}
