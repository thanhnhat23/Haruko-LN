package chapter

import (
	"time"

	"github.com/shopspring/decimal"
)

type Chapter struct {
	chapter_id uint `gorm:"primaryKey"`
	volume_id uint `gorm:"not null;"`
	chapterNumber decimal.Decimal `gorm:"type: decimal(7,2);"`
	content string `gorm:"type: longtext;not null;"`
	title string `gorm:"type: nvarchar(255); not null; index"`
	wordCount uint
	isLocked bool
	orderindex uint
	createAt time.Time
	updateAt time.Time
}
