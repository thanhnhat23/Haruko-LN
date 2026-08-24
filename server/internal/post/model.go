package post

import (
	"time"

	"github.com/google/uuid"
)

type postStatus string

const (
	End  postStatus = "End"
	Drop postStatus = "Drop"
)

type Post struct {
	post_id     uint       `gorm:"primaryKey"`
	user_id     uuid.UUID  `gorm:"type:uuid; not null;index"`
	thumbnail   string     `gorm:"type: varchar(255)"`
	banner      string     `gorm:"type: varchar(255)"`
	slug        string     `gorm:"type: varchar(255); not null;uniqueIndex" validate:"required"`
	author      string     `gorm:"type: nvarchar(255)"`
	description string     `gorm:"type: nvarchar(255)"`
	status      postStatus `gorm:"type:varchar(255)" validate:"required,oneof= Drop End"`
	views       uint       `gorm:"default:0"`
	isDeleted   bool       `gorm:"default:0"`
	deleteAt    time.Time
	createAt    time.Time
	updateAt    time.Time
}
