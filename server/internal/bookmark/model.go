package bookmark

import (
	"time"
	"github.com/google/uuid"
	"github.com/go-playground/validator/v10"
)

type Bookmark struct {
	bookmark_id uint `gorm:"primaryKey"`
	create_at time.Time
	user_id uuid.UUID `gorm:"type: uuid;not null"`
	post_id uint `gorm:"not null"`

}
