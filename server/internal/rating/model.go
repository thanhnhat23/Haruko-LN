package rating

import "github.com/google/uuid"

type Rating struct {
	rating_id uint      `gorm:"primaryKey"`
	user_id   uuid.UUID `gorm:"type:uuid;not null;index"`
	post_id   uint      `gorm:"not null;index"`
	score     float32   `validate:"gte=0,lte=10"`
	review    string    `gorm:"type:nvarchar(255)"`
}
