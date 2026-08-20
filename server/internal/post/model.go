package post

import (
	"time"

	"github.com/google/uuid"
)
type PostStatus int
const (
	End PostStatus= iota
)
type Post struct {
	post_id uint `gorm:"primaryKey"`
	user_id uuid.UUID `gorm:"type:uuid; not null"`
	thumbnail string `gorm:"type: varchar(255)"`
	banner string `gorm:"type: varchar(255)"`
	slug string `gorm:"type: varchar(255); not null"`
	author string `gorm:"type: nvarchar(255)"`
	description string `gorm:"type: nvarchar(255)"`
	status PostStatus `gorm:"type:int"`
	views uint
	isDeleted bool
	createAt time.Time
	updateAt time.Time
}
