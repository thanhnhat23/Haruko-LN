package comment

import (
	"time"

	"github.com/google/uuid"
)

type Comment struct {
	comment_id uint      `gorm:"primaryKey"`
	chapter_id uint      `gorm:"not null;index"`
	user_id    uuid.UUID `gorm:"type:uuid;not null;index"`
	icon_id    uint
	image      string `gorm:"type: varchar(255);not null"`
	createAt   time.Time
	updateAt   time.Time
}
