package comment

import (
	"time"

	"github.com/google/uuid"
)

type Comment struct {
	comment_id uint `gorm:"primaryKey"`
	chapter_id uint `gorm:"not null"`
	user_id uuid.UUID `gorm:"type:uuid, not null"`
	icon_id uint
	image string `gorm:"type: varchar(255)"`
	createAt time.Time
	updateAt time.Time
}
