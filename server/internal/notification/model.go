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
	Notification_ID uint             `gorm:"primaryKey"`
	User_ID         uuid.UUID        `gorm:"type:char(36);not null;index" validate:"required"`
	Post_ID         uint             `gorm:"not null" validate:"required"`
	Chapter_ID      uint             `gorm:"not null" validate:"required"`
	Title           string           `gorm:"type:nvarchar(255);not null" validate:"required"`
	Content         string           `gorm:"type:longtext;not null" validate:"required"`
	NotiType        NotificationType `gorm:"type:int"`
	IsRead          bool             `gorm:"default:false"`
	CreatAt         time.Time        `gorm:"autoCreateTime"`
}
