package notification

import (
	"time"

	"github.com/google/uuid"
)

type NotificationType int

const (
	newchap NotificationType = iota
)

type Notification struct {
	notification_id uint             `gorm:"primaryKey"`
	user_id         uuid.UUID        `gorm:"type: uuid; not null"`
	post_id         uint             `gorm:"not null"`
	chapter_id      uint             `gorm:"not null"`
	title           string           `gorm:"type: nvarchar(255);not null"`
	content         string           `gorm:"type: longtext; not null" validate:"required"`
	noti_type       NotificationType `gorm:"type: int"`
	isRead          bool
	creatAt         time.Time
}
